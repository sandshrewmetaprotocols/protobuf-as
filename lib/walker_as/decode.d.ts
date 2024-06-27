import { decorated } from '../proto/index.js';
import { Writer, GlobalsRegistry } from './index.js';
import { Options } from "../options.js";
/**
 * Generates decode() method
 */
export declare class Decode {
    private p;
    private globals;
    private options;
    private decoder;
    decodeType: string;
    constructor(p: Writer, globals: GlobalsRegistry, options: Options);
    start(message: decorated.Message): void;
    begin(): void;
    end(): void;
    finish(message: decorated.Message): void;
    field(field: decorated.Field): void;
    private elementary;
    private repeatedElementary;
    private repeatedElementaryPacked;
    private message;
    private repeatedMessage;
    private map;
    private beginMessageDecode;
    private endMessageDecode;
    private newDataView;
    private readLength;
    private skipLength;
    private decodeElementary;
    private decodeMessage;
    private registerMapMethod;
}
