import { Transform, type TransformCallback } from "stream";

export default class LZ77Decompressor extends Transform {
    _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
        if (encoding !== "buffer") throw new Error("Invalid encoding");

        let output = Buffer.alloc(chunk.length);

        let sourceIdx = 0;
        let outputIdx = 0;

        while (sourceIdx < chunk.length) {
            let offset = chunk.at(sourceIdx)!;
            let length = chunk.at(sourceIdx + 1)!;
            let next = chunk.at(sourceIdx + 2) ?? null;
            sourceIdx += 3;

            if (offset === 0 && length === 0 && next !== null) {
                if (outputIdx + 1 >= output.length) {
                    output = increaseBuffer(output, 1);
                }
                output[outputIdx] = next;
                outputIdx += 1;
            } else {
                if (outputIdx + length >= output.length) {
                    output = increaseBuffer(output, length);
                }
                output.copyWithin(outputIdx, outputIdx - offset, outputIdx - offset + length);
                outputIdx += length;
                if (next !== null) {
                    output[outputIdx] = next;
                    outputIdx += 1;
                }
            }
        }
        callback(null, output.subarray(0, outputIdx));
    }
}

function increaseBuffer(buffer: Buffer, required: number) {
    let newBuffer = Buffer.alloc(Math.max(buffer.length * 2, required));
    buffer.copy(newBuffer);
    return newBuffer;
}
