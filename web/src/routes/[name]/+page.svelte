<script lang="ts">
    import { page } from "$app/stores";
    import { humanFileSize } from "$lib/util.js";

    let { data } = $props();

    function download() {
        window.location.href = `/${$page.params.name}/file`;
    }
</script>

<article>
    <h1>{data.displayName}</h1>
    <section>
        <span>File size (comp):</span>
        <span>{humanFileSize(data.compSize)}</span>
        <span>File size (full):</span>
        <span>{humanFileSize(data.fullSize)}</span>
        <span>Uploaded at:</span>
        <span>{data.lastModified.toLocaleDateString("en-GB")}</span>
    </section>
    <button onclick={download}>Download</button>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 8px;
        padding: 24px;
        gap: 24px;

        h1 {
            text-align: center;
            font-size: 24px;
            font-weight: 500;
            color: var(--primary);
        }

        section {
            display: grid;
            grid-template-columns: max-content max-content;
            gap: 4px 48px;
            padding: 0 16px;
            font-size: 18px;

            span:nth-child(even) {
                text-align: end;
            }
        }

        button {
            height: 48px;
            padding: 0 56px;
            margin: 0 auto;
            border: 0;
            border-radius: 8px;

            font-size: 18px;
            text-transform: uppercase;

            color: white;
            background-color: var(--primary);
        }
    }
</style>
