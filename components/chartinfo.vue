<template>
    <v-card class="ma-0 text-justify">
        <v-card-text class="ma-0 pa-2">
            <v-alert title="Funds" variant="tonal" density="compact" border="start" border-color="secondary" class="mb-2">
                The <strong class="text-secondary">funds</strong> <strong>line</strong> displays the growth of the total amount of funds over the years. To provide a comprehensive picture of the potential trajectory of funds under different economic conditions, a <strong class="text-secondary">confidence</strong> <strong>interval</strong> has been included. This interval illustrates the possible development of funds under favorable and unfavorable economic circumstances.
            </v-alert>
            <v-alert title="Financial Independence" variant="tonal" density="compact" border="start" border-color="primary" class="mb-2">
                <strong class="text-primary">Financial independence</strong> is the state of having sufficient funds to cover all required monthly expenses without exhausting one's financial resources before the end of the funding period. In other words, any hourly rate above the <strong class="text-primary">Financial independence</strong> <strong>line</strong> has the potential to bring about financial independence for the remaining years of the fouding period.
                It is important to note that this threshold is greatly influenced by economic volatility, and the <strong class="text-primary">confidence</strong> <strong>interval</strong> presented on the chart displays the potential range of hourly rates that may be required under conditions of both bad (upper bound) and good (lower bound) economics.
            </v-alert>
            <v-alert title="Insufficient funds" variant="tonal" density="compact" border="start" border-color="error" class="mb-2">
                The <strong class="text-error">Insufficient funds</strong> <strong>line</strong> displays the minimum hourly rate required to cover monthly expenses, with any rate below this threshold resulting in insufficient funds to cover for the whole funding period. A <strong class="text-error">confidence</strong> <strong>interval</strong> is also included to provide an estimation of potential insufficient rates in the event of unfavorable economic conditions.
            </v-alert>
            <v-alert title="Chart Interaction" variant="tonal" density="compact" border="start" class="mb-2">
                <p class="mb-2">You can hover your cursor over or click on any point on the chart. A tooltip will appear in the top-left corner, providing a brief summary. You will also see an updated <strong class="text-secondary">chart</strong> visualising the development of the total funds. The summary and <strong class="text-secondary">chart</strong> are corresponding to the current selected year on the horizontal axis.</p> 
                <!-- <p class="mb-2">To view more detailed information about the data represented in the chart, you can hover your cursor over or click on any point on the chart. A tooltip will appear in the top-right corner of the chart, providing a brief summary of the data point. You can also zoom in on a specific region of the chart by clicking and dragging your pointer to select that area.</p> -->
                <!-- <p class="mb-2">Additionally, there are small toolbar icons located in the top-right corner of the chart that allow you to reset (<v-icon x-small>mdi-fit-to-screen</v-icon>) the zoom level or download (<v-icon x-small>mdi-menu</v-icon>) the current chart as a file.</p> -->
            </v-alert>
        </v-card-text>
    </v-card>
</template>