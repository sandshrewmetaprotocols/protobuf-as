import { decorated } from "../proto/index.js";
import { Writer } from "./index.js";
/**
 * Namespace code blocks
 */
export declare class NamespaceSingleFile {
    private p;
    constructor(p: Writer);
    start(ns: decorated.Namespace): void;
    finish(ns: decorated.Namespace): void;
}
