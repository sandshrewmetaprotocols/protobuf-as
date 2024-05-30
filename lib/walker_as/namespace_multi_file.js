"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceMultiFile = void 0;
const internal_js_1 = require("./internal.js");
/**
 * Namespace code blocks
 */
class NamespaceMultiFile {
    constructor(p) {
        this.p = p;
    }
    // Generates statement which re-exports embedded namespace to the top level
    parentRef(ns) {
        this.p(`import * as ${ns.name} from './${(0, internal_js_1.namespaceToFileName)(ns)}'`);
        this.p(`export { ${ns.name} }`);
    }
    extRef(ns, ext) {
        const parts = ext.split(".");
        const top = parts[0];
        this.p(`import * as ${top} from '${(0, internal_js_1.getRelPath)(ns)}/${top}'`);
    }
    start(ns) {
        this.p(`
            import * as __proto from '${(0, internal_js_1.getRelPath)(ns)}/__proto'
        `);
    }
    finish(ns, globals) {
        globals.forEach((value, key) => {
            this.p(`
                // ${key}
                ${value}
            `);
        });
    }
}
exports.NamespaceMultiFile = NamespaceMultiFile;
//# sourceMappingURL=namespace_multi_file.js.map