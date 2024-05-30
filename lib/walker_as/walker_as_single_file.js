"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkerASSingleFile = void 0;
const blocks_single_file_js_1 = require("./blocks_single_file.js");
const namespace_single_file_js_1 = require("./namespace_single_file.js");
const enum_js_1 = require("./enum.js");
const message_js_1 = require("./message.js");
const field_js_1 = require("./field.js");
const decode_js_1 = require("./decode.js");
const encode_js_1 = require("./encode.js");
const size_js_1 = require("./size.js");
const one_of_js_1 = require("./one_of.js");
const prettify_js_1 = require("./prettify.js");
/**
 * WalkerAS represents Walker implementing FlatWalker strategy producing AssemblyScript code. This is the composite class.
 */
class WalkerASSingleFile {
    constructor(options) {
        this.options = options;
        this.chunks = new Array();
        this.globals = new Map();
        const p = this.p.bind(this);
        this.blocks = new blocks_single_file_js_1.BlocksSingleFile(p);
        this.namespace = new namespace_single_file_js_1.NamespaceSingleFile(p);
        this.enum = new enum_js_1.Enum(p);
        this.message = new message_js_1.Message(p, this.options);
        this.field = new field_js_1.Field(p, this.options);
        this.decode = new decode_js_1.Decode(p, this, this.options);
        this.encode = new encode_js_1.Encode(p);
        this.size = new size_js_1.Size(p, this);
        this.oneOf = new one_of_js_1.OneOf(p, this.options);
    }
    beforeAll() {
        this.blocks.beforeAll();
    }
    afterAll() {
        this.blocks.afterAll(this.globals);
    }
    startNamespace(namespace) {
        this.namespace.start(namespace);
    }
    // eslint-disable-next-line
    referenceExternal(namespace, ext) {
        // noop
    }
    finishNamespace(namespace) {
        this.namespace.finish(namespace);
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
        const files = [{
                name: this.options.targetFileName, content: this.chunks.join('\n')
            }];
        if (this.options.disablePrettier) {
            return files;
        }
        return (0, prettify_js_1.prettify)(files);
    }
    p(s) {
        if (s != '') {
            this.chunks.push(s);
        }
    }
    registerGlobal(key, content) {
        if (this.globals.has(key)) {
            return;
        }
        this.globals.set(key, content);
    }
}
exports.WalkerASSingleFile = WalkerASSingleFile;
//# sourceMappingURL=walker_as_single_file.js.map