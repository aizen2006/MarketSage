import { tool } from "@openai/agents";
import { z } from "zod";

export const generate_memo = tool({
	name: "generate_memo",
	description: "Wrap analysis output into a structured markdown memo.",
	parameters: z.object({
		company: z.string().describe("Full company name"),
		ticker: z.string().describe("Stock ticker symbol, e.g. AAPL"),
		analysis_body: z
			.string()
			.describe("The raw analysis text to include in the memo body"),
	}),
	execute: async ({ company, ticker, analysis_body }) => {
		const date = new Date().toISOString().slice(0, 10);

		const memo = [
			`# Investment Research Memo`,
			``,
			`| Field   | Value |`,
			`|---------|-------|`,
			`| Company | ${company} |`,
			`| Ticker  | ${ticker.toUpperCase()} |`,
			`| Date    | ${date} |`,
			``,
			`---`,
			``,
			`## Analysis`,
			``,
			analysis_body,
			``,
			`---`,
			``,
			`> **Disclaimer:** This memo is generated for informational purposes only and does not constitute investment advice. ` +
				`Past performance is not indicative of future results. Always conduct your own due diligence.`,
		].join("\n");

		return memo;
	},
});
