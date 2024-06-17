<script lang="ts">
    import { goto } from "$app/navigation";
    import { error } from "@sveltejs/kit";

    let files: FileList | null = $state(null);

    async function upload() {
        if (!files || files.length !== 1) return;
        let formData = new FormData();
        let file = files[0]!;
        formData.append("file", file);

        console.log(file.size);
        if (file.size > 50 * 1024 * 1024) {
            // TODO: use toast notification
            alert("File is too big.");
            return;
        }

        let response = await fetch("/", {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            let { name } = await response.json();
            goto(`/${name}/share`);
        } else {
            error(response.status, await response.json());
        }
    }
</script>

<article class="card">
    <h1>Share files with ease!</h1>
    <p>Upload a file up to 50 Mb, and get a link to share it with anyone.</p>
    <label class="file">
        <img src="/upload.svg" alt="" draggable="false" />
        <span>Upload File</span>
        <input name="file" type="file" bind:files onchange={upload} required />
    </label>
</article>
<p>Files are automatically removed in 7 days after the last download</p>

<style lang="scss">
    p {
        margin-bottom: 16px;
    }

    .file {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        padding: 24px 16px;
        gap: 8px;

        color: white;
        background-color: var(--primary);
        border-radius: 8px;
        user-select: none;

        img {
            width: 22px;
            height: 22px;
            filter: invert(1);
        }

        input {
            display: none;
        }

        &:hover {
            filter: brightness(95%);
            cursor: pointer;
        }
        &:active {
            filter: brightness(90%);
        }
    }
</style>
