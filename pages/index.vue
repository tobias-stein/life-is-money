<template>
    <v-app-bar>
            <v-app-bar-title>{{ step + 1 }}. {{ thisStepName }}</v-app-bar-title>
            <!--  -->
            <template v-slot:extension>
                <v-progress-linear :model-value="(step / (steps.length - 1)) * 100" color="primary" height="6" />
            </template>
        <template v-slot:append><share /></template>
    </v-app-bar>
    <v-card flat>

        <!-- notifications -->
        <v-snackbar 
            v-model="nofification.show" 
            :timeout="2000" 
            color="primary" 
            variant="tonal" 
            location="bottom" 
            
            style="transform: translateY(-52px);">
                <strong class="d-flex justify-center">{{ nofification.message }}</strong>
        </v-snackbar>

        <v-window v-model="step">


            <template v-for="(step, index) in steps">
                <v-window-item :value="index">
                    <component :is="step.comp"></component>
                </v-window-item>
            </template>
        </v-window>
    </v-card>
    <v-footer app>

        <v-btn v-if="step > 1" :disabled="store.is_busy" variant="text" @click="step--">
            <v-icon>mdi-chevron-left</v-icon>
            {{ prevStepLabel }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn v-if="step < steps.length - 1" :disabled="store.is_busy" color="primary" variant="text" @click="step++">
            {{ nextStepLabel }}
            <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn v-else variant="flat" :disabled="store.is_busy" @click="step=1">
            Start a new simulation.
        </v-btn>
    </v-footer>
</template>
<script setup lang="ts">
    import useDefaultStore from "@/stores"

    const store = useDefaultStore();
    const route = useRoute();
    const { query: { shared = false } } = route;

    const nofification = ref({ show: false, message: "" });
	store.$onAction(({ name, args }) => { if(name === "show_notification") {  nofification.value.message = args[0]; nofification.value.show = true; } });

    const steps = [
        {
            name: "Welcome",
            desc: "",
            comp: resolveComponent('welcome'),
            onEnter: async () => { },
            onExit: async () => { },
        },
        {
            name: "Expenses",
            desc: "",
            comp: resolveComponent('expenses'),
            onEnter: async () => { },
            onExit: async () => { },
        },
        {
            name: "Age",
            desc: "",
            comp: resolveComponent('age'),
            onEnter: async () => { },
            onExit: async () => { },
        },
        {
            name: "Savings & Investments",
            desc: "",
            comp: resolveComponent('savings'),
            onEnter: async () => { },
            onExit: async () => { },
        },
        {
            name: "Taxes & Returns",
            desc: "",
            comp: resolveComponent('taxes'),
            onEnter: async () => { },
            onExit: async () => { },
        },
        {
            name: "Inflation",
            desc: "",
            comp: resolveComponent('inflation'),
            onEnter: async () => { },
            onExit: async () => { },
        },
        {
            name: "Life vs. Money",
            desc: "",
            comp: resolveComponent('life'),
            onEnter: async () => {  await doSimulation(); },
            onExit: async () => { },
        }
    ];

    async function doSimulation() : Promise<void>
    {
        await store.simulate()
            // can error, when use cancels current simulation.
            .catch(err => 
            { 
                store.show_notification("Simulation canceled.");
                step.value = 1; 
            });
    }

    const step = ref(0);

    
    const thisStepName  = computed(() => steps[step.value].name);
    const thisStepDesc  = computed(() => steps[step.value].desc || steps[step.value].name );

    const prevStepLabel = computed(() => steps[step.value - 1].name);
    const nextStepLabel = computed(() => steps[step.value + 1].name);

    // watch step changes
    watch(step, async (newStep, lastStep) => 
    {
        if(steps[lastStep].onExit !== undefined) { await steps[lastStep].onExit!(); }
        if(steps[newStep].onEnter !== undefined) { await steps[newStep].onEnter!(); }
    });

    onMounted(async () => 
    {
        if(shared)
        {
            // remove '?shared=true' query from url
            window.history.replaceState({}, "Life is Money", window.location.origin);

            // go to final window
            step.value = steps.length - 1;

            // initialize simulation
            await doSimulation();
        }
    });

</script>
<style>
.v-toolbar__extension {
  height: 6px !important;
}
</style>