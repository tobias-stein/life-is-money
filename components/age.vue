<template>
    <div class="d-flex justify-center align-center text-justify">
        <v-card flat max-width="640px">
            <div class="text-h6 ma-4">
                <span>What is your estimated founding period?</span>
            </div>
            <v-card-text>
                The <strong>founding period</strong> refers to the length of time, measured in years, between the present day and the estimated date of your death. It is an important factor in financial planning, as it helps to determine the amount of funding required to cover expenses over the course of one's lifetime.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="current_age" type="number" label="Your current age" variant="outlined">
                    <template v-slot:append-inner>Years</template>
                </v-text-field>
            </v-card-actions>
            <v-card-actions>
                <v-text-field v-model="expected_age" type="number" label="How long will you live?" variant="outlined">
                    <template v-slot:append-inner>Years</template>
                    </v-text-field>
            </v-card-actions>
            <v-card-actions>
                <v-text-field v-model="store.founding_period" disabled label="Total founding period" variant="outlined" hide-details>
                    <template v-slot:append-inner>Years</template>
                </v-text-field>
            </v-card-actions>
            <v-card-text>
                <v-alert icon="mdi-calendar-clock-outline" title="Founding period length" append-inner="Years" variant="tonal" border="start" border-color="primary">
                    Please note that a longer founding period will require a significantly larger amount of funds due to the impact of inflation on the cost of goods and services over time, leading to a greater founding requirement to maintain the same standard of living.
                </v-alert>
            </v-card-text>
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