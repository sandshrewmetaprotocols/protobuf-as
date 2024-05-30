"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
// Removes leading and trailing dots in an id
function normalize(name) {
    return name.replace(/[.]+/g, '.').replace(/^\./, '');
}
exports.normalize = normalize;
//# sourceMappingURL=named_descriptor.js.map