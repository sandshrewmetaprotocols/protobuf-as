"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkerASMultiFile = void 0;
const namespace_multi_file_js_1 = require("./namespace_multi_file.js");
const enum_js_1 = require("./enum.js");
const message_js_1 = require("./message.js");
const field_js_1 = require("./field.js");
const decode_js_1 = require("./decode.js");
const encode_js_1 = require("./encode.js");
const size_js_1 = require("./size.js");
const one_of_js_1 = require("./one_of.js");
const prettify_js_1 = require("./prettify.js");
const internal_js_1 = require("./internal.js");
const fs_1 = __importDefault(require("fs"));
/**
 * WalkerAS represents Walker implementing FlatWalker strategy producing AssemblyScript code. This is the composite class.
 */
class WalkerASMultiFile {
    constructor(options) {
        this.options = options;
        this.globals = new Map();
        this.generatedFiles = new Map();
        this.fileStack = new Array();
        const p = this.p.bind(this);
        this.namespace = new namespace_multi_file_js_1.NamespaceMultiFile(p);
        this.enum = new enum_js_1.Enum(p);
        this.message = new message_js_1.Message(p, this.options);
        this.field = new field_js_1.Field(p, this.options);
        this.decode = new decode_js_1.Decode(p, this, this.options);
        this.encode = new encode_js_1.Encode(p);
        this.size = new size_js_1.Size(p, this);
        this.oneOf = new one_of_js_1.OneOf(p, this.options);
        this.pushFile(options.targetFileName);
    }
    currentFileName() {
        return this.fileStack[this.fileStack.length - 1];
    }
    pushFile(name) {
        this.fileStack.push(name);
        this.generatedFiles.set(this.currentFileName(), new Array());
    }
    popFile() {
        this.fileStack.pop();
    }
    resetGlobals() {
        this.globals = new Map();
    }
    beforeAll() {
        // noop
    }
    afterAll() {
        // noop
    }
    startNamespace(namespace) {
        this.namespace.parentRef(namespace);
        this.pushFile((0, internal_js_1.namespaceToFileName)(namespace) + ".ts");
        this.namespace.start(namespace);
    }
    referenceExternal(namespace, ext) {
        this.namespace.extRef(namespace, ext);
    }
    finishNamespace(namespace) {
        this.namespace.finish(namespace, this.globals);
        this.resetGlobals();
        this.popFile();
    }
    startEnum(en) {
        this.enum.start(en);
    }
    enumValue(value) {
        this.enum.value(value);
    }
    finishEnum(en) {
        this.enum.finish(en);
    }
    startMessage(message) {
        this.message.start(message);
    }
    finishMessage(message) {
        this.message.finish(message);
    }
    fieldDecl(field) {
        this.field.decl(field);
    }
    startDecode(message) {
        this.decode.start(message);
    }
    beginDecode() {
        this.decode.begin();
    }
    fieldInit() {
        // noop
    }
    fieldDecode(field) {
        this.decode.field(field);
    }
    endDecode() {
        this.decode.end();
    }
    finishDecode(message) {
        this.decode.finish(message);
    }
    startEncode(message) {
        this.encode.start(message);
    }
    beginEncode() {
        this.encode.begin();
    }
    fieldEncode(field) {
        this.encode.field(field);
    }
    endEncode() {
        this.encode.end();
    }
    finishEncode(message) {
        this.encode.finish(message);
    }
    startSize() {
        this.size.start();
    }
    fieldSize(field) {
        this.size.field(field);
    }
    finishSize() {
        this.size.finish();
    }
    oneOfDiscriminatorDecl(desc, group) {
        this.oneOf.discriminatorDecl(desc, group);
    }
    oneOfDiscriminatorConst(desc) {
        this.oneOf.discriminatorConst(desc);
    }
    files() {
        const files = new Array();
        // Join Encoder, Decoder, etc. to the single __proto.ts file
        const staticContent = internal_js_1.staticFiles.map((f) => fs_1.default.readFileSync(f).toString()).join("\n");
        files.push({ name: "__proto.ts", content: staticContent });
        // Put all files to the array
        this.generatedFiles.forEach((value, key) => files.push({
            name: key, content: value.join('\n')
        }));
        if (this.options.disablePrettier) {
            return files;
        }
        return (0, prettify_js_1.prettify)(files);
    }
    p(s) {
        if (s != '') {
            const chunks = this.generatedFiles.get(this.currentFileName());
            if (chunks) {
                chunks.push(s);
            }
        }
    }
    registerGlobal(key, content) {
        if (this.globals.has(key)) {
            return;
        }
        this.globals.set(key, content);
    }
}
exports.WalkerASMultiFile = WalkerASMultiFile;
//# sourceMappingURL=walker_as_multi_file.js.map