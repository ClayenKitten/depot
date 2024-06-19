import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getObjectInfo } from "$lib/storage";

export const load: PageServerLoad = async ({ params }) => {
    try {
        return await getObjectInfo(params.name);
    } catch (e) {
        console.error(e);
        error(500, "Failed to connect to S3 storage");
    }
};
