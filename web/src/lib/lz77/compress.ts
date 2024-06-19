import { Transform, type TransformCallback } from "stream";
import longestSubstring from "./longest-substring";

const lookaheadSize: number = 255;
const searchSize: number = 255;

export default class LZ77Compressor extends Transform {
    _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
        if (encoding !== "buffer") throw new Error("Invalid encoding");

        let output = new OutputBuffer(chunk.length * 3);

        let i = 0;
        while (i < chunk.length) {
            let search = chunk.subarray(Math.max(0, i - searchSize), i);
            let lookahead = chunk.subarray(i, i + lookaheadSize);

            let { match, position } = longestSubstring(search, lookahead);

            let out;
            if (match.length === 0) {
                out = {
                    offset: 0,
                    length: 0,
                    next: chunk.at(i) ?? null
                };
                i += 1;
            } else {
                out = {
                    offset: search.length - position,
                    length: match.length,
                    next: chunk.at(i + match.length) ?? null
                };
                i += match.length + 1;
            }
            output.push(out);
        }
        callback(null, output.buffer);
    }
}

class OutputBuffer {
    constructor(size: number) {
        this._buffer = Buffer.alloc(size);
    }

    private _buffer: Buffer;
    private position: number = 0;

    public push(entry: Output) {
        if (entry.next !== null) {
            this._buffer.set([entry.offset, entry.length, entry.next], this.position);
            this.position += 3;
        } else {
            this._buffer.set([entry.offset, entry.length], this.position);
            this.position += 2;
        }
    }

    public get buffer() {
        return this._buffer.subarray(0, this.position);
    }
}

type Output = {
    offset: number;
    length: number;
    next: number | null;
};
