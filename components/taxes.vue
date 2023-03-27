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
                <v-text-field v-model="income_tax" type="number" suffix="%" label="Your income tax" variant="outlined" hide-details :type="focused_income ? 'number' : 'text'" @update:focused="(value) => focused_income=value" />
            </v-card-actions>

            <collapsable 
                title="Income Taxes" 
                text="The income tax rate typically increases as the amount of income earned increases. Income tax is usually withheld from an individual's paycheck by their employer or paid directly by the individual to the government." 
                color="primary" 
                icon="mdi-hand-coin-outline" 
            />
            <v-card-actions>
                <v-text-field v-model="invest_tax" type="number" suffix="%" label="Your investment tax" variant="outlined" hide-details :type="focused_invest ? 'number' : 'text'" @update:focused="(value) => focused_invest=value"  />
            </v-card-actions>

            <collapsable 
                title="Investment Taxes" 
                text="Investment taxes can be of different types such as capital gains tax, dividend tax or interest tax. The investment tax rate can vary depending on the type of investment and the length of time the investment was held." 
                color="primary" 
                icon="mdi-hand-coin-outline" 
            />

            <v-card-text>
                Annual average investment returns refer to the average percentage increase or decrease in the value of an investment over a period of one year, including any dividends or interest earned during that time.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="annual_average_invest_return" type="number" suffix="%" label="Avg. annual investment returns" variant="outlined" hide-details :type="focused_return ? 'number' : 'text'" @update:focused="(value) => focused_return=value" />
            </v-card-actions>

            <collapsable 
                title="Calculating Taxes & Returns" 
                text="Investment taxes can be of different types such as capital gains tax, dividend tax or interest tax. The investment tax rate can vary depending on the type of investment and the length of time the investment was held." 
            />
        </v-card>
   </div>
</template>
<script setup>
import useDefaultStore from "@/stores"

const store = useDefaultStore();

const focused_income = ref(false);
const focused_invest = ref(false);
const focused_return = ref(false);

const income_tax = computed(
{
   get: function()         { return focused_income.value ? store.income_tax * 100 : (store.income_tax * 100).toFixed(2); },
   set: function(newValue) { store.income_tax = newValue / 100; }
});
const invest_tax = computed(
{
   get: function()         { return focused_invest.value ? store.invest_tax * 100 : (store.invest_tax * 100).toFixed(2); },
   set: function(newValue) { store.invest_tax = newValue / 100; }
});
const annual_average_invest_return = computed(
{
   get: function()         { return focused_return.value ? store.annual_average_invest_return * 100 : (store.annual_average_invest_return * 100).toFixed(2); },
   set: function(newValue) { store.annual_average_invest_return = newValue / 100; }
});
</script>