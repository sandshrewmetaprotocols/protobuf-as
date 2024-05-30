"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneOf = void 0;
const index_js_1 = require("../proto/index.js");
const change_case_1 = __importDefault(require("change-case"));
/**
 * OneOf code blocks
 */
class OneOf {
    constructor(p, options) {
        this.p = p;
        this.options = options;
    }
    discriminatorDecl(desc, group) {
        const varName = OneOf.varName(this.options, desc.id, group);
        const indexVarName = OneOf.indexVarName(this.options, desc.id, group);
        this.p(`
            public ${varName}:string = "";
            public ${indexVarName}:u8 = 0;
        `);
    }
    discriminatorConst(field) {
        if (!index_js_1.decorated.isOneOf(field)) {
            return;
        }
        if (field.oneOf == undefined) {
            return;
        }
        const name = change_case_1.default.snakeCase(field.oneOf + " " + field.name.replace(/[.]+/g, "_") + " index").toUpperCase();
        this.p(`static readonly ${name}:u8 = ${field.number};`);
    }
    static varName(options, id, f) {
        if (options.oneOf) {
            const path = id + "." + f;
            const varName = options.oneOf.get(path);
            if (varName) {
                return varName;
            }
        }
        return `__${f}`;
    }
    static indexVarName(options, id, f) {
        return OneOf.varName(options, id, f) + "_index";
    }
}
exports.OneOf = OneOf;
//# sourceMappingURL=one_of.js.map