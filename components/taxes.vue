<template>
    <div class="d-flex justify-center align-center text-justify">
        <v-card flat max-width="640px">
            <div class="text-h6 ma-4">
                <span>What are your average annual taxes and returns?</span>
            </div>
            <v-card-text>
                Taxes are fees or charges imposed by governments to fund public services and programs. 
                Income tax and investment tax are two types of taxes that are levied on different types of financial transactions. 
                Income tax is a tax on income earned by individuals or businesses, while investment tax is a tax on gains or profits earned from certain types of investments. 
            </v-card-text>

            <v-card-actions>
                <v-text-field v-model="income_tax" type="number" suffix="%" label="Your income tax" variant="outlined" hide-details />
            </v-card-actions>

            <v-card-text>
                <v-alert icon="mdi-hand-coin-outline" append-inner="Years" variant="tonal" border="start" border-color="primary">
                    The income tax rate typically increases as the amount of income earned increases. Income tax is usually withheld from an individual's paycheck by their employer or paid directly by the individual to the government.
                </v-alert>
            </v-card-text>

            <v-card-actions>
                <v-text-field v-model="invest_tax" type="number" suffix="%" label="Your investment tax" variant="outlined" hide-details />
            </v-card-actions>

            <v-card-text>
                <v-alert icon="mdi-hand-coin-outline" append-inner="Years" variant="tonal" border="start" border-color="primary">
                    Investment taxes can be of different types such as capital gains tax, dividend tax or interest tax. The investment tax rate can vary depending on the type of investment and the length of time the investment was held.
                </v-alert>
            </v-card-text>

            <v-card-text>
                Annual average investment returns refer to the average percentage increase or decrease in the value of an investment over a period of one year, including any dividends or interest earned during that time.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="annual_average_invest_return" type="number" suffix="%" label="Avg. annual investment returns" variant="outlined" hide-details />
            </v-card-actions>

            <v-card-text>
                <v-alert icon="mdi-information-outline" variant="tonal" border="start" border-color="secondary">
                    It is important to note that in order to accurately calculate taxes and returns, it is necessary to perform individual calculations for each income or investment. However, for the sake of simplicity, we will use the annual average.
                </v-alert>
            </v-card-text>
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
const annual_average_invest_return = computed(
{
   get: function()         { return store.annual_average_invest_return * 100; },
   set: function(newValue) { store.annual_average_invest_return = newValue / 100; }
});
</script>