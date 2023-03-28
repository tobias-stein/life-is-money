<template>
	<!-- loading/progress indicator -->
	<v-container v-if="store.is_busy" class="no-print">
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
	<template v-else>
		<a href="https://tsprojectsblog.wordpress.com/2023/03/28/life-is-money/#how-to-read-the-charts" target="_blank" class="no-print mx-4">How to read the chart?</a>

		<v-row  :key="updateChart" :class="`print-full-width`">
			<v-col :cols="(display.width.value > display.height.value) ? 6 : 12" class="print-pagebreak" :style="`height: ${chartColumnHeight};`">
				<!-- budget -->
				<apexchart :options="fundChartOptions" :series="funds" width="100%" ref="fundChart" />
				<!-- year-hour-rate -->
				<apexchart :options="hrateChartOptions" :series="series" width="100%" ref="hrateChart" style="transform: translateY(-100%);" />
			</v-col>
			<v-col>
				<div v-if="!store.is_printing" class="d-flex justify-center align-center">
					<v-card flat max-width="640px" class="no-print">
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
				<div class="when-print">
					<chartsummary :sim_data="sim_data" class="print-pagebreak" />
					<chartinfo />
				</div>
			</v-col>
		</v-row>
	</template>
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
	const fundChart = ref();
	const updateChart = ref(0);
	const display = useDisplay();
	const sim_data = ref({} as TSimData);

	const theme = useTheme();
	watch(theme.global.name, () => 
	{
		hrateChartOptions.chart.foreColor = theme.global.current.value.colors["on-background"];
		updateChart.value++;
	});

	let funds: any[] = [];
	let series: any[] = [];
	let this_chart_cursor_pos = { x: 0, y: 0 };
	let last_chart_cursor_pos = { x: 0, y: 0 };
	
	let updatefundsChart: number | undefined = undefined;

	const fundChartOptions = 
	{
		chart:
		{
			type: 'rangeArea',
			background: 'transparent',
			foreColor: theme.global.current.value.colors["on-background"],
			animations:
			{
				enabled: true,
				speed: 500
			},
			toolbar: { show: false }
		},
		theme: { mode: theme.global.current.value.dark ? 'light' : 'dark' },
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
			max: store.funding_period,
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
			foreColor: theme.global.current.value.colors["on-background"],
			animations:
			{
				enabled: true,
				speed: 500
			},
			zoom:
			{
				enabled: false,
				type: 'xy',
				autoScaleYaxis: true,
			},
			toolbar:
			{
				show: false,
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
		theme: { mode: theme.global.current.value.dark ? 'light' : 'dark' },
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
		annotations: {
			position: 'back'
		},
		xaxis:
		{
			type: 'numeric',
			min: 0,
			max: store.funding_period,
			labels: 
			{
				minHeight: 40,
				maxHeight: 40,
				formatter: (x_value: number) => 
				{ 
					this_chart_cursor_pos.x = x_value; // !attention: this line is important as we fetch the current y-axis values here, that is used to update the 'foudns' chart
					return x_value === 0 ? 'Today' : x_value.toFixed(0); 
				}
			},
			tooltip: 
			{
				offsetY: 5 
			}
		},
		yaxis: 
		{
			min: 0.0,
			max: 100.0,
			crosshairs: { show: true },
			tooltip: 
			{ 
				enabled: false,
				offsetX: -60
			},
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
			marker: { show: false },
			intersect: false,
			fixed: 
			{
				enabled: true,
				position: 'topLeft',
				offsetX: 90,
				offsetY: 10
			},
			custom: function({ series, seriesIndex, dataPointIndex, w})
			{
				const year = dataPointIndex;
				const rate_user = w.config.series[0].data[dataPointIndex].y;

				// update FI marker
				hrateChart.value.clearAnnotations();
				hrateChart.value.addXaxisAnnotation({
					x: year,
					label: {
						text: 'Financial Independence',
						position: 'bottom',
						offsetX: 19,
						offsetY: -4,
						style: {
							color: theme.global.current.value.colors.primary,
							background: theme.global.current.value.colors["background"],
							fontSize: '12px',
						}
					},
				});

				clearTimeout(updatefundsChart);
				updatefundsChart = setTimeout(() => 
				{
					if(this_chart_cursor_pos.x !== last_chart_cursor_pos.x)
					{
						last_chart_cursor_pos.x = this_chart_cursor_pos.x;
						updatefundChart(year);
					}
				}, 200);
				

				const summary = 
					`<div style="position: relative; overflow: visible; color: ${theme.global.current.value.colors["on-background"]}; background: ${theme.global.current.value.colors["background"]};">`
						+ '<div class="summary_tooltip">'
							+ `<p>Financial independence possible in <strong>${year} years</strong><br>with <strong style="color: ${theme.current.value.colors.primary};">${compactNumber(rate_user)}</strong>hr / <strong style="color: ${theme.current.value.colors.primary};">${compactNumber(rate_user * 8 * 20)}</strong>mo / <strong style="color: ${theme.current.value.colors.primary};">${compactNumber(rate_user * 8 * 20 * 12)}</strong>yr</p>`
						+ '<div>';
					+ '<div>';

				return summary;
			},
			x: 
			{ 
				formatter: function(x_value: number) { return `in ${x_value} years`; },

			}
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
		},
		markers: { shape: 'square' }
	};

	function updatefundChart(year: number)
	{
		const rate_user = hrateChart.value.chart.w.config.series[0].data[year].y;
		const [rate_lower, rate_upper] = hrateChart.value.chart.w.config.series[1].data[year].y;

		const rate_funds 		= sim_data.value.user.funds.get(rate_user);
		const rate_funds_upper = sim_data.value.best.funds.get(rate_lower);
		const rate_funds_lower = sim_data.value.worst.funds.get(rate_upper);
		
		if(rate_funds !== undefined && rate_funds_lower !== undefined && rate_funds_upper !== undefined)
		{
			fundChart.value.chart.updateOptions(
			{
				series: 
				[
					{ name: 'funds', type: 'line', data: [...rate_funds.keys()].map(y => { return { x: y, y: rate_funds.get(y) }; }) },
					{ 
						name: 'funds Confidence', 
						type: 'rangeArea', 
						data: [...rate_funds.keys()]
							.map(y => 
							{ 
								return { 
									x: y, 
									y: [
										Math.min(rate_funds_lower.get(y)!, rate_funds_upper.get(y)!, rate_funds.get(y)!),
										Math.max(rate_funds_lower.get(y)!, rate_funds_upper.get(y)!, rate_funds.get(y)!),
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

		fundChartOptions.yaxis.max = Math.max(data.user.total_funds_max, data.worst.total_funds_max, data.best.total_funds_max);
		hrateChartOptions.yaxis.max = quantile([...data['user'].fi_values.values()], 0.9);
		hrateChartOptions.xaxis.max = store.funding_period;

		// hrateChartOptions.chart.toolbar.tools.customIcons = [
		// {
		// 	icon: '<i class="mdi-fit-to-screen mdi v-icon notranslate v-theme--light v-icon--size-x-small" aria-hidden="true" style="transform: translateY(-2px);" />',
		// 	index: 1,
		// 	title: 'Reset zoom',
		// 	click: () => 
		// 	{ 
		// 		setTimeout(() => updatefundChart(Math.ceil(quantile([...data['user'].fi_values.keys()], 0.2))));
		// 		updateChart.value++; 
		// 	}
		// }];

		chartColumnHeight.value = `${Math.ceil(hrateChart.value.chart.w.globals.svgHeight)}px`;

		setTimeout(() => 
		{
			const year = Math.ceil(quantile([...data['user'].fi_values.keys()], 0.2));
			
			// update FI marker
			hrateChart.value.clearAnnotations();
			hrateChart.value.addXaxisAnnotation({
				x: Math.ceil(year),
				label: {
					text: 'Financial Independence',
					position: 'bottom',
					offsetX: 19,
					offsetY: -4,
					style: {
						color: theme.global.current.value.colors.primary,
						background: theme.global.current.value.colors["background"],
						fontSize: '12px',
					}
				},
			});
			updatefundChart(year);
		});

		// force redrawing of chart
		updateChart.value++;
	}
</script>
<style>
.summary_tooltip {

	width: 290px;

	margin: 0px; 
	padding-left: 4px; 
	padding-right: 4px; 

	overflow-wrap: break-word;
	hyphens: auto; 
	white-space: initial;
	text-align: left;
}

.when-print {
	display: none;
}

@media print {

    .no-print { 
		display: none; 
	}

	.when-print {
		display: block;
	}

	.print-pagebreak { 
        page-break-after: always;
	}

	.print-full-width {
		flex-direction: column;
	}
}
</style>