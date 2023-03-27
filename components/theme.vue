<template>
    <v-btn icon @click="toggleTheme">
        <v-icon class="toggle" :class='{ "rotate": !theme.global.current.value.dark }'>mdi-theme-light-dark</v-icon>
    </v-btn>
</template>
<script setup>
    import useDefaultStore from "@/stores";
    import { useTheme } from 'vuetify/lib/framework.mjs';

    const store = useDefaultStore();
    const theme = useTheme();
    function toggleTheme() 
    {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
    }
</script>
<style scoped>
.toggle {
    transition: transform .3s ease-in-out !important;  
}

.toggle.rotate {
    transform: rotate(180deg);
}
</style>