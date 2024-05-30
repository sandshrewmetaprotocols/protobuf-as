import * as named from './named_descriptor.js';
/**
 * Performs tree-shaking of the named descriptor index.
 * Removes unused descriptors. Removes explicitly requested descriptors. Performs integritiy check.
 */
export declare class NamedDescriptorIndexReducer implements named.DescriptorCollection {
    private weights;
    private tree;
    /**
     * Creates DescriptorIndexReducer containing all required fields based on inclusion/exclusion list.
     *
     * @param index Parent index
     * @param include Set of descriptor names to mark as required
     * @param exclude Set of descriptor names to exclude
     */
    constructor(index: named.DescriptorCollection, include: ReadonlySet<string>, exclude: ReadonlySet<string>);
    private pin;
    private unpin;
    private walk;
    /**
     * Finds and returns broken references: references to a types which lead to removed items.
     * @returns Broken references in form of array of tuples [source, target]
     */
    brokenReferences(): ReadonlyArray<[string, string]>;
    /**
     * Returns array of leftover descriptors
     * @returns Array of descriptors
     */
    values(): ReadonlyArray<named.Descriptor>;
    /**
     * Gets a descriptor from the collection
     * @param key Descriptor key
     * @returns Descriptor
     */
    get(key: string): named.Descriptor | undefined;
}
