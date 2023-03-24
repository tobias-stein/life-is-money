<template>
	<!-- loading/progress indicator -->
	<v-container v-if="store.is_busy">
		<v-row class="fill-height" align-content="center" justify="center">
			<v-col class="text-subtitle-1 text-center" cols="12">
				Preparing data ...
			</v-col>
			<v-col cols="6">
				<v-progress-linear color="primary" :model-value="store.simulation_progress.toFixed(2)" rounded height="6"></v-progress-linear>
			</v-col>
			<v-col class="text-center" cols="12">
				<v-btn variant="plain" @click="store.cancel_simulation">Cancel</v-btn>
			</v-col>
		</v-row>
	</v-container>

	<!-- chart & summary -->
	<v-row v-else :key="updateChart">
		<v-col :cols="chartColumnWidth">
			<apexchart :options="chartOptions" :series="series" width="100%" ref="chart" />
		</v-col>
		<v-col>
			<v-tabs v-model="openReportTab" color="primary" fixed-tabs grow>
				<v-tab value="summary">Summary</v-tab>
				<v-tab value="info">Chart Info</v-tab>
			</v-tabs>
			<v-window v-model="openReportTab">
        		<v-window-item value="summary">
					<chartsummary :sim_data="sim_data" />
				</v-window-item>
				<v-window-item value="info">
					<chartinfo />
				</v-window-item>
			</v-window>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	import useDefaultStore from "@/stores";
	import { quantile, ISimulationResults } from "@/src/util";
	import { useDisplay, useTheme } from "vuetify/lib/framework.mjs";

	const store = useDefaultStore();
	store.$onAction(({ name, after }) => { if(name === "simulate") { after(updateChartData); } });

	const openReportTab = ref(1);
	const chart = ref();
	const updateChart = ref(0);
	const display = useDisplay();
	const sim_data = ref({});

	const chartColumnWidth = computed(() => display.width.value > display.height.value ? 6 : 12);

	const theme = useTheme();

	const chartOptions =
	{
		chart:
		{
			type: 'rangeArea',
			background: theme.current.value.colors.background,
			animations:
			{
				enabled: true,
				speed: 500
			},
			zoom:
			{
				enabled: true,
				type: 'xy',
				autoScaleYaxis: true,
			},
			toolbar:
			{
				show: true,
				tools:
				{
					download: true,
					selection: true,
					zoom: true,
					zoomin: false,
					zoomout: false,
					pan: false,
					reset: false,
					customIcons: []
				}
			}
		},
		theme:
		{
			mode: theme.current.value.dark ? 'dark' : 'light',
		},
		colors: [
			theme.current.value.colors.primary,
			`${theme.current.value.colors.primary}20`,
			theme.current.value.colors.error,
			`${theme.current.value.colors.error}20`,
			theme.current.value.colors.secondary
		],
		dataLabels:
		{
			enabled: false
		},
		stroke:
		{
			curve: 'straight',
			width: 2
		},
		legend: { show: display.lgAndUp.value },
		xaxis:
		{
			type: 'numeric',
			min: 0,
			max: store.founding_period,
			// decimalsInFloat: 0
			labels: 
			{
				formatter: (x_value: number) =>
				{
					return x_value === 0 ? 'Today' : x_value.toFixed(0);
				}
			}
		},
		yaxis: 
		{
			min: 0.0,
			max: 100.0,
			crosshairs: { show: true },
			tooltip: { enabled: true },
			labels: { formatter: hr_rate => `${hr_rate.toFixed(1)} / hr` }
		},
		tooltip:
		{
			enabled: true,
			shared: true,
			intersect: false,
			fixed: 
			{
				enabled: true,
				position: 'topRight'
			},
			custom: function({ series, seriesIndex, dataPointIndex, w})
			{
				const year = dataPointIndex;
				switch(seriesIndex)
				{
					// FI
					case 0:
					case 1:
					case 2:
					case 3:
					{
						const rate = w.config.series[0].data[dataPointIndex].y;
						const low_rate = Math.ceil([...series[2]].reverse()[0]) + 1;

						const summary = '<div class="summary_tooltip">'
							+ `<p>Financial independence can be reached in <strong>${year} years</strong> with an hour rate of <strong style="color: ${theme.current.value.colors.primary};">${rate.toFixed(2)}</strong>.</p>`
							+ '<div>';

						return summary;
					}
				}
				
				return "";
			},
			x: { formatter: function(x_value: number) { return `in ${x_value} years`; } }
		}
	};

	let series: any[] = [];

	function updateChartData(data: { [scenario: string]: ISimulationResults })
	{
		sim_data.value = data;
		const toXY = (series: Map<number, number>) =>
		{
			const d = [];
			for(const key of series.keys()) { d.push({ x: key, y: series.get(key)}); }
			return d;
		}

		const toArea = (series1: Map<number, number>, series2: Map<number, number>) =>
		{
			const d = [];
			for(const key of series1.keys()) { d.push({ x: key, y: [series1.get(key), series2.get(key)]}); }
			return d;
		}

		// clear old chart values
		series = [];

		// series 1
		series.push({ name: 'Financial Independence (FI)', type: 'line', data: toXY(data['user'].fi_values) });
		// series 2
		series.push({ name: 'FI Confidence', type: 'rangeArea', data: toArea(data['best'].fi_values, data['worst'].fi_values) });
		// series 3
		series.push({ name: 'Insufficent Foudning (FI)', type: 'line', data: toXY(data['user'].fail_values) });
		// series 4
		series.push({ name: 'IF Confidence', type: 'rangeArea', data: toXY(data['worst'].fail_values).map(xy => { return { x: xy.x, y: [0.0, xy.y] }; }) });
		// series 5
		// series.push({ name: 'Founds', type: 'line', data: toXY(data['user'].fail_values) });


		chartOptions.yaxis.max = quantile([...data['user'].fi_values.values()], 0.9);
		chartOptions.xaxis.max = store.founding_period;
		chartOptions.chart.toolbar.tools.customIcons = [
		{
			icon: '<i class="mdi-fit-to-screen mdi v-icon notranslate v-theme--light v-icon--size-x-small" aria-hidden="true" style="transform: translateY(-2px);" />',
			index: 1,
			title: 'Reset zoom',
			click: () =>
			{
				// chartOptions.yaxis.max = data['user'].max_hour_rate;
				// force redrawing of chart
				updateChart.value++;
			}
		}];

		chartOptions.legend.show = display.lgAndUp.value;

		// force redrawing of chart
		updateChart.value++;
	}
</script>
<style>
.summary_tooltip {

	position: fixed;
	width: 265px;

	margin: 0px; 
	padding: 0px; 

	overflow-wrap: break-word;
	hyphens: auto; 
	white-space: initial;
	text-align: right;

	transform: translateX(-300px) translateY(33px);
}
</style>