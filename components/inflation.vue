<template>
    <div class="d-flex justify-center align-center">
        <v-card flat max-width="640px" class="text-justify">
            <div class="text-h6 ma-4">
                <span>What is the average annual inflation rate?</span>
            </div>
            <v-card-text>
                Inflation refers to the general increase in prices of goods and services in an economy over time. 
                Put simply, inflation means that the purchasing power of a unit of currency decreases over time. 
                This means that it takes more units of currency to buy the same amount of goods and services that 
                could have been bought for less in the past.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="annual_average_inflation_rate" type="number" suffix="%" label="Average annual inflation rate" variant="outlined" />
            </v-card-actions>
            <v-card-text>
                Usually wages increase in response to inflation. By checking this option it is assumed that the
                determined hourly rate is also increased over the years by the same rate as the inflation. When
                this option is turned off, this results in higher hour-rates to compensate the effect of inflation.
            </v-card-text>
            <v-card-actions>
                    <v-checkbox v-model="store.inflation_adjusted_hour_rate" label="Adjust hour-rate by inflation" color="primary" />
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
import useDefaultStore from "@/stores"

const store = useDefaultStore();

const annual_average_inflation_rate = computed(
{
   get: function()         { return (store.annual_average_inflation_rate * 100); },
   set: function(newValue) { store.annual_average_inflation_rate = newValue / 100; }
});
</script>