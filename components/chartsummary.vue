<template>
    <v-card>
        <v-card-text>
            <v-alert icon="mdi-cogs" title="Simulation inputs" variant="tonal" border="start" class="mb-2">
                <v-table density="compact">
                    <tbody>
                        <tr>
                            <td>Min. monthly expenses</td>
                            <td>{{ store.minimum_monthly_expenses.toFixed(2) }}</td>
                        </tr>
                        <tr>
                            <td>Founding period</td>
                            <td>{{ store.founding_period }} years</td>
                        </tr>
                        <tr>
                            <td>Total required founds (inflation adj.)</td>
                            <td>{{ total_required_founds }}</td>
                        </tr>
                        <tr>
                            <td>Saving strategy</td>
                            <td v-if="store.monthly_saving_rate > 0">
                                <v-icon x-small>mdi-cash-multiple</v-icon>
                                {{ store.monthly_saving_rate.toFixed(2) }}
                                <v-icon x-small>mdi-menu-right</v-icon>
                                <span><v-icon x-small>mdi-piggy-bank-outline</v-icon>{{ (store.monthly_saving_rate * (1.0 - store.saving_risk_ratio)).toFixed(2) }}</span>
                                +
                                <span><v-icon x-small>mdi-bank-outline</v-icon>{{ (store.monthly_saving_rate * store.saving_risk_ratio).toFixed(2) }}</span>
                            </td>
                            <td v-else><v-icon x-small>mdi-currency-usd-off</v-icon></td>
                        </tr>
                        <tr v-if="store.saving_risk_ratio > 0 && store.monthly_saving_rate > 0">
                            <td>Avg. anual returns</td>
                            <td>{{ (store.anual_average_invest_return * 100).toFixed(2) }}%</td>
                        </tr>
                        
                        <tr>
                            <td>Avg. anual inflation</td>
                            <td>{{ (store.anual_average_inflation_rate * 100).toFixed(2) }}%</td>
                        </tr>
                        <tr>
                            <td>Inflation adjusted hour rate</td>
                            <td>{{ store.inflation_adjusted_hour_rate ? 'Yes' : 'No' }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-alert>
            <v-alert icon="mdi-currency-usd" title="Minimum required hour rate" variant="tonal" border="start" border-color="error" class="mb-2">
                In order to compensate <strong>{{ store.minimum_monthly_expenses.toFixed(2) }} monthly expenses</strong> over a period of <strong>{{ store.founding_period }}</strong> years, 
                you will require a minimum hour rate of <strong class="text-primary">{{ min_required_rate_user }}</strong>. In case of a very bad economy a minimum hour rate of <strong class="text-primary">{{ min_required_rate_wors }}</strong> 
                is required.
            </v-alert>
            <v-alert icon="mdi-flag-triangle" title="Financial Independence"  variant="tonal" border="start" border-color="primary" class="mb-2">
                <v-table density="compact">
                    <tbody>
                        <tr v-for="item in [fi_quantile(0.05), fi_quantile(0.10), fi_quantile(0.20), fi_quantile(0.50)]" :key="item.year">
                            <td>in <strong>{{ item.year }}</strong> years</td>
                            <td>at a <strong>{{ item.rate }}</strong> hour rate</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-alert>
       
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
    import useDefaultStore from "@/stores";
    import { ISimulationResults, forecast_min_required_founds, quantile } from "@/src/util";

    const store = useDefaultStore();

    const { sim_data } = defineProps({
        sim_data: { type: Object as PropType<{ [scenario: string]: ISimulationResults }>, required: true }
    });

    const total_required_founds = computed(() => 
    {
        return forecast_min_required_founds(store.minimum_monthly_expenses, store.anual_average_inflation_rate, store.founding_period).toFixed(2);
    });

    const min_required_rate_user = computed(() => 
    { 
        if(sim_data['user'] === undefined) { return '' }
        return Math.ceil([...sim_data['user'].fail_values.values()].reverse()[0]) + 1; 
    });

    const min_required_rate_wors = computed(() => 
    { 
        if(sim_data['worst'] === undefined) { return '' }
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