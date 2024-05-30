import { FieldDescriptorProto_Type } from 'ts-proto-descriptors';
import { AbstractDescriptorCollection } from './index.js';
export declare enum WireType {
    VARINT = 0,
    FIXED64 = 1,
    LENGTH_DELIMITED = 2,
    FIXED32 = 5
}
export declare type WireTypeable = {
    wireType: WireType;
};
export declare type Depricable = {
    deprecated: boolean;
};
export declare type Numbered = {
    number: number;
};
export declare type Commented = {
    comment: string;
};
export declare type WithOneOf = {
    oneOf?: string;
};
export declare type Named = {
    id: string;
    parentID: string;
    name: string;
    namespace: string;
    relativeName: string;
};
export declare type Namespace = Named & {
    kind: 'namespace';
};
export declare type Enum = Depricable & Named & Commented & {
    kind: 'enum';
};
export declare type EnumValue = Depricable & Named & Commented & {
    kind: 'enum_value';
    number: number;
};
export declare type Message = Depricable & Named & Commented & {
    kind: 'message';
    mapHelper: boolean;
    oneOf: string[];
};
export declare type FieldElementary = Depricable & Named & Numbered & Commented & WithOneOf & WireTypeable & {
    kind: 'field_elementary';
    type: FieldDescriptorProto_Type;
    isCollection: boolean;
};
export declare type FieldElementaryRepeated = Depricable & Named & Numbered & Commented & WireTypeable & {
    kind: 'field_elementary_repeated';
    type: FieldDescriptorProto_Type;
    packed: boolean;
    isCollection: boolean;
};
export declare type FieldMessage = Depricable & Named & Numbered & Commented & WithOneOf & WireTypeable & {
    kind: 'field_message';
    typeName: Named;
};
export declare type FieldMessageRepeated = Depricable & Named & Numbered & Commented & WireTypeable & {
    kind: 'field_message_repeated';
    typeName: Named;
};
export declare type FieldMap = Depricable & Named & Numbered & Commented & WithOneOf & WireTypeable & {
    kind: 'field_map';
    key: FieldElementary;
    value: FieldElementary;
    mapHelperMessage: Named;
};
export declare type FieldMapMessage = Depricable & Named & Numbered & Commented & WithOneOf & WireTypeable & {
    kind: 'field_map_message';
    key: FieldElementary;
    value: FieldMessage;
    mapHelperMessage: Named;
};
export declare type Field = FieldElementary | FieldElementaryRepeated | FieldMessage | FieldMessageRepeated | FieldMap | FieldMapMessage;
export declare type Descriptor = Namespace | Enum | EnumValue | Message | Field;
export declare type DescriptorCollection = AbstractDescriptorCollection<Descriptor>;
export declare function isField(field: Descriptor): field is Field;
export declare function isElementary(field: Field): field is FieldElementary;
export declare function isMessage(field: Field): field is FieldMessage;
export declare function isAnyMap(field: Field): field is (FieldMap | FieldMapMessage);
export declare function isOneOf(field: Field): field is (FieldElementary | FieldMessage | FieldMap | FieldMapMessage);
