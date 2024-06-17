import getGarageClient from "./garage";
import { bucketName } from "./garage/config";
import { Readable } from "stream";
import { randomBytes } from "crypto";
import { Lz77 } from "./lz77";

export async function putObject(
    displayName: string,
    stream: Readable,
    size: number
): Promise<string> {
    let client = await getGarageClient();
    let objName = objectName(displayName);
    let compressed = Lz77.compress(stream);
    await client.putObject(bucketName, objName, compressed, size, { fullsize: size });
    return objName;
}

export async function getObject(objectName: string): Promise<Readable> {
    let client = await getGarageClient();
    let stream = await client.getObject(bucketName, objectName);
    return Lz77.decompress(stream);
}

export async function getObjectInfo(objectName: string): Promise<ObjectInfo> {
    let client = await getGarageClient();
    let { size, lastModified, metaData } = await client.statObject(bucketName, objectName);
    return {
        displayName: displayName(objectName),
        lastModified,
        compSize: size,
        fullSize: metaData.fullsize
    };
}

export type ObjectInfo = {
    displayName: string;
    compSize: number;
    fullSize: number;
    lastModified: Date;
};

function objectName(displayName: string): string {
    let id = randomBytes(8).toString("base64url");
    displayName = displayName.substring(0, 32);
    let name = `${displayName}-${id}`;
    return name;
}

function displayName(objectName: string): string {
    var i = objectName.lastIndexOf("-");
    if (i === -1) return objectName;
    let displayName = objectName.slice(0, i);
    return displayName;
}
