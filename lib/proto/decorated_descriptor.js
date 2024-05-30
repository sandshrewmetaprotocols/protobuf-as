"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOneOf = exports.isAnyMap = exports.isMessage = exports.isElementary = exports.isField = exports.WireType = void 0;
// Protobuf wire type
var WireType;
(function (WireType) {
    WireType[WireType["VARINT"] = 0] = "VARINT";
    WireType[WireType["FIXED64"] = 1] = "FIXED64";
    WireType[WireType["LENGTH_DELIMITED"] = 2] = "LENGTH_DELIMITED";
    WireType[WireType["FIXED32"] = 5] = "FIXED32";
})(WireType = exports.WireType || (exports.WireType = {}));
// Descriptor is any field
function isField(field) {
    return field.kind.startsWith('field_');
}
exports.isField = isField;
// Descriptor is elementary field
function isElementary(field) {
    return field.kind == 'field_elementary';
}
exports.isElementary = isElementary;
// Descriptor is message field
function isMessage(field) {
    return field.kind == 'field_message';
}
exports.isMessage = isMessage;
// Descriptor is any map field
function isAnyMap(field) {
    return field.kind == 'field_map' || field.kind == 'field_map_message';
}
exports.isAnyMap = isAnyMap;
// Descriptor has oneOf field
function isOneOf(field) {
    return isElementary(field) || isMessage(field) || isAnyMap(field);
}
exports.isOneOf = isOneOf;
//# sourceMappingURL=decorated_descriptor.js.map