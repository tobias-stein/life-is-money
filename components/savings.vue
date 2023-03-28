<template>
   	<div class="d-flex justify-center align-center text-justify">
		<v-card flat max-width="640px">
			<div class="text-h6 ma-4">
				<span>What are your current savings and investments?</span>
			</div>
			<v-card-text>
				Savings generally refers to money that you set aside for future use, typically in a low-risk account like a savings account. The purpose of saving is to have a pool of funds that can be accessed quickly in case of an emergency or unexpected expense. Savings usually earn interest, but the rates tend to be lower than those of investments because they are considered to be lower risk.
			</v-card-text>
			<v-card-actions>
				<v-text-field v-model="initial_funds" label="Your current savings" variant="outlined" hide-details :type="focused_funds ? 'number' : 'text'" @update:focused="(value) => focused_funds=value" />
			</v-card-actions>

			<v-card-text>
				Investments involve using your money to generate a return that is higher than the rate of inflation. Investments can include a wide range of assets, such as stocks, bonds, real estate, mutual funds, and more. Investments come with a higher level of risk than savings because their value can fluctuate significantly over time, but they also have the potential to earn a higher rate of return.
			</v-card-text>
			<v-card-actions>
				<v-text-field v-model="initial_invest" label="Your current investments" variant="outlined" hide-details :type="focused_invest ? 'number' : 'text'" @update:focused="(value) => focused_invest=value" />
			</v-card-actions>

			<v-switch v-model="store.use_monthly_saving_plan" class="mx-2" color="primary" inset hide-details :label="`${store.use_monthly_saving_plan ? 'Use monthly saving strategy' : 'No saving strategy'}`" @update:model-value="onToggleSavingStrategy"/>
			<template v-if="store.use_monthly_saving_plan">
				<v-card-text>
					Overall, the key difference between savings and investments is that savings are generally low-risk and low-return, while investments are higher-risk and higher-return. Both are important components of personal finance, and many people use a combination of savings and investments to achieve their financial goals.
				</v-card-text>
				<v-card-actions>
					<v-slider v-model="store.saving_risk_ratio" min="0.0" max="1.0" step="0.01" color="primary" hide-details>
						<template v-slot:prepend>
							<div class="text-center text-caption">
							<v-icon x-small>mdi-piggy-bank-outline</v-icon>
							<p>Low Risk</p>
							</div>
						</template>
						<template v-slot:append>
						<div class="text-center text-caption">
							<v-icon x-small>mdi-bank-outline</v-icon>
							<p>High Risk</p>
						</div>
						</template>
					</v-slider>
				</v-card-actions>
				<v-card-actions>
					<v-text-field v-model="monthly_saving_rate" label="Your monthly saving rate" variant="outlined" :type="focused_saving ? 'number' : 'text'" @update:focused="(value) => focused_saving=value" />
				</v-card-actions>
			</template>
			<collapsable v-else
				title="No Saving Strategy?" 
				text="You should consider a monthly saving strategy in order to reach your total required funds before the end of the funding period." 
				color="warning"
			/>

			<collapsable 
                title="Savings" 
                text="Note that the specified monthly saving amount will be taken into account when calculating the final results." 
            />
		</v-card>
   	</div>
</template>
<script setup>
	import useDefaultStore from "@/stores"

	const store = useDefaultStore();
    const focused_funds = ref(false);
    const focused_invest = ref(false);
    const focused_saving = ref(false);

	const initial_funds = computed(
	{
		get: function()         
		{ 
			return focused_funds.value ? store.initial_funds : Intl.NumberFormat(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(store.initial_funds); 
		},
		set: function(newValue) { store.initial_funds = Math.max(0.0, newValue); }
	});

	const initial_invest = computed(
	{
		get: function()         { return focused_invest.value ? store.initial_invest : Intl.NumberFormat(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(store.initial_invest); },
		set: function(newValue) { store.initial_invest = Math.max(0.0, newValue); }
	});

	const monthly_saving_rate = computed(
	{
		get: function()         { return focused_saving.value ? store.monthly_saving_rate : Intl.NumberFormat(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(store.monthly_saving_rate); },
		set: function(newValue) { store.monthly_saving_rate = Math.max(0.0, newValue); }
	});

	function onToggleSavingStrategy() 
	{
		if(store.use_monthly_saving_plan) 
		{ 
			nextTick(() => window.scrollTo(0, document.body.scrollHeight)); 
		}
	}
</script>