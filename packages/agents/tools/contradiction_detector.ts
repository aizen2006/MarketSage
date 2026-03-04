import { tool } from "@openai/agents";
import { z } from "zod";

const METRIC_PATTERNS: [string, RegExp][] = [
	["revenue", /revenue/gi],
	["net income", /net\s*income/gi],
	["EPS", /\beps\b|earnings\s*per\s*share/gi],
	["P/E ratio", /p\/?e\s*ratio/gi],
	["market cap", /market\s*cap(italization)?/gi],
	["debt", /\btotal\s*debt\b|\bdebt\b/gi],
	["margin", /\bmargin\b/gi],
	["growth", /\bgrowth\b/gi],
	["cash flow", /cash\s*flow/gi],
	["EBITDA", /\bebitda\b/gi],
];

const BULLISH = /\b(increase[ds]?|grow[sn]?|grew|rising|higher|improv(e[ds]?|ing)|strong|positive|beat|upside|outperform)\b/i;
const BEARISH = /\b(decrease[ds]?|declin(e[ds]?|ing)|falling|lower|worsen(s|ed|ing)?|weak|negative|miss|downside|underperform)\b/i;

interface Flag {
	metric: string;
	sentiment: "mixed";
	detail: string;
}

export const contradiction_detector = tool({
	name: "contradiction_detector",
	description:
		"Simple contradiction detector based on repeated metric mentions with conflicting sentiment signals.",
	parameters: z.object({
		claims_text: z
			.string()
			.describe("The analysis text to scan for contradictions"),
	}),
	execute: async ({ claims_text }) => {
		const sentences = claims_text
			.split(/(?<=[.!?])\s+/)
			.filter((s) => s.trim().length > 0);

		const flags: Flag[] = [];

		for (const [metricName, metricRe] of METRIC_PATTERNS) {
			const relevant = sentences.filter((s) => metricRe.test(s));
			if (relevant.length < 2) continue;

			const hasBullish = relevant.some((s) => BULLISH.test(s));
			const hasBearish = relevant.some((s) => BEARISH.test(s));

			if (hasBullish && hasBearish) {
				flags.push({
					metric: metricName,
					sentiment: "mixed",
					detail: `Found both positive and negative claims about ${metricName} across ${relevant.length} sentences.`,
				});
			}
		}

		if (flags.length === 0) {
			return {
				status: "clean",
				message: "No contradictions detected.",
			};
		}

		return {
			status: "contradictions_found",
			count: flags.length,
			flags,
		};
	},
});
