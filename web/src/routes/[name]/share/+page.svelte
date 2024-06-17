<script lang="ts">
    import { page } from "$app/stores";

    const href = `${$page.url.origin}/${$page.params.name}`;

    const copy = () => {
        navigator.clipboard.writeText(href);
    };
</script>

<article class="card">
    <h1>Successfully uploaded!</h1>
    <p>Share the following link to download the file:</p>
    <div class="link">
        <a {href}>{href}</a>
        <button onclick={copy}>
            <img src="/copy.svg" alt="" />
        </button>
    </div>
    <a href="/">Upload more...</a>
</article>

<style lang="scss">
    h1 {
        margin-bottom: 16px;
    }

    p {
        font-size: 18px;
    }

    .link {
        align-self: stretch;
        display: flex;
        background-color: #ececec;
        align-items: stretch;
        border: 2px solid var(--primary);
        border-radius: 16px;
        overflow: hidden;

        a {
            flex: 1;
            padding: 16px;
            color: black;
            max-width: min(300px, 80vw);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 0;
            padding: 0 12px 0 12px;
            background-color: transparent;
            &:hover {
                background-color: #00000010;
            }
        }

        & + a {
            color: var(--primary);
        }
    }
</style>
