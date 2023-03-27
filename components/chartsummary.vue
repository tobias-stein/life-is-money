<template>
    <v-card class="ma-0 text-justify">
        <v-card-text class="ma-0 pa-2">
            
            <v-alert icon="mdi-sigma" title="Total required founds" variant="tonal" density="compact" border="start" border-color="secondary" class="mb-2">
                The total amount of funds required to sustain a period of <strong>{{ store.founding_period }}</strong> years with monthly expenditures of <strong>{{ compactNumber(store.minimum_monthly_expenses) }}</strong> (<strong>{{ compactNumber(store.min_annual_expenses) }}</strong> annually) is <strong class="text-secondary">{{ compactNumber(total_required_founds) }}</strong>, which has been adjusted to account for the inflation rate over time.
            </v-alert>

            <v-alert icon="mdi-flag-triangle" title="Financial Independence"  variant="tonal" density="compact" border="start" border-color="primary" class="mb-2">
                <v-table density="compact">
                    <tbody>
                        <tr v-for="item in [fi_quantile(0.05), fi_quantile(0.10), fi_quantile(0.20), fi_quantile(0.50)]" :key="item.year">
                            <td><strong>{{ item.year }}</strong> years</td>
                            <td>
                                <strong>{{ compactNumber(item.rate || 0) }}</strong> hr
                                /
                                <strong>{{ compactNumber((item.rate || 0) * 8 * 20) }}</strong> mo
                                /
                                <strong>{{ compactNumber((item.rate || 0) * 8 * 20 * 12) }}</strong> yr 
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-alert>
       
            <v-alert icon="mdi-currency-usd" title="Minimum required hour rate" variant="tonal" density="compact" border="start" border-color="error" class="mb-2">
                To adequately cover <strong>{{ compactNumber(store.minimum_monthly_expenses) }}</strong>'s monthly expenses over a <strong>{{ store.founding_period }}</strong>-year period, a minimum hourly rate of <strong class="text-primary">{{ compactNumber(min_required_rate_user) }}</strong> will be necessary. In the event of an unfavorable economic climate, a minimum hourly rate of <strong class="text-primary">{{ compactNumber(min_required_rate_wors) }}</strong>  will be required.
            </v-alert>
         
            <v-alert icon="mdi-cogs" title="Simulation inputs" variant="tonal" density="compact" border="start" class="mb-2">
                <v-table density="compact">
                    <tbody>
                        <tr>
                            <td>Min. monthly expenses</td>
                            <td>{{ compactNumber(store.minimum_monthly_expenses) }}</td>
                        </tr>
                        <tr>
                            <td>Founding period</td>
                            <td>{{ store.founding_period }} years</td>
                        </tr>
                        <tr>
                            <td>Initial savings</td>
                            <td>{{ (store.initial_founds).toFixed(2) }}</td>
                        </tr>
                        <tr>
                            <td>Initial investments</td>
                            <td>{{ (store.initial_invest).toFixed(2) }}</td>
                        </tr>
                        <tr>
                            <td>Saving strategy</td>
                            <td v-if="store.use_monthly_saving_plan">
                                <v-row no-gutters class="d-flex justify-start align-center">
                                    <v-col cols="12">
                                        <v-icon x-small>mdi-cash-multiple</v-icon>
                                        {{ compactNumber(store.monthly_saving_rate) }}
                                        <v-icon x-small>mdi-menu-right</v-icon>
                                    </v-col>
                                    <v-col>
                                        <v-icon x-small>mdi-piggy-bank-outline</v-icon>
                                        {{ compactNumber(store.monthly_saving_rate * (1.0 - store.saving_risk_ratio)) }}
                                    </v-col>
                                    <v-col>
                                        <v-icon x-small>mdi-bank-outline</v-icon>
                                        {{ compactNumber(store.monthly_saving_rate * store.saving_risk_ratio) }}
                                    </v-col>
                                </v-row>
                            </td>
                            <td v-else><v-icon x-small>mdi-currency-usd-off</v-icon></td>
                        </tr>
                        <tr v-if="store.saving_risk_ratio > 0 && store.monthly_saving_rate > 0">
                            <td>Avg. annual returns</td>
                            <td>{{ (store.annual_average_invest_return * 100).toFixed(2) }}%</td>
                        </tr>
                        
                        <tr>
                            <td>Avg. annual inflation</td>
                            <td>{{ (store.annual_average_inflation_rate * 100).toFixed(2) }}%</td>
                        </tr>
                        <tr>
                            <td>Income tax</td>
                            <td>{{ (store.income_tax * 100).toFixed(2) }}%</td>
                        </tr>
                        <tr>
                            <td>Investment tax</td>
                            <td>{{ (store.invest_tax * 100).toFixed(2) }}%</td>
                        </tr>
                        <!-- <tr>
                            <td>Inflation adjusted hour rate</td>
                            <td>{{ store.inflation_adjusted_hour_rate ? 'Yes' : 'No' }}</td>
                        </tr> -->
                    </tbody>
                </v-table>
            </v-alert>

        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
    import useDefaultStore from "@/stores";
    import { forecast_min_required_founds, quantile, compactNumber } from "@/src/util";
    import { ISimulationResults } from "@/src/simulation";
    
    const store = useDefaultStore();

    const { sim_data } = defineProps({
        sim_data: { type: Object as PropType<{ [scenario: string]: ISimulationResults }>, required: true }
    });

    const total_required_founds = computed(() => 
    {
        return forecast_min_required_founds(store.minimum_monthly_expenses, store.annual_average_inflation_rate, store.founding_period);
    });

    const min_required_rate_user = computed(() => 
    { 
        if(sim_data['user'] === undefined) { return 0 }
        return Math.ceil([...sim_data['user'].fail_values.values()].reverse()[0]) + 1; 
    });

    const min_required_rate_wors = computed(() => 
    { 
        if(sim_data['worst'] === undefined) { return 0 }
        return Math.ceil([...sim_data['worst'].fail_values.values()].reverse()[0]) + 1; 
    }); 


    function fi_quantile(q: number) : { year: number, rate: number | undefined } 
    {
        if(sim_data['user'] === undefined) 
        {
            return { year: 0, rate: undefined };
        }

        const year = Math.ceil(quantile(Array.from(sim_data['user'].fi_values.keys()), q));

        return { year: year, rate: sim_data['user'].fi_values.get(year)?.toFixed(0) }
    }

</script>