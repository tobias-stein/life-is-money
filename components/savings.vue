<template>
   	<div class="d-flex justify-center align-center text-justify">
		<v-card flat max-width="640px">
			<v-card-title>
				<span>What are your current savings and investments?</span>
			</v-card-title>
			<v-card-text>
				Do you have already some savings and investments? We consider 'savings' any form of instantly accessible money, 
				such as money on your bank account or cash in your safe. Investments are any form of assets that need to be 
				'liquified' before becoming available for payments, e.g shares in stocks market.
			</v-card-text>
			<v-card-actions>
				<v-text-field v-model="initial_founds" type="number" label="Your current savings" variant="outlined" />
			</v-card-actions>
			<v-card-actions>
				<v-text-field v-model="initial_invest" type="number" label="Your current investments" variant="outlined" />
			</v-card-actions>
			
			<v-card-text>
				How much money per month can you put aside for savings and/or investments? Use the slider bellow to specify how 
				much risk you are willing take: 
				'No risk' means the money is kept in your bank account or private safe. 
				'All in!' means the money will be invested in some form of risk assets, such as stocks or ETFs. 
				Anything inbetween will put equivalent proption into savings and investments.
			</v-card-text>
			
			<v-card-actions>
				<v-text-field v-model="monthly_saving_rate" type="number" label="Your monthly saving rate" variant="outlined" />
			</v-card-actions>
			<v-card-actions>
				<v-slider v-model="store.saving_risk_ratio" min="0.0" max="1.0" step="0.01" color="primary">
					<template v-slot:prepend>
						<div class="text-center text-caption">
						<v-icon x-small>mdi-piggy-bank-outline</v-icon>
						<p>No Risk</p>
						</div>
					</template>
					<template v-slot:append>
					<div class="text-center text-caption">
						<v-icon x-small>mdi-bank-outline</v-icon>
						<p>Risk</p>
					</div>
					</template>
				</v-slider>
			</v-card-actions>
		</v-card>
   	</div>
</template>
<script setup>
import useDefaultStore from "@/stores"

const store = useDefaultStore();

const initial_founds = computed(
{
   get: function()         { return store.initial_founds; },
   set: function(newValue) { store.initial_founds = Math.max(0.0, newValue); }
});

const initial_invest = computed(
{
   get: function()         { return store.initial_invest; },
   set: function(newValue) { store.initial_invest = Math.max(0.0, newValue); }
});

const monthly_saving_rate = computed(
{
   get: function()         { return store.monthly_saving_rate; },
   set: function(newValue) { store.monthly_saving_rate = Math.max(0.0, newValue); }
});
</script>