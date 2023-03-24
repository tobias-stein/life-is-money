import { defineStore } from "pinia";
import { 
    ISimulationInput,
    ISimulationResults
} from "@/src/util";


export default defineStore("defualt", 
{
    state: () => (
    {
        // expenses
        minimum_monthly_expenses: 1000.0,

        // age
        current_age: 29,
        expected_age: 92,

        // savings & investments
        // initial (note: founds are treated as normal cash in bank accounts, incl. savings instantly accessible)
        initial_founds: 0.0,
        initial_invest: 0.0,
        
        monthly_saving_rate: 0.0,
        saving_risk_ratio: 0.0,

        // taxes
        income_tax: 0.0,
        invest_tax: 0.0,

        anual_average_invest_return: 0.07,
        anual_average_inflation_rate: 0.02,

        inflation_adjusted_hour_rate: false,

        simulation: 
        {
            workers: new Array<Worker>(),
            cancel: new Array<(reason?: any) => void>(),
            is_running: false,
            progress: [0]
        }
        
    }),

    getters: 
    {
        min_anual_expenses: (state) => { return state.minimum_monthly_expenses * 12.0; },
        founding_period: (state) => { return state.expected_age - state.current_age; },
        anual_saving_rate: (state) => { return state.monthly_saving_rate * 12.0; },
        is_busy: (state) => { return state.simulation.is_running; },
        simulation_progress: (state) => { return (state.simulation.progress.reduce((acc, x) => acc += x ? x : 0, 0) / state.simulation.progress.length) * 100; }
    },

    actions: 
    {
        async show_notification(message: string): Promise<void> { /** dummy action that will be listened to from the index page. */ },

        async cancel_simulation() : Promise<void>
        {
            for(const cancel of this.simulation.cancel) { cancel("User cancelled simulation."); }
        },

        async simulate() : Promise<{[label: string]: ISimulationResults }>
        {
            // make sure all previous wrokers are done
            while(this.simulation.workers.length) { const worker = this.simulation.workers.pop(); worker?.terminate(); }

            this.simulation.is_running = true;
            this.simulation.progress = [0.0];

            const createSimulationData = (
                inflation_rate_multiplier: number       = 1.0,
                investment_return_multiplier: number    = 1.0
            ) : ISimulationInput =>
            {   
                return {
                    expected_min_anual_expenses:    this.min_anual_expenses,
                    founding_period_years:          this.founding_period,
                    anual_saving_rate:              this.anual_saving_rate,
                    saving_risk_ratio:              this.saving_risk_ratio,
                    income_tax:                     this.income_tax,
                    invest_tax:                     this.invest_tax,
                    avg_anual_inflation_rate:       this.anual_average_inflation_rate * inflation_rate_multiplier, 
                    avg_anual_invest_return:        this.anual_average_invest_return * investment_return_multiplier,
                    adj_hr_by_inflation:            this.inflation_adjusted_hour_rate,
                    initial_founds:                 this.initial_founds,
                    initial_invest:                 this.initial_invest
                } as ISimulationInput;
            }

            const sim_results = await Promise.all([
                {label: 'user', input: createSimulationData(1.0, 1.0), worker: new Worker('worker/simulation.js') },
                {label: 'best', input: createSimulationData(0.5, 2.0), worker: new Worker('worker/simulation.js') },
                {label: 'worst', input: createSimulationData(2.0, 0.5), worker: new Worker('worker/simulation.js') },
            ]
            // convert into promisses
            .map(({ label, input, worker }, index) => 
            {
                this.simulation.workers.push(worker);

                return new Promise((resolve, reject) =>
                {
                    this.simulation.cancel[index] = reject;

                    worker.onmessage = (event: MessageEvent) => 
                    {
                        if(typeof(event.data) === 'object')
                        {
                            resolve({ label: label, output: event.data });
                        }
                        else 
                        {
                            this.simulation.progress[index] = event.data as number;
                        }
                    };

                    // start simulation
                    worker.postMessage(input);
                });

            }))
            //@ts-ignore
            .then(results => Object.fromEntries(results.map(({ label, output }) => [label, output])))
            // cleanup all workers
            .finally(() => 
            {
                while(this.simulation.workers.length) { const worker = this.simulation.workers.pop(); worker?.terminate(); }
                this.simulation.is_running = false;
            });

            return sim_results;
        },

        share() : string
        {
            const share_state = JSON.parse(JSON.stringify(this.$state))
            delete share_state.simulation;

            return btoa(JSON.stringify(share_state));
        },

        load(code: string) : void 
        {
            try 
            {
                const decodedState = JSON.parse(atob(code));
                this.$patch(decodedState);
            }
            catch(err)
            {
                throw createError({ statusCode: 400, statusMessage: `Failed to decode shared code! ${err}`, fatal: true });
            }
        }
    }
});