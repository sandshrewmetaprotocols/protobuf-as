"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decode = void 0;
const index_js_1 = require("../proto/index.js");
const internal_js_1 = require("./internal.js");
const field_js_1 = require("./field.js");
const one_of_js_1 = require("./one_of.js");
const type_info_js_1 = require("./type_info.js");
/**
 * Generates decode() method
 */
class Decode {
    constructor(p, globals, options) {
        this.p = p;
        this.globals = globals;
        this.options = options;
        this.decoder = 'SafeDecoder';
        this.decodeType = "Type";
        this.decoder = [internal_js_1.embedNamespace, "SafeDecoder"].join(".");
    }
    start(message) {
        const t = (0, internal_js_1.relativeName)(message.relativeName);
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
    finish(message) {
        this.p(`
            } // decode ${(0, internal_js_1.relativeName)(message.relativeName)}
        `);
    }
    field(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        this.p(`case ${field.number}: {`);
        switch (field.kind) {
            case "field_elementary":
                this.elementary(field, type);
                break;
            case "field_elementary_repeated":
                if (field.packed) {
                    this.repeatedElementaryPacked(field, type);
                }
                else {
                    this.repeatedElementary(field, type);
                }
                break;
            case "field_message":
                this.message(field, type);
                break;
            case "field_message_repeated":
                this.repeatedMessage(field, type);
                break;
            case "field_map":
                this.map(field, type);
                break;
            case "field_map_message":
                this.map(field, type);
                break;
        }
        // If a field belongs to oneOf we need to set discriminator value
        if (index_js_1.decorated.isOneOf(field)) {
            if (field.oneOf != undefined) {
                this.p(`obj.${one_of_js_1.OneOf.varName(this.options, field.parentID, field.oneOf)} = "${field.name}";`);
                this.p(`obj.${one_of_js_1.OneOf.indexVarName(this.options, field.parentID, field.oneOf)} = ${field.number};`);
            }
        }
        this.p(`break;
            }`);
    }
    elementary(field, type) {
        this.p(`obj.${field.name} = ${this.decodeElementary(type)};`);
    }
    repeatedElementary(field, type) {
        this.p(`obj.${field.name}.push(decoder.${type.method}());`);
    }
    repeatedElementaryPacked(field, type) {
        this.p(`
            const endPos = decoder.pos + decoder.uint32();
            while (decoder.pos <= endPos) {
                obj.${field.name}.push(${this.decodeElementary(type)});
            }
        `);
    }
    message(field, type) {
        this.p(this.decodeMessage(type, `obj.${field.name}`));
    }
    repeatedMessage(field, type) {
        this.p(`
            ${this.readLength()}
            obj.${field.name}.push(${type.typeName}.decodeDataView(${this.newDataView()}));
            ${this.skipLength()}
        `);
    }
    map(field, type) {
        const decoderName = this.registerMapMethod(field, type);
        this.p(`
            ${this.readLength()}
            ${decoderName}(decoder, length, obj.${field.name})
            ${this.skipLength()}
        `);
    }
    beginMessageDecode() {
        return `
            while (!decoder.eof()) {
                const tag = decoder.tag();
                const number = tag >>> 3
                
                switch(number) {`;
    }
    endMessageDecode() {
        return `                    
                default:
                    decoder.skipType(tag & 7);
                    break;
                }
            }`;
    }
    newDataView(parentDecoder = "decoder") {
        return `new DataView(${parentDecoder}.view.buffer, ${parentDecoder}.pos+${parentDecoder}.view.byteOffset, length)`;
    }
    readLength() {
        return `const length = decoder.uint32();`;
    }
    skipLength() {
        return `decoder.skip(length);`;
    }
    decodeElementary(type) {
        return `decoder.${type.method}()`;
    }
    decodeMessage(type, varName) {
        return (`
            ${this.readLength()}
            ${varName} = ${type.typeName}.decodeDataView(${this.newDataView()})
            ${this.skipLength()}
        `);
    }
    registerMapMethod(field, type) {
        const mapTypeName = (0, type_info_js_1.getTypeInfo)(field).collectionTypeName;
        const keyTypeInfo = type.keyTypeInfo;
        const valueTypeInfo = type.valueTypeInfo;
        const name = `__decodeMap_${(0, internal_js_1.relativeName)(keyTypeInfo.typeName)}_${(0, internal_js_1.relativeName)(valueTypeInfo.typeName)}`;
        const decodeValue = field.kind == "field_map" ? `value = ${this.decodeElementary(valueTypeInfo)};` : this.decodeMessage(valueTypeInfo, "value");
        this.globals.registerGlobal(name, `
            function ${name}(parentDecoder: ${this.decoder}, length: i32, map: ${mapTypeName}):void {
                const decoder = new ${this.decoder}(${this.newDataView("parentDecoder")});
                
                let key:${field_js_1.Field.typeDecl(field.key, keyTypeInfo, this.options)};
                let value:${field_js_1.Field.typeDecl(field.value, valueTypeInfo, this.options)};
        
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
        `);
        return name;
    }
}
exports.Decode = Decode;
//# sourceMappingURL=decode.js.map