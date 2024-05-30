"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceSingleFile = void 0;
/**
 * Namespace code blocks
 */
class NamespaceSingleFile {
    constructor(p) {
        this.p = p;
    }
    start(ns) {
        if (ns.name == "") {
            return;
        }
        ns.name.split(".").forEach(n => this.p(`export namespace ${n} {`));
    }
    finish(ns) {
        if (ns.name == "") {
            return;
        }
        ns.name.split(".").forEach(n => this.p(`} // ${n}`));
    }
}
exports.NamespaceSingleFile = NamespaceSingleFile;
//# sourceMappingURL=namespace_single_file.js.map