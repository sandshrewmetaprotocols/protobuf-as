"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelPath = exports.namespaceToFileName = exports.comment = exports.absoluteName = exports.relativeName = exports.deprecatedComment = exports.staticFiles = exports.embedNamespace = void 0;
const index_js_1 = require("../proto/index.js");
const path_1 = __importDefault(require("path"));
const change_case_1 = __importDefault(require("change-case"));
// embedNamespace represents Decode, Encode and Size namespace name
exports.embedNamespace = "__proto";
// staticFiles represents list of static files to embed/copy
exports.staticFiles = [
    path_1.default.join(__dirname, '../../assembly/decoder.ts'),
    path_1.default.join(__dirname, '../../assembly/encoder.ts'),
    path_1.default.join(__dirname, '../../assembly/sizer.ts'),
];
// Generates "// DEPRECATED" comment
function deprecatedComment(obj) {
    return `${obj.deprecated ? "// DEPRECATED" : ""}`;
}
exports.deprecatedComment = deprecatedComment;
// Returns message name relative to current namespace, replacing nesting with "_"
function relativeName(name) {
    return index_js_1.named.normalize(name).replace(/[.]+/g, "_");
}
exports.relativeName = relativeName;
// Returns message name with namespace (if required), replacing nesting with "_"
function absoluteName(obj, ns) {
    if (obj.namespace != ns) {
        return index_js_1.named.normalize(obj.namespace + "." + relativeName(obj.relativeName));
    }
    return relativeName(obj.relativeName);
}
exports.absoluteName = absoluteName;
// Returns formatted multiline comment
function comment(obj) {
    if (obj.comment.trim() == "") {
        return "";
    }
    const lines = obj.comment.split("\n");
    if (lines.length == 1) {
        return "// " + lines.join().trim();
    }
    return "/**\n" + lines.map((value) => " * " + value).join("\n") + "\n */";
}
exports.comment = comment;
// Converts namespace to ts file name
function namespaceToFileName(obj) {
    return obj.id.split(".").map(v => change_case_1.default.snakeCase(v)).join("/");
}
exports.namespaceToFileName = namespaceToFileName;
// Returns relative component of the ts file
function getRelPath(ns) {
    const level = ns.id.split(".").length;
    // Relative import path to __proto.ts
    let rel = ["."];
    // Nested namespace
    if (level > 1) {
        rel = Array(level - 1).fill("..");
    }
    return rel.join("/");
}
exports.getRelPath = getRelPath;
//# sourceMappingURL=internal.js.map