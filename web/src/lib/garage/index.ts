import * as Minio from "minio";
import { host, layoutZone, ports } from "./config";
import setup from "./setup";

let client: Minio.Client | null = null;

export default async function getGarageClient(): Promise<Minio.Client> {
    if (client === null) {
        let key = await setup();
        const minio = new Minio.Client({
            endPoint: host,
            port: ports.s3,
            useSSL: false,
            accessKey: key.accessKeyId,
            secretKey: key.secretAccessKey,
            region: "garage",
            pathStyle: true
        });
        client = minio;
    }
    return client;
}
