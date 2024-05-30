import { decorated } from '../proto/index.js';
import { Writer } from './index.js';
import { Options } from '../options.js';
/**
 * Message code blocks
 */
export declare class Message {
    private p;
    private options;
    private ext;
    constructor(p: Writer, options: Options);
    private addExt;
    start(message: decorated.Message): void;
    finish(message: decorated.Message): void;
}
