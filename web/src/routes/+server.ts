import { putObject } from "$lib/storage";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export const POST: RequestHandler = async ({ request }) => {
    let data = await request.formData();

    let file = data.get("file") as File | null;
    if (file === null) error(422);
    if (file.size > 50 * 1024 * 1024) error(413);

    // Incorrect typing, see:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542
    let stream = Readable.fromWeb(file.stream() as ReadableStream);

    try {
        let objName = await putObject(file.name, stream, file.size);
        return Response.json({ name: objName });
    } catch (e: any) {
        console.error(e);
        error(400, JSON.stringify(e));
    }
};
