
export function quantile(arr: Array<number>, q: number) : number
{
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined)
    {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    else
    {
        return sorted[base];
    }
};

export function forecast_min_required_founds(min_monthly_expense: number, avg_anual_inflation: number, founding_period_years: number) : number
{
    const min_anual_expense = min_monthly_expense * 12;

    const years = [...Array(founding_period_years).keys()];

    return years.map(year => min_anual_expense * Math.pow(1.0 + avg_anual_inflation, year)).reduce((sum, expense) => sum += expense, 0.0);
}

function pay_taxes(brutto_amount: number, tax_rate: number): number
{
    const taxes         = Math.max(0.0, brutto_amount) * tax_rate;
    const netto_amount  = brutto_amount - taxes;

    return netto_amount;
}

function calculate_invest_retruns(invest_amount: number, return_rate: number): number { return Math.max(0.0, invest_amount) * return_rate; }

function forecast_inflation_rate(avg_anual_inflation_rate: number, num_years: number): number { return Math.pow(1.0 + avg_anual_inflation_rate, num_years); }

export type HourRate                = number;
export type Year                    = number;

export interface ISimulationInput 
{
    expected_min_anual_expenses:    number;

    founding_period_years:          Year;

    anual_saving_rate:              number;
    saving_risk_ratio:              number;
    
    income_tax:                     number;
    invest_tax:                     number;

    avg_anual_inflation_rate:       number;  
    avg_anual_invest_return:        number;

    adj_hr_by_inflation:            boolean;

    initial_founds:                 number;
    initial_invest:                 number;                           
}

interface ISimulationInputInternal extends ISimulationInput
{
    hour_rate:                      HourRate;
    start_founding_year:            Year;
    financial_independent:         number | undefined;
}

export interface ISimulationResults
{
    fi_values:                      Map<Year, HourRate>;
    fail_values:                    Map<Year, HourRate>;
    max_hour_rate:                  number;
}

interface ISimulationFoundingPeriodOutput 
{
    total_remaining_founds:         number;
    failed:                         number | undefined;
    financial_independence:         number | undefined;
}

const DefaultSimulationOutput: ISimulationResults = {
    fi_values:                      new Map<Year, HourRate>(),
    fail_values:                    new Map<Year, HourRate>(),
    max_hour_rate:                  0.0
};


function clone<T>(input: T): T { return JSON.parse(JSON.stringify(input)); }


const HR_TO_ANUAL = 8 /* business hours */ * 20 /* business days */ * 12 /* business month */; // 1920 business hours per year

