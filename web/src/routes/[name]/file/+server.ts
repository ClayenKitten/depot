import { getObject } from "$lib/storage";
import type { RequestHandler } from "@sveltejs/kit";
import { ReadableStream as ReadableStreamWeb } from "stream/web";

export const GET: RequestHandler = async ({ params }) => {
    let name = params.name!;
    let obj = await getObject(name);
    return new Response(ReadableStreamWeb.from(obj) as ReadableStream, {
        headers: [
            ["Content-Type", "text/plain; charset=utf-8"],
            // FIXME: preserve filename
            ["Content-Disposition", 'attachment; filename="MyFileName.txt"']
        ]
    });
};
