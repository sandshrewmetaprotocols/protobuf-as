import * as proto from 'ts-proto-descriptors';
import * as named from './named_descriptor.js';
/**
 * Represents a map of protobuf descriptors with IDs, namespaces and in-hierarchy references.
 */
export declare class NamedDescriptorIndex implements named.DescriptorCollection {
    private index;
    private roots;
    /**
     * Creates descriptor index from request.
     * @param request CodeGeneratorRequest
     */
    constructor(request: proto.CodeGeneratorRequest);
    private registerNamespace;
    private registerEnum;
    private registerEnumValue;
    private registerMessage;
    private registerField;
    /**
     * Returns message/enum names belongs to a files explicitly requested via CLI
     * @returns ReadonlySet of type names
     */
    rootIDs(): ReadonlySet<string>;
    /**
     * Returns all descriptors in index
     * @returns Array of descriptors
     */
    values(): ReadonlyArray<named.Descriptor>;
    /**
     * Returns the descriptor
     * @param key Descriptor ID
     * @returns Descriptor
     */
    get(key: string): named.Descriptor | undefined;
}
