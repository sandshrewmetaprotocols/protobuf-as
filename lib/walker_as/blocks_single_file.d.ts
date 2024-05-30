import { Writer } from "./index.js";
/**
 * Before and after code blocks
 */
export declare class BlocksSingleFile {
    private p;
    constructor(p: Writer);
    beforeAll(): void;
    afterAll(globals: Map<string, string>): void;
}
