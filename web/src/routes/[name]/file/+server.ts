import { getObject, getObjectInfo } from "$lib/storage";
import type { RequestHandler } from "@sveltejs/kit";
import { ReadableStream as ReadableStreamWeb } from "stream/web";

export const GET: RequestHandler = async ({ params }) => {
    let name = params.name!;
    let obj = await getObject(name);
    let { filename } = await getObjectInfo(name);
    return new Response(ReadableStreamWeb.from(obj) as ReadableStream, {
        headers: [["Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`]]
    });
};
