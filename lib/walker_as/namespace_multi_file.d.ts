import { decorated } from "../proto/index.js";
import { Writer } from "./index.js";
/**
 * Namespace code blocks
 */
export declare class NamespaceMultiFile {
    private p;
    constructor(p: Writer);
    parentRef(ns: decorated.Namespace): void;
    extRef(ns: decorated.Namespace, ext: string): void;
    start(ns: decorated.Namespace): void;
    finish(ns: decorated.Namespace, globals: Map<string, string>): void;
}
