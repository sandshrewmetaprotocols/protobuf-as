"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const type_info_js_1 = require("./type_info.js");
const internal_js_1 = require("./internal.js");
/**
 * Field code blocks
 */
class Field {
    constructor(p, options) {
        this.p = p;
        this.options = options;
    }
    // Returns field type with default if required
    static typeDecl(field, type, options) {
        switch (field.kind) {
            case "field_elementary":
                return `${type.typeName}${type.default ? ` = ${type.default}` : ''}`;
            case "field_message": {
                const expr = options.nullable == true ?
                    '| null' : (field.oneOf != undefined ? '| null' : `= new ${type.typeName}()`);
                return `${type.typeName}${expr}`;
            }
            case "field_message_repeated":
            case "field_elementary_repeated":
            case "field_map":
            case "field_map_message":
                return `${type.collectionTypeName} = new ${type.collectionTypeName}();`;
        }
    }
    decl(field) {
        const type = (0, type_info_js_1.getTypeInfo)(field);
        this.p((0, internal_js_1.comment)(field));
        switch (field.kind) {
            case "field_elementary":
                this.p(`public ${field.name}:${Field.typeDecl(field, type, this.options)};`);
                break;
            case "field_message":
                this.p(`public ${field.name}:${Field.typeDecl(field, type, this.options)};`);
                break;
            case "field_message_repeated":
            case "field_elementary_repeated":
            case "field_map":
            case "field_map_message":
                this.p(`public ${field.name}:${Field.typeDecl(field, type, this.options)};`);
                break;
        }
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map