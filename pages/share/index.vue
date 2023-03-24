<template>
</template>
<script setup>
    import useDefaultStore from "@/stores";
    const store = useDefaultStore();
    const route = useRoute()

    const { query: { code } } = route;
    if(code === undefined) 
    {
        throw createError({ statusCode: 400, statusMessage: "No code provided!", fatal: true });
    }
    else 
    {
        store.load(code);
        await navigateTo({ path: '/', query: { shared: true } });
    }
</script>