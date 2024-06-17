import { env } from "$env/dynamic/private";
import GarageAdminApi, { type ApiKey, type Bucket } from "./adminApi";
import { bucketName, host, keyName, layoutCapacity, layoutTag, layoutZone, ports } from "./config";

const baseUrl = `http://${host}:${ports.admin}/v1`;

export default async function setup(): Promise<ApiKey> {
    let adminToken = env.GARAGE_ADMIN_TOKEN!;
    let api = new GarageAdminApi(baseUrl, adminToken);

    await setupLayout(api);
    let bucket = await setupBucket(api);
    let key = await setupKey(api);
    await api.allowKey(bucket.id, key.accessKeyId, { read: true, write: true, owner: false });

    return key;
}

async function setupLayout(api: GarageAdminApi): Promise<void> {
    let { version, roles } = await api.getLayout();
    if (roles.some(x => x.tags.includes(layoutTag))) {
        return;
    }
    let { node: id } = await api.status();
    await api.modifyLayout([{ id, capacity: layoutCapacity, zone: layoutZone, tags: [layoutTag] }]);
    await api.applyLayout(version + 1);
}

async function setupBucket(api: GarageAdminApi): Promise<Bucket> {
    let bucketList = await api.getBucketList();
    let bucket = bucketList.find(x => x.globalAliases.includes(bucketName));
    if (bucket === undefined) {
        bucket = await api.createBucket(bucketName);
    }
    return bucket;
}

async function setupKey(api: GarageAdminApi): Promise<ApiKey> {
    let keyList = await api.getKeyList();
    for (const key of keyList) {
        await api.deleteKey(key.id);
    }
    let apiKey = await api.createKey(keyName);
    return apiKey;
}
