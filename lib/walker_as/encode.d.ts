import { decorated } from '../proto/index.js';
import { Writer } from './index.js';
/**
 * Generates encode() method
 */
export declare class Encode {
    private p;
    private encoder;
    constructor(p: Writer);
    start(message: decorated.Message): void;
    begin(): void;
    end(): void;
    finish(message: decorated.Message): void;
    field(field: decorated.Field): void;
    private tag;
    private length;
    private value;
    private encodeMessage;
    private encodeElementary;
    private elementary;
    private elementaryRepeated;
    private elementaryRepeatedPacked;
    private message;
    private messageRepeated;
    private map;
}
