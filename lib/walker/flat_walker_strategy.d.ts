import { decorated } from '../proto/index.js';
import { DecoratedDescriptorIndex } from '../proto/decorated_descriptor_index.js';
import { AbstractDescriptorCollection } from '../proto/index.js';
/**
 * File interface represents the generated file
 */
export interface File {
    name: string;
    content: string;
}
/**
 * Walker interface, emits files
 */
export interface Walker {
    files(): File[];
}
export declare abstract class WalkerStrategy<T, D> {
    protected index: AbstractDescriptorCollection<D>;
    constructor(index: AbstractDescriptorCollection<D>);
    abstract walk(walker: T): void;
}
export interface FlatBlocksWalker {
    beforeAll(): void;
    afterAll(): void;
}
export interface FlatNamespaceWalker {
    startNamespace(namespace: decorated.Namespace): void;
    referenceExternal(namespace: decorated.Namespace, ext: string): void;
    finishNamespace(namespace: decorated.Namespace): void;
}
export interface FlatEnumWalker {
    startEnum(en: decorated.Enum): void;
    enumValue(item: decorated.EnumValue): void;
    finishEnum(en: decorated.Enum): void;
}
export interface FlatMessageWalker {
    startMessage(message: decorated.Message): void;
    finishMessage(message: decorated.Message): void;
}
export interface FlatMessageDecodeWalker {
    startDecode(message: decorated.Message): void;
    beginDecode(message: decorated.Message): void;
    endDecode(message: decorated.Message): void;
    finishDecode(message: decorated.Message): void;
}
export interface FlatMessageEncodeWalker {
    startEncode(message: decorated.Message): void;
    beginEncode(message: decorated.Message): void;
    endEncode(message: decorated.Message): void;
    finishEncode(message: decorated.Message): void;
}
export interface FlatMessageSizeWalker {
    startSize(message: decorated.Message): void;
    finishSize(message: decorated.Message): void;
}
export interface FlatFieldWalker {
    fieldDecl(field: decorated.Field): void;
    fieldInit(field: decorated.Field): void;
    fieldDecode(field: decorated.Field): void;
    fieldSize(field: decorated.Field): void;
    fieldEncode(field: decorated.Field): void;
}
export interface FlatOneOfWalker {
    oneOfDiscriminatorDecl(message: decorated.Message, group: string): void;
    oneOfDiscriminatorConst(desc: decorated.Field): void;
}
export declare type FlatWalker = Walker & FlatBlocksWalker & FlatNamespaceWalker & FlatEnumWalker & FlatMessageWalker & FlatMessageDecodeWalker & FlatMessageSizeWalker & FlatMessageEncodeWalker & FlatFieldWalker & FlatOneOfWalker;
/**
 * Implements the generic walker strategy for an OO language.
 *
 * - Namespaces are hierachical.
 * - Enums and messages are sequentially nested into namespaces.
 * - decode(), encode() and size() methods.
 */
export declare class FlatWalkerStrategy extends WalkerStrategy<FlatWalker, decorated.Descriptor> {
    protected index: DecoratedDescriptorIndex;
    private items;
    constructor(index: DecoratedDescriptorIndex);
    walk(walker: FlatWalker): void;
    private walkItem;
    private walkExternals;
    private walkNamespace;
    private walkEnum;
    private walkEnumValue;
    private walkMessage;
}
