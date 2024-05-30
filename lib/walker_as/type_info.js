"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeInfo = void 0;
const ts_proto_descriptors_1 = require("ts-proto-descriptors");
const internal_js_1 = require("./internal.js");
// AssemblyScript types for the corresponding proto types
const types = new Map([
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE, 'f64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT, 'f32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32, 'i32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32, 'u32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32, 'i32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32, 'u32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32, 'i32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64, 'i64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64, 'u64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64, 'i64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64, 'u64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64, 'i64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL, 'bool'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING, 'string'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES, 'Array<u8>'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM, 'u32'],
]);
// List of defaults for the types
const defaults = new Map([
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING, "''"],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES, "new Array<u8>()"]
]);
// Decoder methods
const methods = new Map([
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE, 'double'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT, 'float'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32, 'int32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32, 'uint32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32, 'sint32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32, 'fixed32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32, 'sfixed32'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64, 'int64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64, 'uint64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64, 'sint64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64, 'fixed64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64, 'sfixed64'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL, 'bool'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING, 'string'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES, 'bytes'],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM, 'uint32'],
]);
// Size of a fixed types
const fixedSizes = new Map([
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE, 8],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT, 4],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32, 4],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32, 4],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64, 8],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64, 8],
    [ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL, 1],
]);
/**
 * Returns field type information required for AS definition/initialization.
 * @param field DecoratedField
 * @returns TypeInfo struct
 */
function getTypeInfo(type) {
    switch (type.kind) {
        case "field_elementary":
        case "field_elementary_repeated": {
            const typeName = types.get(type.type);
            const elementaryBase = {
                typeName,
                method: methods.get(type.type),
                fixedSize: fixedSizes.get(type.type),
            };
            if (type.kind == "field_elementary") {
                return { ...elementaryBase, default: defaults.get(type.type) };
            }
            return { ...elementaryBase, collectionTypeName: `Array<${typeName}>` };
        }
        case "field_message":
        case "field_message_repeated": {
            const typeName = (0, internal_js_1.absoluteName)(type.typeName, type.namespace);
            return {
                typeName,
                collectionTypeName: `Array<${typeName}>`
            };
        }
        case "field_map":
        case "field_map_message": {
            const keyTypeInfo = getTypeInfo(type.key);
            const valueTypeInfo = getTypeInfo(type.value);
            return {
                collectionTypeName: `Map<${keyTypeInfo.typeName}, ${valueTypeInfo.typeName}>`,
                keyTypeInfo,
                valueTypeInfo,
            };
        }
    }
}
exports.getTypeInfo = getTypeInfo;
//# sourceMappingURL=type_info.js.map