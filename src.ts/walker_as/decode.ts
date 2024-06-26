import { decorated } from '../proto/index.js';

import { Writer, GlobalsRegistry } from './index.js';
import { relativeName, embedNamespace } from './internal.js';
import { Field } from "./field.js";
import { OneOf } from "./one_of.js";
import { Options } from "../options.js";
import { getTypeInfo, TypeInfo } from './type_info.js';

/**
 * Generates decode() method
 */
export class Decode {
    private decoder = 'SafeDecoder';
    public decodeType: string = "Type";

    constructor(private p: Writer, private globals: GlobalsRegistry, private options:Options) {
        this.decoder = [embedNamespace, "SafeDecoder"].join(".");
    }

    start(message: decorated.Message) {
        const t = relativeName(message.relativeName);
	this.decodeType = t;

        this.p(`  
            // Decodes ${t} from an ArrayBuffer
            static decode(buf: ArrayBuffer):${t} {
                return ${t}.decodeDataView(new DataView(buf))
            }
            
            // Decodes ${t} from a DataView
            static decodeDataView(view: DataView): ${t} {
                const decoder = new ${this.decoder}(view);
                const obj = new ${t}();
        `);
    }

    begin() {
        this.p(this.beginMessageDecode());
    }

    end() {
        this.p(`
            ${this.endMessageDecode()}
	    if (decoder.invalid()) return changetype<${this.decodeType}>(0);
            return obj;
        `);
    }

    finish(message: decorated.Message) {
        this.p(`
            } // decode ${relativeName(message.relativeName)}
        `);
    }

    field(field: decorated.Field) {
        const type = getTypeInfo(field);

        this.p(`case ${field.number}: {`);

        switch(field.kind) {
            case "field_elementary":
                this.elementary(field, type)
                break;
            case "field_elementary_repeated":
                if (field.packed) {
                    this.repeatedElementaryPacked(field, type)
                } else {
                    this.repeatedElementary(field, type)                    
                }
                break;
            case "field_message":
                this.message(field, type)
                break;
            case "field_message_repeated":
                this.repeatedMessage(field, type)
                break;
            case "field_map":
                this.map(field, type)
                break;
            case "field_map_message":
                this.map(field, type)
                break;
        }

        // If a field belongs to oneOf we need to set discriminator value
        if (decorated.isOneOf(field)) {
            if (field.oneOf != undefined) {
                this.p(`obj.${OneOf.varName(this.options, field.parentID, field.oneOf)} = "${field.name}";`)
                this.p(`obj.${OneOf.indexVarName(this.options, field.parentID, field.oneOf)} = ${field.number};`)
            }
        }

        this.p(`break;
            }`);
    }

    private elementary(field: decorated.Field, type: TypeInfo) {
        this.p(`obj.${field.name} = ${this.decodeElementary(type)};`);
    }

    private repeatedElementary(field: decorated.Field, type: TypeInfo) {
        this.p(`obj.${field.name}.push(decoder.${type.method}());`)
    }

    private repeatedElementaryPacked(field: decorated.Field, type: TypeInfo) {
        this.p(`
            const endPos = decoder.pos + decoder.uint32();
            while (decoder.pos <= endPos) {
                obj.${field.name}.push(${this.decodeElementary(type)});
            }
        `)
    }

    private message(field: decorated.Field, type: TypeInfo) {
        this.p(this.decodeMessage(type, `obj.${field.name}`));
    }

    private repeatedMessage(field: decorated.Field, type: TypeInfo) {
        this.p(`
            ${this.readLength()}
            obj.${field.name}.push(${type.typeName}.decodeDataView(${this.newDataView()}));
            ${this.skipLength()}
        `);
    }

    private map(field: decorated.FieldMap | decorated.FieldMapMessage, type: TypeInfo) {
        const decoderName = this.registerMapMethod(field, type);
        this.p(`
            ${this.readLength()}
            ${decoderName}(decoder, length, obj.${field.name})
            ${this.skipLength()}
        `)
    }

    private beginMessageDecode(): string {
        return `
            while (!decoder.eof()) {
                const tag = decoder.tag();
                const number = tag >>> 3
                
                switch(number) {`;
    }

    private endMessageDecode(): string {
        return `                    
                default:
                    decoder.skipType(tag & 7);
                    break;
                }
            }`;
    }

    private newDataView(parentDecoder = "decoder"): string {
        return `new DataView(${parentDecoder}.view.buffer, ${parentDecoder}.pos+${parentDecoder}.view.byteOffset, length)`;
    }

    private readLength():string {
        return `const length = decoder.uint32();`;
    }

    private skipLength(): string {
        return `decoder.skip(length);`;
    }

    private decodeElementary(type: TypeInfo): string {
        return `decoder.${type.method}()`
    }

    private decodeMessage(type: TypeInfo, varName: string): string {
        return (`
            ${this.readLength()}
            ${varName} = ${type.typeName}.decodeDataView(${this.newDataView()})
            ${this.skipLength()}
        `);
    }

    private registerMapMethod(field: decorated.FieldMap | decorated.FieldMapMessage, type: TypeInfo):string {
        const mapTypeName = getTypeInfo(field).collectionTypeName
        const keyTypeInfo = type.keyTypeInfo as TypeInfo
        const valueTypeInfo = type.valueTypeInfo as TypeInfo
        const name = `__decodeMap_${relativeName(keyTypeInfo.typeName as string)}_${relativeName(valueTypeInfo.typeName as string)}`;

        const decodeValue = field.kind == "field_map" ? `value = ${this.decodeElementary(valueTypeInfo)};` : this.decodeMessage(valueTypeInfo, "value");

        this.globals.registerGlobal(name, `
            function ${name}(parentDecoder: ${this.decoder}, length: i32, map: ${mapTypeName}):void {
                const decoder = new ${this.decoder}(${this.newDataView("parentDecoder")});
                
                let key:${Field.typeDecl(field.key, keyTypeInfo, this.options)};
                let value:${Field.typeDecl(field.value, valueTypeInfo, this.options)};
        
                ${this.beginMessageDecode()}
                case 1: {
                    key = ${this.decodeElementary(keyTypeInfo)};
                    break;
                }

                case 2: {
                    ${decodeValue}
                    break;
                }
                ${this.endMessageDecode()}
                map.set(key as ${keyTypeInfo.typeName}, value as ${type.valueTypeInfo?.typeName});    
            }
        `)

        return name;
    }
}
