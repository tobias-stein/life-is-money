
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

export function forecast_min_required_founds(min_monthly_expense: number, avg_anual_inflation: number, founding_period_years: number) : number
{
    const min_anual_expense = min_monthly_expense * 12;

    const years = [...Array(founding_period_years).keys()];

    return years.map(year => min_anual_expense * Math.pow(1.0 + avg_anual_inflation, year)).reduce((sum, expense) => sum += expense, 0.0);
}
