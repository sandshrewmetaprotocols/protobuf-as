import * as decorated from './decorated_descriptor.js';
import * as named from './named_descriptor.js';
/**
 * Represents the index of decorated protobuf descriptors from a collection of a named descriptors.
 * Decorated descriptor represents proto descriptor with additional metadata required for code generation.
 */
export declare class DecoratedDescriptorIndex implements decorated.DescriptorCollection {
    private index;
    /**
     * Builds decorated descriptor index
     * @param index Descriptor collection
     */
    constructor(index: named.DescriptorCollection);
    values(): ReadonlyArray<decorated.Descriptor>;
    get(key: string): decorated.Descriptor | undefined;
    private createDecoratedDescriptor;
    private createNamespace;
    private createEnum;
    private createEnumValue;
    private createMessage;
    private createField;
    private isRepeated;
    private isPacked;
    private isWithinOneOf;
    private relativeName;
}