function simulate_founding_period(input: ISimulationInputInternal): ISimulationFoundingPeriodOutput
{
    const sim_data                                  = clone(input);

    let total_founds                                = sim_data.initial_founds;
    let total_invest                                = sim_data.initial_invest;
    let financial_independence                      = sim_data.financial_independent;
    let failed                                      = undefined;

    for(let year = sim_data.start_founding_year; year < sim_data.founding_period_years; year++)
    {
        const inflation_year                        = forecast_inflation_rate(sim_data.avg_anual_inflation_rate, year);

        // earn active income by work           
        if(financial_independence                   === undefined)         
        {           
            const income_year                       = (sim_data.adj_hr_by_inflation ? sim_data.hour_rate * inflation_year : sim_data.hour_rate) * HR_TO_ANUAL;
            total_founds                            += pay_taxes(income_year, sim_data.income_tax);
        }

        // earn passive income by investments
        const invest_returns_year                   = calculate_invest_retruns(total_invest, sim_data.avg_anual_invest_return);
        total_founds                                += pay_taxes(invest_returns_year, sim_data.invest_tax);

        // do anual spending on expenses            
        const expenses_year                         = sim_data.expected_min_anual_expenses * inflation_year;
        if(expenses_year                            > total_founds)
        {
            // since we do not have any more liquid founds, we have to use our investments
            // note: investments have to be liquified and taxed
            // note: we also allow the total_invest value to become negative
            const diff                              = expenses_year - total_founds;
            const taxes                             = diff * sim_data.invest_tax;
            total_invest                            -= (diff + taxes);
            total_founds                            = 0.0;

        }
        else
        {
            total_founds                            -= expenses_year;
        }

        if(sim_data.anual_saving_rate               > 0.0 && financial_independence === undefined)
        {
            // note: we only use the appropriate portion (relating to the risk ratio) of the intented saving rate value and put it into investments
            const invest_year                       = sim_data.anual_saving_rate * sim_data.saving_risk_ratio;

            if(total_founds                         >= invest_year)
            {               
                total_invest                        += invest_year;
            }

            // note: even if there are no sufficient founds for the invest, we will still deduct the money
            total_founds                            -= invest_year;
        }           

        if(total_founds + total_invest              < 0.0 && failed === undefined)
        {           
            failed                                  = year;
        }

        if(financial_independence                   === undefined)
        {
            const sim_data_clone                    = clone(sim_data);
            
            sim_data_clone.start_founding_year      = year;
            sim_data_clone.financial_independent    = year;
            sim_data_clone.initial_founds           = total_founds;
            sim_data_clone.initial_invest           = total_invest;

            const { total_remaining_founds }        = simulate_founding_period(sim_data_clone);
            if(total_remaining_founds               >= 0.0) 
            {
                financial_independence              = year;
            }
        }
    }
    
    // return the remaining founds and (taxed) investments after the simulated founding period
    // note: this value can be negative, indicating that the specified input values are not sustainable!
    return {  
        total_remaining_founds:         total_founds + pay_taxes(total_invest, sim_data.invest_tax),
        failed:                         failed,
        financial_independence:         financial_independence
    } as ISimulationFoundingPeriodOutput;
}

function forward_fill(array: Array<number>): Array<number> 
{
    let filled = new Array<number>();

    let last_seen_value = undefined;
    for(let i = 0; i < array.length; i++)
    {
        if(array[i] !== undefined)
        {
            last_seen_value = filled[i] = array[i];
        }
        // found undefined value in array
        else
        {
            if(last_seen_value !== undefined)
            {
                filled[i] = last_seen_value;
            }
        }
    }

    return filled;
}

function backward_fill(array: Array<number>): Array<number> { return forward_fill(array.reverse()).reverse(); }

function forbackd_fill(array: Array<number>): Array<number> { return backward_fill(forward_fill(array)); }

export function run_simulation(input: ISimulationInput, initial_hour_rate: number = 0.0, hour_rate_increment: number = 1.0): ISimulationResults 
{
    let hour_rate                                   = initial_hour_rate;
    const fi_values                                 = new Array<number>(input.founding_period_years);
    const fail_values                               = new Array<number>(input.founding_period_years);

    while(true)             
    {               
        const sim_data                              = clone(input) as ISimulationInputInternal;
        sim_data.hour_rate                          = hour_rate;
        sim_data.start_founding_year                = 0;

        const output                                = simulate_founding_period(sim_data);

        // remember minimal hour rate to reach financial independence in X years
        if(output.financial_independence !== undefined && fi_values[output.financial_independence] === undefined)           
        { 
            fi_values[output.financial_independence] = hour_rate; 
        }

        // remember maximum hour rate to fail founding period
        if(output.failed !== undefined)                           
        { 
            fail_values[output.failed]              = hour_rate; 
        }

        // stop simulation, if we found the hour rate that suggests financial independence in one year!
        if(output.financial_independence == 0)      { break; }

        // try next higher hour rate
        hour_rate                                   += hour_rate_increment;
    }

    return {
        max_hour_rate:              hour_rate,
        fi_values:                  new Map(forbackd_fill(fi_values).map((hour_rate, year) => { return [year, hour_rate] })),
        fail_values:                new Map(forbackd_fill(fail_values).map((hour_rate, year) => { return [year, hour_rate] }))
    } as ISimulationResults;
}