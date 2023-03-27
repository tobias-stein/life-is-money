<template>
    <div class="d-flex justify-center align-center">
        <v-card flat max-width="640px" class="text-justify">
            <div class="text-h6 ma-4">Have you ever asked yourself:</div>
            <v-carousel cycle interval="4000" hide-delimiter-background hide-delimiters :show-arrows="false" height="48px">
                <v-carousel-item v-for="(question, i) in questions" :key="i">
                    <p class="text-secondary text-subtitle-2 mx-4" style="overflow-wrap: break-word; hyphens: auto; white-space: initial;">{{ question }}</p>
                </v-carousel-item>
            </v-carousel>
            <v-card-text>
                By following this <strong>6-step</strong> guide you might be able to find your answers.
            </v-card-text>
            <v-card-text>
                <v-alert variant="tonal" color="success" icon="mdi-cctv-off" title="Your data never leaves your device">
                    This website has no backend and all data provided by you stays on your local device. No coockies, no data collection, no nothing. 
                    In fact you can see for yourself and find this websites code right <a href="https://github.com/tobias-stein/life-is-money.git">here</a>.
                </v-alert>
            </v-card-text>

            <v-card-text>
                <v-alert variant="tonal" color="primary" icon="mdi-flag-checkered" title="The Goal">
                    The primary objective of this website is to provide you with a brief overview of the minimum hourly rate necessary to sustain your monthly expenditures for a given period of years, while also demonstrating the timeframes involved in achieving financial independence by earning above the minimum hourly rate. 
                </v-alert>
            </v-card-text>
            <v-card-text>
                <v-alert variant="tonal" color="secondary" icon="mdi-test-tube" title="How does it work?">
                    To determine the minimum hourly rate required and potential early financial independence, input variables such as monthly expenditures, savings, inflation rate, and taxes must be provided. Simulations with increasing hourly rates will be conducted to show their impact on the point of financial independence. Confidence intervals for favorable and unfavorable outcomes will also be generated.  It is assumed that for all simulations, upon reaching financial independence, no further income will be earned and no additional savings or investments will be made, resulting in the gradual depletion of current accumulated funds, leaving zero remaining funds at the conclusion of the total funding period.
                </v-alert>
            </v-card-text>
            
            <v-card-text>
                <v-alert variant="tonal" color="warning" icon="mdi-alert-outline" title="Disclaimer">
                    I would like to emphasize that the results provided through this website are based on simple equations that may not accurately reflect real-world economic conditions. Furthermore, the far future is highly unpredictable, and factors such as capital returns and inflation rates are subject to significant volatility.
                    Therefore, I strongly advise you to exercise caution and use these results at your own risk when planning future saving and investment strategies. While this website provides useful insights, I encourage you to consider a range of factors when making financial decisions.
                </v-alert>
            </v-card-text>
        </v-card>
    </div>
</template>
<script setup>
    const questions = ref([
        "How much money do I need to live my life?",
        "How much money do I need to retire early?",
        "How long do I have to work?",
        "What is the minimum required hour rate to reach my financial independence in X years?",
        "Is an hourly rate of Y enough to support my monthly expenses for Z years?",
        "What hourly rate do I need to earn to pay off my debt within my desired timeframe?"
    ])
</script>