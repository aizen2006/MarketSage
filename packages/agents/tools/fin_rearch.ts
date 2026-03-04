import { tool } from "@openai/agents";
import { z } from "zod";

const FMP_BASE_URL = "https://financialmodelingprep.com";

type FmpParams = Record<string, string | number | undefined>;

async function fmpFetch(path: string, params: FmpParams = {}) {
	const apiKey = process.env.FMP_API_KEY;

	if (!apiKey) {
		throw new Error("FMP_API_KEY is not set in environment");
	}

	const url = new URL(path, FMP_BASE_URL);

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			url.searchParams.set(key, String(value));
		}
	}

	url.searchParams.set("apikey", apiKey);

	const response = await fetch(url);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`FMP request failed: ${response.status} ${response.statusText} - ${text}`,
		);
	}

	return response.json();
}

export const fin_research = tool({
	name: "fin_research",
	description:
		"Access structured financial data from Financial Modeling Prep (quotes, profiles, statements, metrics, etc.).",
	parameters: z.object({
		action: z.enum([
			"search",
			"profile",
			"quote",
			"income_statement",
			"balance_sheet",
			"cash_flow",
			"key_metrics",
			"ratios",
			"financial_scores",
			"price_history",
			"price_change",
			"dcf",
			"analyst_estimates",
		]),
		symbol: z
			.string()
			.optional()
			.describe("Ticker symbol, e.g. AAPL (required for most actions)"),
		query: z
			.string()
			.optional()
			.describe("Free-text search query (required for `search` action)"),
		period: z
			.enum(["annual", "quarter"])
			.optional()
			.describe(
				"Reporting period for financial statements (annual or quarter). Defaults to annual when omitted.",
			),
		limit: z
			.number()
			.optional()
			.describe("Maximum number of records to return (FMP default when omitted)."),
	}),
	async execute({ action, symbol, query, period, limit }) {
		switch (action) {
			case "search": {
				if (!query) {
					throw new Error("`query` is required for action `search`");
				}

				return fmpFetch("/stable/search-symbol", {
					query,
					limit,
				});
			}

			case "profile": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `profile`");
				}

				return fmpFetch("/stable/profile", {
					symbol,
					limit,
				});
			}

			case "quote": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `quote`");
				}

				return fmpFetch("/stable/quote", {
					symbol,
					limit,
				});
			}

			case "income_statement": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `income_statement`");
				}

				return fmpFetch("/stable/income-statement", {
					symbol,
					period: period ?? "annual",
					limit,
				});
			}

			case "balance_sheet": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `balance_sheet`");
				}

				return fmpFetch("/stable/balance-sheet-statement", {
					symbol,
					period: period ?? "annual",
					limit,
				});
			}

			case "cash_flow": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `cash_flow`");
				}

				return fmpFetch("/stable/cash-flow-statement", {
					symbol,
					period: period ?? "annual",
					limit,
				});
			}

			case "key_metrics": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `key_metrics`");
				}

				return fmpFetch("/stable/key-metrics", {
					symbol,
					period: period ?? "annual",
					limit,
				});
			}

			case "ratios": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `ratios`");
				}

				return fmpFetch("/stable/ratios", {
					symbol,
					period: period ?? "annual",
					limit,
				});
			}

			case "financial_scores": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `financial_scores`");
				}

				return fmpFetch("/stable/financial-scores", {
					symbol,
					limit,
				});
			}

			case "price_history": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `price_history`");
				}

				return fmpFetch("/stable/historical-price-eod/light", {
					symbol,
					limit,
				});
			}

			case "price_change": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `price_change`");
				}

				return fmpFetch("/stable/stock-price-change", {
					symbol,
					limit,
				});
			}

			case "dcf": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `dcf`");
				}

				return fmpFetch("/stable/discounted-cash-flow", {
					symbol,
					limit,
				});
			}

			case "analyst_estimates": {
				if (!symbol) {
					throw new Error("`symbol` is required for action `analyst_estimates`");
				}

				return fmpFetch("/stable/analyst-estimates", {
					symbol,
					limit,
				});
			}

			default: {
				// This should be unreachable because action is a zod enum
				throw new Error(`Unsupported action: ${action satisfies never}`);
			}
		}
	},
});

