import { test, expect } from "vitest";
import { Readable } from "stream";
import { stream2buffer } from "$lib/util";
import LZ77Compressor from "../compress";
import LZ77Decompressor from "../decompress";
import { readFile } from "fs/promises";
import path from "path";

const str = "abracadabra";
const expected = Buffer.from(
    [
        [0, 0, "a".charCodeAt(0)],
        [0, 0, "b".charCodeAt(0)],
        [0, 0, "r".charCodeAt(0)],
        [3, 1, "c".charCodeAt(0)],
        [2, 1, "d".charCodeAt(0)],
        [7, 4]
    ].flat()
);

test("abracadabra_compress", async () => {
    let buffer = Buffer.from(str, "ascii");
    let stream = Readable.from(buffer);
    let compressed = await stream2buffer(stream.pipe(new LZ77Compressor()));

    expect(compressed).toEqual(expected);
});

test("abracadabra_uncompress", async () => {
    let buffer = Buffer.from(expected);
    let stream = Readable.from(buffer);
    let uncompressed = await stream2buffer(stream.pipe(new LZ77Decompressor()));
    expect(uncompressed.toString("ascii")).toEqual(str);
});

test("abracadabra_full", async () => {
    let buffer = Buffer.from(str, "ascii");
    let compressed = await stream2buffer(Readable.from(buffer).pipe(new LZ77Compressor()));
    let uncompressed = await stream2buffer(Readable.from(compressed).pipe(new LZ77Decompressor()));
    expect(uncompressed.toString("ascii")).toBe(str);
});

test("alphabet_full", async () => {
    const str = `1234567890abcdefghijklmnopqrstuvwxyz`;
    let buffer = Buffer.from(str, "utf-8");
    let compressed = await stream2buffer(Readable.from(buffer).pipe(new LZ77Compressor()));
    let uncompressed = await stream2buffer(Readable.from(compressed).pipe(new LZ77Decompressor()));
    expect(uncompressed.toString("utf-8")).toBe(str);
});

test("text_lorem_ipsum", async () => {
    const str = await readFile(path.join(__dirname, "lorem_ipsum.txt"), { encoding: "ascii" });
    let buffer = Buffer.from(str, "ascii");
    let compressed = await stream2buffer(Readable.from(buffer).pipe(new LZ77Compressor()));
    let uncompressed = await stream2buffer(Readable.from(compressed).pipe(new LZ77Decompressor()));
    expect(uncompressed.toString("ascii")).toBe(str);

    console.log("Original:", buffer.length);
    console.log("Compressed:", compressed.length);
});

test("text_pg1513", async () => {
    const str = await readFile(path.join(__dirname, "pg1513.txt"), { encoding: "ascii" });
    let buffer = Buffer.from(str, "ascii");
    let compressed = await stream2buffer(Readable.from(buffer).pipe(new LZ77Compressor()));
    let uncompressed = await stream2buffer(Readable.from(compressed).pipe(new LZ77Decompressor()));
    expect(uncompressed.toString("ascii")).toBe(str);

    console.log("Original:", buffer.length);
    console.log("Compressed:", compressed.length);
});
