"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksSingleFile = void 0;
const fs_1 = require("fs");
const internal_js_1 = require("./internal.js");
/**
 * Before and after code blocks
 */
class BlocksSingleFile {
    constructor(p) {
        this.p = p;
    }
    beforeAll() {
        this.p(`namespace ${internal_js_1.embedNamespace} {`);
        internal_js_1.staticFiles.forEach(f => this.p((0, fs_1.readFileSync)(f).toString()), this);
        this.p(`};`);
    }
    afterAll(globals) {
        globals.forEach((value, key) => {
            this.p(`
                // ${key}
                ${value}
            `);
        });
    }
}
exports.BlocksSingleFile = BlocksSingleFile;
//# sourceMappingURL=blocks_single_file.js.map