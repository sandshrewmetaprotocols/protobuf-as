/**
 * Utility data type which represents map of key:T => weight (number)
 */
export declare class WeightMap<K> extends Map<K, number> {
    /**
     * Increases key weight
     * @param key Key
     * @param by Increase by
     */
    increase(key: K, by?: number): void;
    /**
     * Decreases key weight
     * @param key Key
     * @param by Decrease by
     */
    decrease(key: K, by?: number): void;
    /**
     * Sets weight of a key
     * @param key Key
     * @param value Weight
     */
    setWeight(key: K, value: number): void;
    /**
     * Gets weight of a key
     * @param key Key
     * @param value Weight
     */
    getWeight(key: K): number;
}
