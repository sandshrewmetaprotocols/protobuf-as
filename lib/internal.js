"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readToBuffer = void 0;
function readToBuffer(stream) {
    return new Promise((resolve) => {
        const ret = [];
        let len = 0;
        stream.on('readable', () => {
            let chunk;
            while ((chunk = stream.read())) {
                ret.push(chunk);
                len += chunk.length;
            }
        });
        stream.on('end', () => {
            resolve(Buffer.concat(ret, len));
        });
    });
}
exports.readToBuffer = readToBuffer;
//# sourceMappingURL=internal.js.map