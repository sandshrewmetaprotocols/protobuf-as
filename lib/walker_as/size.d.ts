import { decorated } from '../proto/index.js';
import { Writer, GlobalsRegistry } from './index.js';
/**
 * Generates message size() and __size helper methods
 */
export declare class Size {
    private p;
    private globals;
    private sizer;
    constructor(p: Writer, globals: GlobalsRegistry);
    start(): void;
    field(field: decorated.Field): void;
    finish(): void;
    private tagSize;
    private length;
    private elementarySize;
    private elementary;
    private elementaryRepeated;
    private elementaryRepeatedPacked;
    private message;
    private messageRepeated;
    private map;
    private valueSize;
}
