"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Size = void 0;
const type_info_js_1 = require("./type_info.js");
const internal_js_1 = require("./internal.js");
/**
 * Generates message size() and __size helper methods
 */
class Size {
    constructor(p, globals) {
        this.p = p;
        this.globals = globals;
        this.sizer = 'Sizer';
        this.sizer = [internal_js_1.embedNamespace, 'Sizer'].join('.');
    }
    start() {
        this.p(`
            public size():u32 {
                let size:u32 = 0;
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
    finish() {
        this.p(`
                return size;
            }
        `);
    }
    tagSize(field) {
        return this.valueSize((field.number << 3) | field.wireType);
    }
    // Returns the expression which calculates the length of a constant
    length(varName) {
        return `${this.sizer}.varint64(${varName})`;
    }
    // Returns the expression which calculates an elementary value size
    elementarySize(field, type, varName, tag = true, // Caclculate tag size (false for packed array elements)
    skipZeroValue = true) {
        const el = [];
        // If the tag is required
        if (tag) {
            el.push(this.tagSize(field));
        }
        // If a field is a string or bytes array, it is taken into account only when it's non empty
        // and is calculated at runtime
        if (field.isCollection) {
            el.push(this.length(`${varName}.length`), `${varName}.length`);
            // size = size of a tag + size of a length + length itself
            if (skipZeroValue) {
                return `${varName}.length > 0 ? ${el.join(' + ')} : 0`;
            }
            return el.join(' + ');
        }
        el.push(type.fixedSize
            ? type.fixedSize.toString()
            : `${this.sizer}.${type.method}(${varName})`);
        return skipZeroValue ?
            `${varName} == 0 ? 0 : ${el.join(' + ')}` :
            el.join(' + ');
    }
    // Elementary non repeated
    elementary(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const s = this.elementarySize(field, type, `this.${field.name}`);
        if (s != '') {
            this.p(`size += ${s}`);
        }
    }
    // Elementary repeated
    elementaryRepeated(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const name = `__size_${type.method}_repeated`;
        this.globals.registerGlobal(name, `
            function ${name}(value: ${type.collectionTypeName}): u32 {
                let size:u32 = 0;

                for (let n:i32 = 0; n < value.length; n++) {
                    size += ${this.elementarySize(field, type, `value[n]`, true, false)}
                }
                
                return size;
            }
        `);
        this.p(`
            size += ${name}(this.${field.name});
        `);
    }
    // Elementary repeated, packed
    elementaryRepeatedPacked(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const name = `__size_${type.method}_repeated_packed`;
        this.globals.registerGlobal(name, `
            function ${name}(value: ${type.collectionTypeName}): u32 {
                let size:u32 = 0;

                for (let n:i32 = 0; n < value.length; n++) {
                    size += ${this.elementarySize(field, type, `value[n]`, false, false)}
                }
                
                return size;
            }
        `);
        this.p(`
            if (this.${field.name}.length > 0) {
                const packedSize = ${name}(this.${field.name});                
                if (packedSize > 0) {
                    size += ${this.tagSize(field)} + ${this.length('packedSize')} + packedSize
                }
            }
        `);
    }
    // Singular message (if it's size > 0)
    message(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const f = `this.${field.name}`;
        this.p(`
            if (${f} != null) {
                const f:${type.typeName} = ${f} as ${type.typeName};
                const messageSize = f.size();

                if (messageSize > 0) {
                    size += ${this.tagSize(field)} + ${this.length('messageSize')} + messageSize
                }
            }
        `);
    }
    // Repeated message
    messageRepeated(field) {
        const f = `this.${field.name}`;
        this.p(`
            for (let n:i32 = 0; n < ${f}.length; n++) {
                const messageSize = ${f}[n].size();

                if (messageSize > 0) {
                    size += ${this.tagSize(field)} + ${this.length('messageSize')} + messageSize
                }
            }
        `);
    }
    map(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        const f = `this.${field.name}`;
        const keyTypeInfo = type.keyTypeInfo;
        const valueTypeInfo = type.valueTypeInfo;
        const name = `__sizeMapEntry_${(0, internal_js_1.relativeName)(keyTypeInfo.typeName)}_${(0, internal_js_1.relativeName)(valueTypeInfo.typeName)}`;
        // Returns size of a map item when it's elementary => elementary
        if (field.value.kind == 'field_elementary') {
            this.globals.registerGlobal(name, `
                function ${name}(key: ${keyTypeInfo.typeName}, value: ${valueTypeInfo.typeName}): u32 {
                    return (${this.elementarySize(field.key, keyTypeInfo, 'key')}) + 
                           (${this.elementarySize(field.value, valueTypeInfo, 'value')});
                }
            `);
        }
        else {
            // Otherwise, that's a map of elementary => message
            this.globals.registerGlobal(name, `
                function ${name}(key: ${keyTypeInfo.typeName}, value: ${valueTypeInfo.typeName}): u32 {
                    const keySize = ${this.elementarySize(field.key, keyTypeInfo, 'key')};
                    const valueSize = value.size();

                    if (valueSize == 0) {
                        return keySize;
                    }

                    return keySize + ${this.tagSize(field.value)} + ${this.length('valueSize')} + valueSize;
                }
            `);
        }
        this.p(`
            if (${f}.size > 0) {
                const keys = ${f}.keys()

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    const value = ${f}.get(key)
                    const itemSize = ${name}(key, value)
                    if (itemSize > 0) {
                        size += ${this.tagSize(field)} + ${this.length('itemSize')} + itemSize;
                    }
                }
            }
        `);
    }
    // Returns size of a value, that's the TS counterpart of the AS sizer method
    valueSize(value) {
        return value < 128
            ? 1 // 2^7
            : value < 16384
                ? 2 // 2^14
                : value < 2097152
                    ? 3 // 2^21
                    : value < 268435456
                        ? 4 // 2^28
                        : value < 34359738368
                            ? 5 // 2^35
                            : value < 4398046511104
                                ? 6 // 2^42
                                : value < 562949953421312
                                    ? 7 // 2^49
                                    : value < 72057594037927936
                                        ? 8 // 2^56
                                        : value < 9223372036854775808
                                            ? 9 // 2^63
                                            : 10;
    }
}
exports.Size = Size;
//# sourceMappingURL=size.js.map