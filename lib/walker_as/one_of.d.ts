import { decorated } from "../proto/index.js";
import { Writer } from "./index.js";
import { Options } from '../options.js';
/**
 * OneOf code blocks
 */
export declare class OneOf {
    private p;
    private options;
    constructor(p: Writer, options: Options);
    discriminatorDecl(desc: decorated.Message, group: string): void;
    discriminatorConst(field: decorated.Field): void;
    static varName(options: Options, id: string, f: string): string;
    static indexVarName(options: Options, id: string, f: string): string;
}
