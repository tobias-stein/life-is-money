<template>
    <div class="d-flex justify-center align-center text-justify">
        <v-card flat max-width="640px">
            <div class="text-h6 ma-4">
                <span>What are your {{ annually ? 'yearly' : 'monthly' }} expenditures?</span>
            </div>
            <v-card-text>
                Expenditures refer to the money spent on goods and services. It encompasses all financial transactions, including purchases, investments, and payments made for various expenses, such as rent, utilities, food, transportation, taxes, and other essentials or discretionary items.
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="minimum_monthly_expenses" :label="`${ annually ? 'Yearly' : 'Monthly' } expenditures`" :type="focused ? 'number' : 'text'" variant="outlined" hide-details @update:focused="(value) => focused=value">
                    <template v-slot:append>
                        <v-switch v-model="annually" style="width: 120px;" color="primary" density="compact" class="mt-n2" hide-details inset :label="`${annually ? 'annually' : 'monthly'}`"/>
                    </template>
                </v-text-field>
            </v-card-actions>

            <collapsable 
                title="Expenditures Change" 
                :text=expenditures_change_text 
                color="primary" 
                icon="mdi-currency-usd" 
            />        
        </v-card>
    </div>
</template>
<script setup>
    import useDefaultStore from "@/stores"

    const store = useDefaultStore();
    
    const annually = ref(false);
    const focused = ref(false);

    const minimum_monthly_expenses = computed(
    {    
        get: function()         
        { 
            const value = annually.value ? store.minimum_monthly_expenses * 12.0 : store.minimum_monthly_expenses; 
            return focused.value ? value : Intl.NumberFormat(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        },
        set: function(newValue) 
        {
            store.minimum_monthly_expenses = Math.max(0.0, annually.value ? newValue / 12.0 : newValue); 
        }
    });

    const expenditures_change_text = computed(() => 
    {
        return `${annually.value ? 'Yearly' : 'Monthly'} expenditures are subject to change depending on one's current life situation, such as the purchase of property, having dependents, and other factors. Moreover, it is generally observed that expenses tend to decrease with age. For the purpose of calculation, we will consider this as your average ${annually.value ? 'yearly' : 'monthly'} expenses.`;
    });
</script>