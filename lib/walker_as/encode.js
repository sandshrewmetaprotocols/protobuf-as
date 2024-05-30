"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encode = void 0;
const internal_js_1 = require("./internal.js");
const type_info_js_1 = require("./type_info.js");
/**
 * Generates encode() method
 */
class Encode {
    constructor(p) {
        this.p = p;
        this.encoder = 'Encoder';
        this.encoder = [internal_js_1.embedNamespace, 'Encoder'].join('.');
    }
    start(message) {
        const t = (0, internal_js_1.relativeName)(message.relativeName);
        this.p(`
            // Encodes ${t} to the ArrayBuffer
            encode(): ArrayBuffer {
                return changetype<ArrayBuffer>(
                    StaticArray.fromArray<u8>(this.encodeU8Array())
                );
            }
        
            // Encodes ${t} to the Array<u8>
            encodeU8Array(encoder: ${this.encoder} = new ${this.encoder}(new Array<u8>())):Array<u8> {
                const buf = encoder.buf;
        `);
    }
    begin() {
        // noop
    }
    end() {
        // noop
    }
    finish(message) {
        this.p(`
                return buf;
            } // encode ${(0, internal_js_1.relativeName)(message.relativeName)}
        `);
    }
    field(field) {
        switch (field.kind) {
            case 'field_elementary':
                this.elementary(field);
                break;
            case 'field_elementary_repeated':
                if (field.packed) {
                    this.elementaryRepeatedPacked(field);
                }
                else {
                    this.elementaryRepeated(field);
                }
                break;
            case 'field_message':
                this.message(field);
                break;
            case 'field_message_repeated':
                this.messageRepeated(field);
                break;
            case 'field_map':
            case 'field_map_message':
                this.map(field);
                break;
        }
    }
    // TODO: Calculate statically
    // Returns the expression which encodes tag value
    tag(field) {
        return `encoder.uint32(0x${((field.number << 3) |
            field.wireType).toString(16)})`;
    }
    // Returns the expression which encodes length of a variable
    length(varName) {
        return `encoder.uint32(${varName})`;
    }
    // Returns the expression which encodes a value
    value(type, varName) {
        return `encoder.${type.method}(${varName})`;
    }
    // Returns the expression which encodes a message
    encodeMessage(field, varName) {
        return `
            const messageSize = ${varName}.size()

            if (messageSize > 0) {
                ${this.tag(field)}
                ${this.length('messageSize')}
                ${varName}.encodeU8Array(encoder);
            }
        `;
    }
    // Returns the expression which encodes an elementary value
    encodeElementary(field, type, varName, tag = true, // Encode tag (false for packed collection element)
    skipZeroValue = true) {
        const el = [];
        const encodeVar = this.value(type, varName);
        if (tag) {
            el.push(this.tag(field));
        }
        if (field.isCollection) {
            el.push(this.length(`${varName}.length`));
            el.push(encodeVar);
            if (skipZeroValue) {
                return `if (${varName}.length > 0) { ${el.join('; ')} }`;
            }
            return el.join('; ');
        }
        el.push(encodeVar);
        return skipZeroValue ? `if (${varName} != 0) { ${el.join('; ')} }` : el.join('; ');
    }
    // Elementary non repeated
    elementary(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const s = this.encodeElementary(field, type, `this.${field.name}`);
        if (s != '') {
            this.p(s);
        }
    }
    // Elementary repeated
    elementaryRepeated(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const f = `this.${field.name}`;
        this.p(`
            if (${f}.length > 0) {
                for (let n:i32 = 0; n < ${f}.length; n++) {
                    ${this.encodeElementary(field, type, `${f}[n]`, true, false)}
                }
            }
        `);
    }
    // Elementary repeated packed
    elementaryRepeatedPacked(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const f = `this.${field.name}`;
        this.p(`
            if (${f}.length > 0) {
                ${this.tag(field)}
                ${this.length(`__size_${type.method}_repeated_packed(${f})`)}

                for (let n:i32 = 0; n < ${f}.length; n++) {
                    ${this.encodeElementary(field, type, `${f}[n]`, false, false)}
                }
            }
        `);
    }
    // Message
    message(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        this.p(`
            if (this.${field.name} != null) {
                const f = this.${field.name} as ${type.typeName};
                ${this.encodeMessage(field, 'f')}
            }
        `);
    }
    // Message repeated
    messageRepeated(field) {
        const f = `this.${field.name}`;
        this.p(`
            for (let n:i32 = 0; n < ${f}.length; n++) {
                ${this.encodeMessage(field, `${f}[n]`)}
            }
        `);
    }
    // Map
    map(field) {
        const f = `this.${field.name}`;
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const sizeMethodName = `__sizeMapEntry_${(0, internal_js_1.relativeName)(type.keyTypeInfo?.typeName)}_${(0, internal_js_1.relativeName)(type.valueTypeInfo?.typeName)}`;
        const encodeValue = field.value.kind == 'field_elementary'
            ? this.encodeElementary(field.value, type.valueTypeInfo, 'value')
            : this.encodeMessage(field.value, 'value');
        this.p(`
            if (${f}.size > 0) {
                const keys = ${f}.keys();
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    const value = ${f}.get(key)
                    const size = ${sizeMethodName}(key, value);
                    if (size > 0) {
                        ${this.tag(field)}
                        ${this.length('size')}
                        ${this.encodeElementary(field.key, type.keyTypeInfo, 'key')}
                        ${encodeValue}
                    }
                }
            }
        `);
    }
}
exports.Encode = Encode;
//# sourceMappingURL=encode.js.map