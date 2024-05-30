/// <reference types="node" />
/// <reference types="node" />
import ReadStream = NodeJS.ReadStream;
export declare function readToBuffer(stream: ReadStream): Promise<Buffer>;
