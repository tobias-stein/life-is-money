<template>
    <div class="d-flex justify-center align-center">
        <v-card flat max-width="640px" class="text-justify">
            <div class="text-h6 ma-4">
                <span>What is the average annual inflation rate?</span>
            </div>
            <v-card-text>
                Inflation refers to the general increase in the price level of goods and services in an economy over time. It is a measure of the rate at which the purchasing power of a currency is declining, meaning that the same amount of money can buy less than it could before.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="annual_average_inflation_rate" type="number" suffix="%" label="Average annual inflation rate" variant="outlined" :type="focused_inflation ? 'number' : 'text'" hide-details @update:focused="(value) => focused_inflation=value" />
            </v-card-actions>

            <collapsable 
                title="Inflation Cause & Effect" 
                text="Inflation can be caused by a variety of factors, including increased demand for goods and services, rising production costs, and government policies such as monetary and fiscal policy. Moderate inflation is generally considered to be a sign of a healthy economy, as it can encourage spending and investment. However, high inflation can have negative effects on economic growth, investment, and consumer purchasing power." 
                color="primary" 
                icon="mdi-finance" 
            />
            <!-- <v-card-text>
                Usually wages increase in response to inflation. By checking this option it is assumed that the
                determined hourly rate is also increased over the years by the same rate as the inflation. When
                this option is turned off, this results in higher hour-rates to compensate the effect of inflation.
            </v-card-text>
            <v-card-actions>
                    <v-checkbox v-model="store.inflation_adjusted_hour_rate" label="Adjust hour-rate by inflation" color="primary" />
            </v-card-actions> -->

            <collapsable 
                title="Inflation Is Fluctuating" 
                text="It is important to note that annual inflation rates can be subject to fluctuations. For the sake of simplicity, we will assume that the average annual inflation rate remains constant throughout the entire funding period." 
            />
        </v-card>
    </div>
</template>
<script setup>
import useDefaultStore from "@/stores"

const store = useDefaultStore();

const focused_inflation = ref(false);

const annual_average_inflation_rate = computed(
{
   get: function()         { return focused_inflation.value ? (store.annual_average_inflation_rate * 100) : (store.annual_average_inflation_rate * 100).toFixed(2); },
   set: function(newValue) { store.annual_average_inflation_rate = newValue / 100; }
});
</script>