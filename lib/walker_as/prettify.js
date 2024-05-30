"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettify = void 0;
const prettier_1 = __importDefault(require("prettier"));
// Options for prettier, TODO: move to WalkerAS
const prettierOptions = {
    parser: 'typescript',
    tabWidth: 2,
};
function prettify(files) {
    return files.map((file) => ({ name: file.name, content: prettier_1.default.format(file.content, prettierOptions) }));
}
exports.prettify = prettify;
//# sourceMappingURL=prettify.js.map