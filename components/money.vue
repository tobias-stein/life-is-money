<template>
    <div class="d-flex justify-center align-center">
        <v-card flat max-width="640px">
            <v-card-title>
                <span>What is the amount of your monthly expenses?</span>
            </v-card-title>
            <v-card-text>
                These are your minimum monthly living expenses. For instance: phone bills, rent, insurances...
            </v-card-text>
            <v-card-actions>
                <v-text-field v-model="minimum_monthly_expenses" type="number" label="Monthly Expenses" variant="outlined" />
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>
</script>