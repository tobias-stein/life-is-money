function pay_taxes(brutto_amount, tax_rate) {
    const taxes = Math.max(0.0, brutto_amount) * tax_rate;
    const netto_amount = brutto_amount - taxes;
    return netto_amount;
}
function calculate_invest_retruns(invest_amount, return_rate) { return Math.max(0.0, invest_amount) * return_rate; }
function forecast_inflation_rate(avg_anual_inflation_rate, num_years) { return Math.pow(1.0 + avg_anual_inflation_rate, num_years); }
function clone(input) { return JSON.parse(JSON.stringify(input)); }
const HR_TO_ANUAL = 8 /* business hours */ * 20 /* business days */ * 12 /* business month */; // 1920 business hours per year
function simulate_founding_period(input) {
    const sim_data = clone(input);
    let total_founds = sim_data.initial_founds;
    let total_invest = sim_data.initial_invest;
    let financial_independence = sim_data.financial_independent;
    let failed = undefined;
    let founds = new Map();
    for (let year = sim_data.start_founding_year; year < sim_data.founding_period_years; year++) {
        const inflation_year = forecast_inflation_rate(sim_data.avg_anual_inflation_rate, year);
        // earn active income by work           
        if (financial_independence === undefined) {
            const income_year = (sim_data.adj_hr_by_inflation ? sim_data.hour_rate * inflation_year : sim_data.hour_rate) * HR_TO_ANUAL;
            total_founds += pay_taxes(income_year, sim_data.income_tax);
        }
        // earn passive income by investments
        const invest_returns_year = calculate_invest_retruns(total_invest, sim_data.avg_anual_invest_return);
        total_founds += pay_taxes(invest_returns_year, sim_data.invest_tax);
        // do anual spending on expenses            
        const expenses_year = sim_data.expected_min_anual_expenses * inflation_year;
        if (expenses_year > total_founds) {
            // since we do not have any more liquid founds, we have to use our investments
            // note: investments have to be liquified and taxed
            // note: we also allow the total_invest value to become negative
            const diff = expenses_year - total_founds;
            const taxes = diff * sim_data.invest_tax;
            total_invest -= (diff + taxes);
            total_founds = 0.0;
        }
        else {
            total_founds -= expenses_year;
        }
        if (sim_data.anual_saving_rate > 0.0 && financial_independence === undefined) {
            // note: we only use the appropriate portion (relating to the risk ratio) of the intented saving rate value and put it into investments
            const invest_year = sim_data.anual_saving_rate * sim_data.saving_risk_ratio;
            if (total_founds >= invest_year) {
                total_invest += invest_year;
            }
            // note: even if there are no sufficient founds for the invest, we will still deduct the money
            total_founds -= invest_year;
        }
        if (total_founds + total_invest < 0.0 && failed === undefined) {
            failed = year;
        }
        if (financial_independence === undefined) {
            const sim_data_clone = clone(sim_data);
            sim_data_clone.start_founding_year = year;
            sim_data_clone.financial_independent = year;
            sim_data_clone.initial_founds = total_founds;
            sim_data_clone.initial_invest = total_invest;
            const { total_remaining_founds } = simulate_founding_period(sim_data_clone);
            if (total_remaining_founds >= 0.0) {
                financial_independence = year;
            }
        }
        founds.set(year, total_founds + total_invest);
    }
    // return the remaining founds and (taxed) investments after the simulated founding period
    // note: this value can be negative, indicating that the specified input values are not sustainable!
    return {
        founds: founds,
        total_remaining_founds: total_founds + pay_taxes(total_invest, sim_data.invest_tax),
        failed: failed,
        financial_independence: financial_independence
    };
}
function forward_fill(array) {
    let filled = new Array();
    let last_seen_value = undefined;
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== undefined) {
            last_seen_value = filled[i] = array[i];
        }
        // found undefined value in array
        else {
            if (last_seen_value !== undefined) {
                filled[i] = last_seen_value;
            }
        }
    }
    return filled;
}
function backward_fill(array) { return forward_fill(array.reverse()).reverse(); }
function forbackd_fill(array) { return backward_fill(forward_fill(array)); }
function run_simulation(input, initial_hour_rate = 0.0, hour_rate_increment = 1.0, onProgress) {
    let hour_rate = initial_hour_rate;
    const founds = new Map();
    const fi_values = new Array(input.founding_period_years);
    const fail_values = new Array(input.founding_period_years);
    const max_sim_time = 10 /* seconds */ * 1000;
    const sim_start = Date.now();
    let total_founds_max = 0;
    while (true) {
        const sim_data = clone(input);
        sim_data.hour_rate = hour_rate;
        sim_data.start_founding_year = 0;
        const output = simulate_founding_period(sim_data);
        founds.set(hour_rate, output.founds);
        total_founds_max = Math.max(total_founds_max, ...output.founds.values());
        if (onProgress) {
            onProgress((input.founding_period_years - (output.financial_independence || 0)) / input.founding_period_years);
        }
        // remember minimal hour rate to reach financial independence in X years
        if (output.financial_independence !== undefined && fi_values[output.financial_independence] === undefined) {
            fi_values[output.financial_independence] = hour_rate;
        }
        // remember maximum hour rate to fail founding period
        if (output.failed !== undefined) {
            fail_values[output.failed] = hour_rate;
        }
        // stop simulation, if we found the hour rate that suggests financial independence in one year!
        if (output.financial_independence == 0) {
            break;
        }
        const sim_dt = Date.now() - sim_start;
        const sim_time_penalty = sim_dt / max_sim_time;
        // dynamically adjust hour-rate increment the longe the simulation is running
        hour_rate_increment += (hour_rate_increment * sim_time_penalty);
        // try next higher hour rate
        hour_rate += hour_rate_increment;
    }
    return {
        founds: founds,
        max_hour_rate: hour_rate,
        total_founds_max: total_founds_max,
        fi_values: new Map(forbackd_fill(fi_values).map((hour_rate, year) => { return [year, hour_rate]; })),
        fail_values: new Map(forbackd_fill(fail_values).map((hour_rate, year) => { return [year, hour_rate]; }))
    };
}
//@ts-ignore
self.onmessage = (event) => { postMessage(run_simulation(event.data, 0.0, 1.0, postMessage)); };
