"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = void 0;
const internal_js_1 = require("./internal.js");
/**
 * Enum code blocks
 */
class Enum {
    constructor(p) {
        this.p = p;
    }
    start(en) {
        this.p((0, internal_js_1.deprecatedComment)(en));
        this.p((0, internal_js_1.comment)(en));
        this.p(`export enum ${(0, internal_js_1.relativeName)(en.relativeName)} {`);
    }
    value(item) {
        this.p((0, internal_js_1.comment)(item));
        this.p(`${item.name} = ${item.number}, ${(0, internal_js_1.deprecatedComment)(item)}`);
    }
    finish(en) {
        this.p(`} // ${(0, internal_js_1.relativeName)(en.relativeName)}`);
    }
}
exports.Enum = Enum;
//# sourceMappingURL=enum.js.map