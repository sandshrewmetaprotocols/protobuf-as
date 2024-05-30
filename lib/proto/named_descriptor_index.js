"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedDescriptorIndex = void 0;
const proto = __importStar(require("ts-proto-descriptors"));
const named = __importStar(require("./named_descriptor.js"));
const source = __importStar(require("./source_code_index.js"));
/**
 * Represents a map of protobuf descriptors with IDs, namespaces and in-hierarchy references.
 */
class NamedDescriptorIndex {
    /**
     * Creates descriptor index from request.
     * @param request CodeGeneratorRequest
     */
    constructor(request) {
        this.index = new Map();
        this.roots = new Set();
        request.protoFile.forEach((fileDesc) => {
            const namespace = this.registerNamespace(fileDesc.package);
            const sourceIndex = source.CodeIndex.fromFileDescriptorProto(fileDesc);
            fileDesc.enumType.forEach((desc, index) => {
                const en = this.registerEnum(fileDesc.package, namespace, desc, sourceIndex.slice(source.Type.file.enum, index));
                if (request.fileToGenerate.includes(fileDesc.name)) {
                    this.roots.add(en.id);
                }
            });
            fileDesc.messageType.forEach((desc, index) => {
                const message = this.registerMessage(fileDesc.package, namespace, desc, sourceIndex.slice(source.Type.file.message, index));
                if (request.fileToGenerate.includes(fileDesc.name)) {
                    this.roots.add(message.id);
                }
            });
        });
    }
    registerNamespace(name) {
        name.split('.').forEach((name, index, array) => {
            const id = array.slice(0, index + 1).join('.');
            const namespace = array.slice(0, index).join('.');
            const ns = {
                id: id,
                namespace,
                kind: 'namespace',
                name,
            };
            this.index.set(id, ns);
        });
        return name;
    }
    registerEnum(prefix, namespace, desc, codeIndex) {
        const id = named.normalize(`${prefix}.${desc.name}`);
        const en = { id, namespace, kind: 'enum', desc, comment: codeIndex.lookup() };
        this.index.set(id, en);
        desc.value.forEach((desc, index) => this.registerEnumValue(id, namespace, desc, codeIndex.lookup(source.Type.enum.value, index)));
        return en;
    }
    registerEnumValue(prefix, namespace, desc, comment) {
        const id = named.normalize(`${prefix}.${desc.name}`);
        this.index.set(id, { id, namespace, desc, comment, kind: 'enum_value' });
    }
    registerMessage(prefix, namespace, desc, codeIndex) {
        const id = named.normalize(`${prefix}.${desc.name}`);
        const oneOfDecl = desc.oneofDecl;
        const oneOf = oneOfDecl.map(d => d.name);
        const message = { id, namespace, kind: 'message', desc, comment: codeIndex.lookup(), oneOf: oneOf };
        this.index.set(id, message);
        desc.enumType.forEach((desc, index) => this.registerEnum(id, namespace, desc, codeIndex.slice(source.Type.message.enum, index)));
        desc.nestedType.forEach((desc, index) => this.registerMessage(id, namespace, desc, codeIndex.slice(source.Type.message.nested_type, index)));
        desc.field.forEach((desc, index) => {
            let oneOf = undefined;
            // If object has oneofIndex property explicitly defined
            if (Object.prototype.hasOwnProperty.call(desc, 'oneofIndex')) {
                oneOf = oneOfDecl[desc.oneofIndex].name;
            }
            this.registerField(id, namespace, desc, codeIndex.lookup(source.Type.message.field, index), oneOf);
        });
        return message;
    }
    registerField(prefix, namespace, desc, comment, oneOf) {
        const id = named.normalize(`${prefix}.${desc.name}`);
        let hasOne = undefined;
        if (desc.type == proto.FieldDescriptorProto_Type.TYPE_MESSAGE ||
            desc.type == proto.FieldDescriptorProto_Type.TYPE_ENUM) {
            hasOne = named.normalize(desc.typeName);
        }
        const field = {
            id,
            namespace,
            hasOne,
            kind: 'field',
            desc,
            comment,
            oneOf,
        };
        this.index.set(id, field);
    }
    /**
     * Returns message/enum names belongs to a files explicitly requested via CLI
     * @returns ReadonlySet of type names
     */
    rootIDs() {
        return this.roots;
    }
    /**
     * Returns all descriptors in index
     * @returns Array of descriptors
     */
    values() {
        return Array.from(this.index.values());
    }
    /**
     * Returns the descriptor
     * @param key Descriptor ID
     * @returns Descriptor
     */
    get(key) {
        return this.index.get(key);
    }
}
exports.NamedDescriptorIndex = NamedDescriptorIndex;
//# sourceMappingURL=named_descriptor_index.js.map