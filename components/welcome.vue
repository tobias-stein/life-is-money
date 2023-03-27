<template>
    <div class="d-flex justify-center align-center">
        <v-card flat max-width="640px" class="text-justify">
            <div class="text-h6 ma-4">Have you ever asked yourself:</div>
            <v-carousel cycle interval="6000" hide-delimiter-background hide-delimiters :show-arrows="false" height="48px">
                <v-carousel-item v-for="(question, i) in questions" :key="i">
                    <p class="text-secondary text-subtitle-2 mx-4" style="overflow-wrap: break-word; hyphens: auto; white-space: initial;">{{ question }}</p>
                </v-carousel-item>
            </v-carousel>
            <v-card-text>
                By following this <strong>6-step</strong> guide you might be able to find your answers.
            </v-card-text>

            <v-expansion-panels v-model="open" multiple>
                <v-expansion-panel value="goal">
                    <v-expansion-panel-title hide-actions>
                        <v-row>
                            <v-col cols="12" class=" text-primary text-h6"><v-icon class="mr-4">mdi-flag-checkered</v-icon>The Goal</v-col>
                            <v-col v-if="!is_open('goal')" class="d-inline-block text-truncate text-caption text-weight-thin" style="max-width: calc(min(640px, 100vw) - 24px);">{{ goal_text }}</v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <span v-html="goal_text"></span>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="simu">
                    <v-expansion-panel-title hide-actions>
                        <v-row>
                            <v-col cols="12" class=" text-secondary text-h6"><v-icon class="mr-4">mdi-test-tube</v-icon>How does it work?</v-col>
                            <v-col v-if="!is_open('simu')" class="d-inline-block text-truncate text-caption text-weight-thin" style="max-width: calc(min(640px, 100vw) - 24px);">{{ simu_text }}</v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <span v-html="simu_text"></span>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="data">
                    <v-expansion-panel-title hide-actions>
                        <v-row>
                            <v-col cols="12" class=" text-success text-h6"><v-icon class="mr-4">mdi-cctv-off</v-icon>Your data never leaves your device</v-col>
                            <v-col v-if="!is_open('data')" class="d-inline-block text-truncate text-caption text-weight-thin" style="max-width: calc(min(640px, 100vw) - 24px);">{{ data_text }}</v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <span v-html="data_text"></span>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel value="disc">
                    <v-expansion-panel-title hide-actions>
                        <v-row>
                            <v-col cols="12" class=" text-warning text-h6"><v-icon class="mr-4">mdi-alert-outline</v-icon>Disclaimer</v-col>
                            <v-col v-if="!is_open('disc')" class="d-inline-block text-truncate text-caption text-weight-thin" style="max-width: calc(min(640px, 100vw) - 24px);">{{ disc_text }}</v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <span v-html="disc_text"></span>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
            <!-- <v-card-text>
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
                <v-alert variant="tonal" color="success" icon="mdi-cctv-off" title="Your data never leaves your device">
                    This website has no backend and all data provided by you stays on your local device. No coockies, no data collection, no nothing. 
                    In fact you can see for yourself and find this websites code right <a href="https://github.com/tobias-stein/life-is-money.git" target="_blank">here</a>.
                </v-alert>
            </v-card-text>

            <v-card-text>
                <v-alert variant="tonal" color="warning" icon="mdi-alert-outline" title="Disclaimer">
                    I would like to emphasize that the results provided through this website are based on simple equations that may not accurately reflect real-world economic conditions. Furthermore, the far future is highly unpredictable, and factors such as capital returns and inflation rates are subject to significant volatility.
                    Therefore, I strongly advise you to exercise caution and use these results at your own risk when planning future saving and investment strategies. While this website provides useful insights, I encourage you to consider a range of factors when making financial decisions.
                </v-alert>
            </v-card-text> -->
        </v-card>
    </div>
</template>
<script setup>

    const goal_text = "The primary objective of this website is to provide you with a brief overview of the minimum hourly rate necessary to sustain your monthly expenditures for a given period of years, while also demonstrating the timeframes involved in achieving financial independence by earning above the minimum hourly rate.";
    const simu_text = "To determine the minimum hourly rate required and potential early financial independence, input variables such as monthly expenditures, savings, inflation rate, and taxes must be provided. Simulations with increasing hourly rates will be conducted to show their impact on the point of financial independence. Confidence intervals for favorable and unfavorable outcomes will also be generated.  It is assumed that for all simulations, upon reaching financial independence, no further income will be earned and no additional savings or investments will be made, resulting in the gradual depletion of current accumulated funds, leaving zero remaining funds at the conclusion of the total funding period.";
    const data_text = `This website has no backend and all data provided by you stays on your local device. No coockies, no data collection, no nothing. In fact you can see for yourself and find this websites code right <a href="https://github.com/tobias-stein/life-is-money.git" target="_blank">here</a>.`;
    const disc_text = "I would like to emphasize that the results provided through this website are based on simple equations that may not accurately reflect real-world economic conditions. Furthermore, the far future is highly unpredictable, and factors such as capital returns and inflation rates are subject to significant volatility. Therefore, I strongly advise you to exercise caution and use these results at your own risk when planning future saving and investment strategies. While this website provides useful insights, I encourage you to consider a range of factors when making financial decisions.";

    const open = ref([ "disc" ]);
    function is_open(label) { return open.value.find(x => x === label) !== undefined; }

    const questions = ref([
        "How much money do I need to live my life?",
        "How much money do I need to retire early?",
        "How long do I have to work?",
        "What is the minimum required hour rate to reach my financial independence in X years?",
        "Is an hourly rate of Y enough to support my monthly expenses for Z years?",
        "What hourly rate do I need to earn to pay off my debt within my desired timeframe?"
    ]);
</script>