<template>
    <div class="d-flex justify-center align-center">
        <v-card flat max-width="640px">
            <v-card-title>
                <span>What is your required founding period?</span>
            </v-card-title>
            <v-card-text>
                The founding period is the time spanning from your current age until your death.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="current_age" type="number" label="Your current age" variant="outlined" />
            </v-card-actions>
            <v-card-actions>
                <v-text-field v-model="expected_age" type="number" label="How long will you life?" variant="outlined" />
            </v-card-actions>
            <v-card-actions>
                <v-text-field v-model="store.founding_period" disabled type="number" label="Total founding period" variant="outlined" />
            </v-card-actions>
            <v-alert icon="mdi-calendar-clock-outline" title="Founding period" variant="tonal" border="start" border-color="primary"  density=“compact”>
                The <strong>founding period</strong> is the timespan in years from now until your estimated death.
            </v-alert>
        </v-card>
    </div>
</template>
<script setup>
import useDefaultStore from "@/stores"

const store = useDefaultStore();
const current_age = computed(
{
    get: function()         { return store.current_age; },
    set: function(newValue) 
    { 
        store.current_age = Math.min(Math.max(0.0, newValue), 120); 
        store.expected_age = Math.min(Math.max(store.current_age + 1, store.expected_age), 121);
    }
});

const expected_age = computed(
{
    get: function()         { return store.expected_age; },
    set: function(newValue) { store.expected_age = Math.min(Math.max(store.current_age + 1, newValue), 121); }
});

</script>