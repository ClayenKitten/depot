<script lang="ts">
    import "../app.scss";

    let { children } = $props();
</script>

<div>
    <header>
        <a href="/">
            <h1>Depot</h1>
        </a>
    </header>
    <main>
        {@render children()}
    </main>
</div>

<style lang="scss">
    header {
        display: flex;
        align-items: center;
        padding: 32px 16px;
        width: 100vw;
        height: 40px;
        background-color: var(--primary);

        a {
            display: contents;
        }

        h1 {
            color: white;
            font-size: 24px;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-self: stretch;
        justify-content: center;
        align-items: center;
        gap: 16px;
        padding: 0 24px;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100vw;
        height: 100dvh;

        background-color: var(--background);
    }
</style>
