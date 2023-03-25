<template>
    <div class="d-flex justify-center align-center text-justify">
        <v-card flat max-width="640px">
            <v-card-title>
                <span>What are the expected average anual taxes and returns?</span>
            </v-card-title>
            <v-card-text>
                The founding period is the time spanning from your current age until your death.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="income_tax" type="number" suffix="%" label="Your income tax" variant="outlined" />
            </v-card-actions>
            <v-card-actions>
                <v-text-field v-model="invest_tax" type="number" suffix="%" label="Your investment tax" variant="outlined" />
            </v-card-actions>
            <v-card-actions>
                <v-text-field v-model="anual_average_invest_return" type="number" suffix="%" label="Average anual investment returns" variant="outlined" />
            </v-card-actions>
        </v-card>
   </div>
</template>
<script setup>
import useDefaultStore from "@/stores"

const store = useDefaultStore();

const income_tax = computed(
{
   get: function()         { return store.income_tax * 100; },
   set: function(newValue) { store.income_tax = newValue / 100; }
});
const invest_tax = computed(
{
   get: function()         { return store.invest_tax * 100; },
   set: function(newValue) { store.invest_tax = newValue / 100; }
});
const anual_average_invest_return = computed(
{
   get: function()         { return store.anual_average_invest_return * 100; },
   set: function(newValue) { store.anual_average_invest_return = newValue / 100; }
});
</script>