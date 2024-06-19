import { Readable } from "stream";
import { randomBytes } from "crypto";
import LZ77Compressor from "./lz77/compress";
import LZ77Decompressor from "./lz77/decompress";
import { mkdir, readFile, writeFile } from "fs/promises";
import { stream2buffer } from "./util";

export async function putObject(
    displayName: string,
    stream: Readable,
    size: number
): Promise<string> {
    let full_name = fullName(displayName);
    await mkdir("/data", { recursive: true });
    let compressed = await stream2buffer(stream.pipe(new LZ77Compressor()));
    await writeFile(`/data/${objectName(full_name)}`, compressed);
    await writeFile(
        `/data/${objectName(full_name)}.meta`,
        JSON.stringify({
            displayName: displayName,
            compSize: compressed.length,
            fullSize: size,
            filename: displayName,
            lastModified: new Date().toUTCString()
        } satisfies ObjectInfo),
        "utf8"
    );
    return full_name;
}

export async function getObject(fullName: string): Promise<Readable> {
    let data = await readFile(`/data/${objectName(fullName)}`);
    let decompress = Readable.from(data).pipe(new LZ77Decompressor());
    return decompress;
}

export async function getObjectInfo(fullName: string): Promise<ObjectInfo> {
    let data = await readFile(`/data/${objectName(fullName)}.meta`, "utf8");
    return JSON.parse(data);
}

export type ObjectInfo = {
    displayName: string;
    compSize: number;
    filename: string;
    fullSize: number;
    lastModified: string;
};

function fullName(displayName: string): string {
    let id = randomBytes(8).toString("base64url");
    displayName = displayName.substring(0, 32);
    let name = `${displayName}-${id}`;
    return name;
}

function objectName(fullName: string): string {
    var i = fullName.lastIndexOf("-");
    if (i === -1) return fullName;
    let displayName = fullName.slice(i + 1);
    return displayName;
}

function displayName(fullName: string): string {
    var i = fullName.lastIndexOf("-");
    if (i === -1) return fullName;
    let displayName = fullName.slice(0, i);
    return displayName;
}
