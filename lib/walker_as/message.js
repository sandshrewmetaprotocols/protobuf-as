"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const internal_js_1 = require("./internal.js");
const path_1 = require("path");
const fs_1 = require("fs");
/**
 * Message code blocks
 */
class Message {
    constructor(p, options) {
        this.p = p;
        this.options = options;
        this.ext = new Map();
        if (!options.stdext) {
            return;
        }
        const extPath = (0, path_1.normalize)((0, path_1.join)(__dirname, "../../assembly/ext"));
        const exts = (0, fs_1.readdirSync)(extPath);
        this.addExt(extPath, exts);
        if (options.customext) {
            const customExts = (0, fs_1.readdirSync)(options.customext);
            this.addExt(options.customext, customExts);
        }
    }
    addExt(base, exts) {
        exts.forEach(f => this.ext.set((0, path_1.parse)(f).name, (0, fs_1.readFileSync)((0, path_1.join)(base, f)).toString()));
    }
    start(message) {
        this.p((0, internal_js_1.comment)(message));
        this.p(`export class ${(0, internal_js_1.relativeName)(message.relativeName)} {`);
    }
    finish(message) {
        if (this.ext.has(message.id)) {
            this.p(this.ext.get(message.id));
        }
        this.p(`
        } // ${(0, internal_js_1.relativeName)(message.relativeName)}
        `);
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map