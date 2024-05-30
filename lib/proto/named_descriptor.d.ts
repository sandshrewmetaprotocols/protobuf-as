import * as proto from 'ts-proto-descriptors';
import { AbstractDescriptorCollection } from './index.js';
export declare type Id = {
    id: string;
    namespace: string;
};
export declare type Comment = {
    comment: string;
};
export declare type Namespace = Id & {
    kind: 'namespace';
    name: string;
};
export declare type Enum = Id & Comment & {
    kind: 'enum';
    desc: proto.EnumDescriptorProto;
};
export declare type EnumValue = Id & Comment & {
    kind: 'enum_value';
    desc: proto.EnumValueDescriptorProto;
};
export declare type Message = Id & Comment & {
    kind: 'message';
    desc: proto.DescriptorProto;
    oneOf: string[];
};
export declare type Field = Id & Comment & {
    kind: 'field';
    desc: proto.FieldDescriptorProto;
    hasOne?: string;
    oneOf?: string;
};
export declare type Descriptor = Namespace | Enum | EnumValue | Message | Field;
export declare type DescriptorCollection = AbstractDescriptorCollection<Descriptor>;
export declare function normalize(name: string): string;
