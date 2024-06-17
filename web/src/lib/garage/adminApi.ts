export default class GarageAdminApi {
    private baseUrl: string;
    private key: string;

    public constructor(baseUrl: string, admin_key: string) {
        this.baseUrl = baseUrl;
        this.key = admin_key;
    }

    public async getLayout(): Promise<LayoutState> {
        return this.fetch("GET", "/layout");
    }

    public async modifyLayout(data: LayoutUpdate[]) {
        return this.fetch("POST", "/layout", data);
    }

    public async applyLayout(version: number) {
        return this.fetch("POST", "/layout/apply", { version });
    }

    public async status(): Promise<Status> {
        return this.fetch<Status>("GET", "/status");
    }

    public async getBucketList() {
        return this.fetch<Bucket[]>("GET", "/bucket?list");
    }

    public async createBucket(alias: string): Promise<Bucket> {
        return this.fetch("POST", "/bucket", { globalAlias: alias });
    }

    public async getKeyList(): Promise<KeyShort[]> {
        return this.fetch("GET", `/key?list`);
    }

    public async createKey(name?: string): Promise<ApiKey> {
        return this.fetch("POST", `/key?list`, { name });
    }

    public async deleteKey(key: string) {
        return this.fetch("DELETE", `/key?id=${key}`);
    }

    public async allowKey(bucketId: string, accessKeyId: string, permissions: Permissions) {
        return this.fetch("POST", "/bucket/allow", { bucketId, accessKeyId, permissions });
    }

    private async fetch<T = void>(method: "GET" | "DELETE", endpoint: string): Promise<T>;
    private async fetch<T = void>(method: "POST", endpoint: string, body?: any): Promise<T>;
    private async fetch<T = void>(
        method: "GET" | "POST" | "DELETE",
        endpoint: string,
        body?: any
    ): Promise<T> {
        let url = this.baseUrl + endpoint;
        let init = {
            method,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers: { Authorization: `Bearer ${this.key}` }
        };
        let response = await global.fetch(url, init);
        if (response.status === 204) return undefined as T;
        else return await response.json();
    }
}

export type Status = {
    node: string;
};

export type Layout = {
    id: string;
    zone: string;
    capacity: number;
    tags: string[];
};

export type LayoutUpdate = Layout | { id: string; remove: true };

export type LayoutState = {
    version: number;
    roles: Layout[];
};

export type Bucket = {
    id: string;
    globalAliases: string[];
};

export type Permissions = {
    read: boolean;
    write: boolean;
    owner: boolean;
};

export type KeyShort = {
    id: string;
    name: string;
};

export type ApiKey = {
    name: string;
    accessKeyId: string;
    secretAccessKey: string;
};
