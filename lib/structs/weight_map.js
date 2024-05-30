"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightMap = void 0;
/**
 * Utility data type which represents map of key:T => weight (number)
 */
class WeightMap extends Map {
    /**
     * Increases key weight
     * @param key Key
     * @param by Increase by
     */
    increase(key, by) {
        const value = this.getWeight(key);
        this.set(key, value + (by || 1));
    }
    /**
     * Decreases key weight
     * @param key Key
     * @param by Decrease by
     */
    decrease(key, by) {
        const value = this.getWeight(key);
        this.set(key, value - (by || 1));
    }
    /**
     * Sets weight of a key
     * @param key Key
     * @param value Weight
     */
    setWeight(key, value) {
        this.set(key, value);
    }
    /**
     * Gets weight of a key
     * @param key Key
     * @param value Weight
     */
    getWeight(key) {
        return this.get(key) || 0;
    }
}
exports.WeightMap = WeightMap;
//# sourceMappingURL=weight_map.js.map