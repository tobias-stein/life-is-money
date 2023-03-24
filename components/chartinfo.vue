<template>
    <v-card>
        <v-card-text>
            <v-alert title="Financial Independence" variant="tonal" border="start" border-color="primary" class="mb-2">
                <strong class="text-primary">Financial independence</strong> means having enough money to pay for all monthly required expenses without running out of money 
                before the end of the total founding period. This means any hour rate above the <strong class="text-primary">Financial independence</strong> <strong>line</strong> 
                for the next <strong>N</strong> years might bring your financial independence.
                <p class="my-4">
                    <strong>Example: </strong>Look at the charts horizontal axis. <strong>N</strong> will be the number of years from <strong>Today</strong>. All hour rates that lie above the 
                <strong class="text-primary">Financial independence</strong> <strong>line</strong> at that year potentially will bring your financial independence.
                </p>
                Of course volatile economics will greatly influence this threshold. The <strong class="text-primary">Confidence interval</strong> shows you the range for each year with bad economics (upper bound) 
                and good economics (lower bound).
            </v-alert>
            <v-alert title="Insufficient Founds" variant="tonal" border="start" border-color="error" class="mb-2">
                The <strong class="text-error">Insufficient Founds</strong> <strong>line</strong> indicates the threshold of an hour rate that does not support the required monthly expenses.
                In addition a <strong class="text-error">confidence interval</strong> is shown that outlines a range of insufficient rates in a scenario of bad economics.
            </v-alert>
            <v-alert title="Chart Interaction" variant="tonal" border="start" class="mb-2">
                <p class="mb-2">Move your cursor across or click on the chart to reveal a tooltip in the top-right corner. The tooltip will present you a brief summary of the current hovered or clicked chart position.</p>
                <p class="mb-2">You can zoom into a specific region of the chart by clicking and dragging your pointer to mark that region.</p>
                <p class="mb-2">Use the small toolbar icons in the top-right corner of the chart to reset the zoom (<v-icon x-small>mdi-fit-to-screen</v-icon>) or download (<v-icon x-small>mdi-menu</v-icon>) the current chart as a file.</p>
            </v-alert>
        </v-card-text>
    </v-card>
</template>
