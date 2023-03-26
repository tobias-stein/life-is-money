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
		<v-col :cols="chartColumnWidth" :style="`height: ${chartColumnHeight};`">
			<!-- budget -->
			<apexchart :options="foundChartOptions" :series="founds" width="100%" ref="foundChart" />
			<!-- year-hour-rate -->
			<apexchart :options="hrateChartOptions" :series="series" width="100%" ref="hrateChart" style="transform: translateY(-100%);" />
		</v-col>
		<v-col>
			<div class="d-flex justify-center align-center">
        		<v-card flat max-width="640px">
					<v-tabs v-model="openReportTab" color="primary" fixed-tabs grow density="compact">
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
				</v-card>
			</div>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">

	import useDefaultStore from "@/stores";

    import { ISimulationResults } from "@/src/simulation";
	import { quantile, compactNumber } from "@/src/util";
	import { useDisplay, useTheme } from "vuetify/lib/framework.mjs";


	type TSimData = {
		[scenario in 'user' | 'best' | 'worst']: ISimulationResults;
	};

	const store = useDefaultStore();
	store.$onAction(({ name, after }) => { if(name === "simulate") { after(updateChartData); } });

	const openReportTab = ref(1);
	const chartColumnHeight = ref('100%');

	const hrateChart = ref();
	const foundChart = ref();
	const updateChart = ref(0);
	const display = useDisplay();
	const sim_data = ref({} as TSimData);

	const chartColumnWidth = computed(() => display.width.value > display.height.value ? 6 : 12);

	const theme = useTheme();

	let founds: any[] = [];
	let series: any[] = [];
	let this_chart_cursor_pos = { x: 0, y: 0 };
	let last_chart_cursor_pos = { x: 0, y: 0 };
	
	let updateFoundsChart: number | undefined = undefined;

	const foundChartOptions = 
	{
		chart:
		{
			type: 'rangeArea',
			background: 'transparent',
			animations:
			{
				enabled: true,
				speed: 500
			},
			toolbar: { show: false }
		},
		theme: { mode: theme.current.value.dark ? 'dark' : 'light' },
		colors: [
			`${theme.current.value.colors.secondary}60`,
			`${theme.current.value.colors.secondary}20`,
		],
		dataLabels: { enabled: false },
		stroke:
		{
			curve: 'straight',
			width: 2
		},
		legend: { show: false },
		grid: { show: false },
		xaxis:
		{
			type: 'numeric',
			min: 0,
			max: store.founding_period,
			labels: 
			{ 
				minHeight: 40,
				maxHeight: 40,
				formatter: (x_value: number) => { return x_value === 0 ? 'Today' : x_value.toFixed(0); } 
			},
		},
		yaxis: 
		{
			min: 0.0,
			max: 100.0,
			tooltip: { enabled: false },
			labels: { show: false, minWidth: 80, maxWidth: 80 }
		},
		tooltip:
		{
			enabled: false,		
		},
		title: 
		{
			text: undefined,
			margin: 0
		},
		subtitle: 
		{
			text: undefined,
			margin: 0
		}
	};

	const hrateChartOptions =
	{
		chart:
		{
			type: 'rangeArea',
			background: 'transparent',
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
		theme: { mode: theme.current.value.dark ? 'dark' : 'light' },
		colors: [
			theme.current.value.colors.primary,
			`${theme.current.value.colors.primary}20`,
			theme.current.value.colors.error,
			`${theme.current.value.colors.error}20`,
			theme.current.value.colors.secondary
		],
		dataLabels: { enabled: false 	},
		stroke:
		{
			curve: 'straight',
			width: 2
		},
		legend: { show: false },
		xaxis:
		{
			type: 'numeric',
			min: 0,
			max: store.founding_period,
			labels: 
			{
				minHeight: 40,
				maxHeight: 40,
				formatter: (x_value: number) => 
				{ 
					this_chart_cursor_pos.x = x_value; // !attention: this line is important as we fetch the current y-axis values here, that is used to update the 'foudns' chart
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
			labels: 
			{ 
				minWidth: 80,
				maxWidth: 80,
				formatter: (y_value: number) => 
				{ 
					this_chart_cursor_pos.y = y_value; // !attention: this line is important as we fetch the current y-axis values here, that is used to update the 'foudns' chart
					return `${compactNumber(y_value)} / hr`; 
				}
			}
		},
		tooltip:
		{
			enabled: true,
			shared: true,
			intersect: false,
			fixed: 
			{
				enabled: true,
				position: 'topRight',
			},
			custom: function({ series, seriesIndex, dataPointIndex, w})
			{
				const year = dataPointIndex;
				const rate_user = w.config.series[0].data[dataPointIndex].y;
				const [rate_lower, rate_upper] = w.config.series[1].data[dataPointIndex].y;

				clearTimeout(updateFoundsChart);
				updateFoundsChart = setTimeout(() => 
				{
					if(this_chart_cursor_pos.x !== last_chart_cursor_pos.x)
					{
						last_chart_cursor_pos.x = this_chart_cursor_pos.x;
						updateFoundChart(year);
					}
				}, 200);
				

				const summary = 
					'<div style="position: relative; overflow: visible;">'
						+ '<div class="summary_tooltip">'
							+ `<p>Financial independence can be reached in <strong>${year} years</strong> with an hour rate of <strong style="color: ${theme.current.value.colors.primary};">${compactNumber(rate_user)}</strong>.</p>`
						+ '<div>';
					+ '<div>';

				return summary;
			},
			x: { formatter: function(x_value: number) { return `in ${x_value} years`; } }
		},
		title: 
		{
			text: undefined,
			margin: 0
		},
		subtitle: 
		{
			text: undefined,
			margin: 0
		}
	};

	function updateFoundChart(year: number)
	{
		const rate_user = hrateChart.value.chart.w.config.series[0].data[year].y;
		const [rate_lower, rate_upper] = hrateChart.value.chart.w.config.series[1].data[year].y;

		const rate_founds 		= sim_data.value.user.founds.get(rate_user);
		const rate_founds_upper = sim_data.value.best.founds.get(rate_lower);
		const rate_founds_lower = sim_data.value.worst.founds.get(rate_upper);
		
		if(rate_founds !== undefined && rate_founds_lower !== undefined && rate_founds_upper !== undefined)
		{
			foundChart.value.chart.updateOptions(
			{
				series: 
				[
					{ name: 'Founds', type: 'line', data: [...rate_founds.keys()].map(y => { return { x: y, y: rate_founds.get(y) }; }) },
					{ 
						name: 'Founds Confidence', 
						type: 'rangeArea', 
						data: [...rate_founds.keys()]
							.map(y => 
							{ 
								return { 
									x: y, 
									y: [
										Math.min(rate_founds_lower.get(y)!, rate_founds_upper.get(y)!, rate_founds.get(y)!),
										Math.max(rate_founds_lower.get(y)!, rate_founds_upper.get(y)!, rate_founds.get(y)!),
									]
								}; 
							}) 
					}
				],
				xaxis: { min: hrateChart.value.chart.w.globals.minX, max: hrateChart.value.chart.w.globals.maxX }
			});
		}
	}

	function updateChartData(data: TSimData)
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

		foundChartOptions.yaxis.max = Math.max(data.user.total_founds_max, data.worst.total_founds_max, data.best.total_founds_max);
		hrateChartOptions.yaxis.max = quantile([...data['user'].fi_values.values()], 0.9);
		hrateChartOptions.xaxis.max = store.founding_period;
		hrateChartOptions.chart.toolbar.tools.customIcons = [
		{
			icon: '<i class="mdi-fit-to-screen mdi v-icon notranslate v-theme--light v-icon--size-x-small" aria-hidden="true" style="transform: translateY(-2px);" />',
			index: 1,
			title: 'Reset zoom',
			click: () => 
			{ 
				setTimeout(() => updateFoundChart(Math.ceil(quantile([...data['user'].fi_values.keys()], 0.2))));
				updateChart.value++; 
			}
		}];

		chartColumnHeight.value = `${Math.ceil(hrateChart.value.chart.w.globals.svgHeight)}px`;

		setTimeout(() => updateFoundChart(Math.ceil(quantile([...data['user'].fi_values.keys()], 0.2))));

		// force redrawing of chart
		updateChart.value++;
	}
</script>
<style>
.summary_tooltip {

	width: 265px;

	margin: 0px; 
	padding: 0px; 

	overflow-wrap: break-word;
	hyphens: auto; 
	white-space: initial;
	text-align: right;
}
</style>