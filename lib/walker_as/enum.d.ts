import { decorated } from '../proto/index.js';
import { Writer } from "./index.js";
/**
 * Enum code blocks
 */
export declare class Enum {
    private p;
    constructor(p: Writer);
    start(en: decorated.Enum): void;
    value(item: decorated.EnumValue): void;
    finish(en: decorated.Enum): void;
}
