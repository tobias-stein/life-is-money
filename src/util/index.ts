
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

export function compactNumber(n: number): string 
{
    return Intl.NumberFormat(navigator.language || "en", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}

export function forecast_min_required_funds(min_monthly_expense: number, avg_annual_inflation: number, funding_period_years: number) : number
{
    const min_annual_expense = min_monthly_expense * 12;

    if(min_annual_expense <= 0 || funding_period_years < 0) { return 0; }

    const years = [...Array(funding_period_years).keys()];

    return years.map(year => min_annual_expense * Math.pow(1.0 + avg_annual_inflation, year)).reduce((sum, expense) => sum += expense, 0.0);
}

export function debounce(fn: Function, delay: number) 
{
    var timeoutID: number | undefined = undefined;
    {
        clearTimeout(timeoutID)
        const args = arguments;
        //@ts-ignore
        const that = this;
        timeoutID = setTimeout(function () { fn.apply(that, args) }, delay)
    }
}
