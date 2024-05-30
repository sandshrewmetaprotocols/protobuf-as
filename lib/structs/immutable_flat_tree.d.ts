declare type K = string;
declare type Item<K, V> = [K, V, number];
declare type NewItem<K, V> = [K, V, number?];
/**
 * Immutable flat tree is the tree where position in hierarchy is defined by a delimited string key.
 */
export declare class ImmutableFlatTree<V> {
    private items;
    private delimiter;
    /**
     * Creates the instance of ImmutableFlatTree from an array of [key, value] tuples
     * @param items Array of [key, value] tuples
     */
    constructor(items: readonly NewItem<K, V>[], delimiter?: K);
    private levelOf;
    /**
     * Returns the elements of a tree that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: Item<K, V>, index?: number, array?: readonly Item<K, V>[]) => Item<K, V> | null): ImmutableFlatTree<V>;
    /**
     * Returns item descendants
     * @param parent Parent key (or empty for root)
     * @param depth Depth (1 means children)
     * @returns Map of descendants
     */
    descendants(parentKey?: string, depth?: number): ImmutableFlatTree<V>;
    /**
     * Iterates over tree elements
     * @param callbackfn Callback
     * @param thisArg Value of this
     */
    forEach(callbackfn: (value: Item<K, V>, index: number, array: Item<K, V>[]) => void): void;
    /**
     * Gets tree item by key
     * @param key Item key
     * @returns Tree item
     */
    get(key: K): Item<K, V> | undefined;
    /**
     * Returns tree length
     */
    get size(): number;
    /**
     * Returns entries as array
     */
    get entries(): ReadonlyArray<Item<K, V>>;
}
export {};
