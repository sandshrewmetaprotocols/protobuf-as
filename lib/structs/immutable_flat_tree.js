"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmutableFlatTree = void 0;
/**
 * Immutable flat tree is the tree where position in hierarchy is defined by a delimited string key.
 */
class ImmutableFlatTree {
    /**
     * Creates the instance of ImmutableFlatTree from an array of [key, value] tuples
     * @param items Array of [key, value] tuples
     */
    constructor(items, delimiter = ".") {
        this.delimiter = delimiter;
        this.items = new Array();
        const keys = new Set();
        // Fill in the new items calculating level if necessary, skipping duplicates
        items.forEach(([key, value, level]) => {
            if (!keys.has(key)) {
                this.items.push([key, value, level ? level : this.levelOf(key)]);
                keys.add(key);
            }
        });
    }
    levelOf(value) {
        return value.split(this.delimiter).length;
    }
    /**
     * Returns the elements of a tree that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate) {
        return new ImmutableFlatTree(this.items.filter(predicate), this.delimiter);
    }
    ;
    /**
     * Returns item descendants
     * @param parent Parent key (or empty for root)
     * @param depth Depth (1 means children)
     * @returns Map of descendants
     */
    descendants(parentKey, depth) {
        let limit = depth;
        if ((parentKey == null) && (depth == null)) {
            return this;
        }
        if (parentKey) {
            const parent = this.get(parentKey);
            if (!parent) {
                // Parent not found: return the empty tree
                return new ImmutableFlatTree([]);
            }
            const [, , parentDepth] = parent;
            if ((parentDepth) && (depth)) {
                limit = parentDepth + depth;
            }
        }
        return this.filter(item => {
            let match;
            const [key, , level] = item;
            match = false;
            if (parentKey) {
                match = key.startsWith(parentKey + this.delimiter) && key != parentKey;
            }
            if (limit) {
                match = match && (level <= limit);
            }
            return match ? item : null;
        });
    }
    /**
     * Iterates over tree elements
     * @param callbackfn Callback
     * @param thisArg Value of this
     */
    forEach(callbackfn) {
        this.items.forEach(callbackfn);
    }
    /**
     * Gets tree item by key
     * @param key Item key
     * @returns Tree item
     */
    get(key) {
        return this.items.find((value) => value[0] == key ? value : null);
    }
    /**
     * Returns tree length
     */
    get size() {
        return this.items.length;
    }
    /**
     * Returns entries as array
     */
    get entries() {
        return this.items;
    }
}
exports.ImmutableFlatTree = ImmutableFlatTree;
//# sourceMappingURL=immutable_flat_tree.js.map