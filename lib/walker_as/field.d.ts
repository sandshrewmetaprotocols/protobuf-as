import { decorated } from '../proto/index.js';
import { Writer } from './index.js';
import { TypeInfo } from './type_info.js';
import { Options } from '../options.js';
/**
 * Field code blocks
 */
export declare class Field {
    private p;
    private options;
    constructor(p: Writer, options: Options);
    static typeDecl(field: decorated.Field, type: TypeInfo, options: Options): string;
    decl(field: decorated.Field): void;
}
