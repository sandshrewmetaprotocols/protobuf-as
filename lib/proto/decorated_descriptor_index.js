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
exports.DecoratedDescriptorIndex = void 0;
const decorated = __importStar(require("./decorated_descriptor.js"));
const named = __importStar(require("./named_descriptor.js"));
const ts_proto_descriptors_1 = require("ts-proto-descriptors");
// Types that can't have the [packed=true] flag, used for guessing when packed is undefined explicitly.
const typesCantBePacked = [
    ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES,
    ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_GROUP,
    ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE,
    ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING,
];
// Type to wire type map
const wireTypes = new Map([
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE, decorated.WireType.FIXED64],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT, decorated.WireType.FIXED32],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32, decorated.WireType.VARINT],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32, decorated.WireType.VARINT],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32, decorated.WireType.VARINT],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32, decorated.WireType.FIXED32],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32, decorated.WireType.FIXED32],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64, decorated.WireType.VARINT],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64, decorated.WireType.VARINT],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64, decorated.WireType.VARINT],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64, decorated.WireType.FIXED64],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64, decorated.WireType.FIXED64],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL, decorated.WireType.VARINT],
    [
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING,
        decorated.WireType.LENGTH_DELIMITED,
    ],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES, decorated.WireType.LENGTH_DELIMITED],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM, decorated.WireType.VARINT],
]);
/**
 * Represents the index of decorated protobuf descriptors from a collection of a named descriptors.
 * Decorated descriptor represents proto descriptor with additional metadata required for code generation.
 */
class DecoratedDescriptorIndex {
    /**
     * Builds decorated descriptor index
     * @param index Descriptor collection
     */
    constructor(index) {
        this.index = new Map();
        for (const value of index.values()) {
            this.index.set(value.id, this.createDecoratedDescriptor(value, index));
        }
    }
    values() {
        return Array.from(this.index.values());
    }
    get(key) {
        return this.index.get(key);
    }
    createDecoratedDescriptor(value, index) {
        switch (value.kind) {
            case 'namespace':
                return this.createNamespace(value);
            case 'enum':
                return this.createEnum(value);
            case 'enum_value':
                return this.createEnumValue(value);
            case 'message':
                return this.createMessage(value);
            case 'field':
                return this.createField(value, index);
        }
    }
    createNamespace(d) {
        return Object.assign(Object.assign({ kind: 'namespace' }, this.relativeName(d)), { name: d.name });
    }
    createEnum(d) {
        var _a;
        return Object.assign(Object.assign({}, this.relativeName(d)), { kind: d.kind, deprecated: ((_a = d.desc.options) === null || _a === void 0 ? void 0 : _a.deprecated) || false, comment: d.comment });
    }
    createEnumValue(d) {
        var _a;
        return Object.assign(Object.assign({}, this.relativeName(d)), { kind: d.kind, number: d.desc.number, deprecated: ((_a = d.desc.options) === null || _a === void 0 ? void 0 : _a.deprecated) || false, comment: d.comment });
    }
    createMessage(d) {
        var _a, _b;
        return Object.assign(Object.assign({}, this.relativeName(d)), { kind: d.kind, deprecated: ((_a = d.desc.options) === null || _a === void 0 ? void 0 : _a.deprecated) || false, mapHelper: ((_b = d.desc.options) === null || _b === void 0 ? void 0 : _b.mapEntry) || false, comment: d.comment, oneOf: d.oneOf });
    }
    createField(d, index) {
        var _a, _b, _c;
        const isMessage = d.desc.type == ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE;
        const message = isMessage
            ? index.get(named.normalize(d.desc.typeName))
            : null;
        const isMap = (_b = (_a = message === null || message === void 0 ? void 0 : message.desc) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.mapEntry;
        const isRepeated = this.isRepeated(d);
        const deprecated = ((_c = d.desc.options) === null || _c === void 0 ? void 0 : _c.deprecated) || false;
        const number = d.desc.number;
        const fieldBase = Object.assign(Object.assign({}, this.relativeName(d)), { number,
            deprecated, type: d.desc.type, comment: d.comment });
        if (isMap) {
            if (message == null) {
                throw new Error("Map message not found");
            }
            const key = this.createField(index.get(message.id + '.key'), index);
            const value = this.createField(index.get(message.id + '.value'), index);
            const mapHelperMessage = this.relativeName(message);
            if (decorated.isElementary(key)) {
                const mapBase = { key, mapHelperMessage };
                if (decorated.isMessage(value)) {
                    return Object.assign(Object.assign(Object.assign({ kind: 'field_map_message' }, fieldBase), mapBase), { value, wireType: decorated.WireType.LENGTH_DELIMITED, oneOf: d.oneOf });
                }
                else if (decorated.isElementary(value)) {
                    return Object.assign(Object.assign(Object.assign({ kind: 'field_map' }, fieldBase), mapBase), { value, wireType: decorated.WireType.LENGTH_DELIMITED, oneOf: d.oneOf });
                }
            }
        }
        else if (isMessage) {
            const t = index.get(named.normalize(d.desc.typeName));
            if (t == undefined) {
                throw new Error("Descriptor not found for " + d.desc.typeName);
            }
            const typeName = this.relativeName(t);
            if (isRepeated) {
                return Object.assign(Object.assign({ kind: 'field_message_repeated' }, fieldBase), { typeName, wireType: decorated.WireType.LENGTH_DELIMITED });
            }
            else {
                return Object.assign(Object.assign({ kind: 'field_message' }, fieldBase), { typeName, wireType: decorated.WireType.LENGTH_DELIMITED, oneOf: d.oneOf });
            }
        }
        const isCollection = [
            ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING, ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES
        ].includes(d.desc.type);
        if (isRepeated) {
            return Object.assign(Object.assign({ kind: 'field_elementary_repeated' }, fieldBase), { packed: this.isPacked(d), wireType: decorated.WireType.LENGTH_DELIMITED, isCollection });
        }
        const wireType = wireTypes.get(d.desc.type);
        if (wireType == undefined) {
            throw new Error("Wire type not found for " + d.desc.name);
        }
        return Object.assign(Object.assign({ kind: 'field_elementary' }, fieldBase), { wireType, isCollection, oneOf: d.oneOf });
    }
    isRepeated(d) {
        return d.desc.label == ts_proto_descriptors_1.FieldDescriptorProto_Label.LABEL_REPEATED;
    }
    isPacked(d) {
        var _a, _b;
        if (((_a = d.desc.options) === null || _a === void 0 ? void 0 : _a.packed) != undefined) {
            return this.isRepeated(d) && ((_b = d.desc.options) === null || _b === void 0 ? void 0 : _b.packed);
        }
        // By default [packed=true] unless otherwise specified.
        return this.isRepeated(d) && !typesCantBePacked.includes(d.desc.type);
    }
    isWithinOneOf(field) {
        // please refer to ts-proto
        return Object.prototype.hasOwnProperty.call(field, 'oneofIndex');
    }
    // relativeName returns naming properties of a field
    relativeName(value) {
        const id = value.id;
        const lastDotPos = id.lastIndexOf('.');
        const name = id.substring(lastDotPos + 1);
        const relativeName = named.normalize(id.substring(value.namespace.length));
        const parentID = id.substring(0, lastDotPos);
        return { id, parentID, name, relativeName, namespace: value.namespace };
    }
}
exports.DecoratedDescriptorIndex = DecoratedDescriptorIndex;
//# sourceMappingURL=decorated_descriptor_index.js.map