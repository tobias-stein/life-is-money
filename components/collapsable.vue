<template>
    <v-expansion-panels v-model="open" multiple class="ma-2" style="max-width: calc(100% - 16px);">
        <v-expansion-panel :value="title" elevation="0">
            <v-expansion-panel-title hide-actions>
                <v-row>
                    <v-col cols="12" :class="`text-${color} text-subtitle pa-0`"><v-icon v-if="icon" x-small class="mr-2">{{ icon }}</v-icon>{{ title }}</v-col>
                    <v-col v-if="!is_open(title)" class="ma-0 pl-0"><span class="d-inline-block text-truncate text-caption text-weight-thin" style="max-width: calc(min(640px, 100vw) - 32px);">{{ text }}</span></v-col>
                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <span v-html="text" class="text-caption"></span>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script setup>

    const props = defineProps({
        title: { type: String, default: "" },
        text: { type: String, default: "" },
        icon: { type: String, default: 'mdi-information-outline' },
        color: { type: String, default: 'secondary' },
        collapsed: { type: Boolean, default: true },
    });

    const open = ref([]);
    function is_open(label) { return open.value.find(x => x === label) !== undefined; }

    onMounted(() => { if(!props.collapsed) { open.value.push(props.title); } });
</script>