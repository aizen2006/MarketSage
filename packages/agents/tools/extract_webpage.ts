import { tavily } from "@tavily/core";
import { tool } from "@openai/agents";
import { z } from "zod";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export const extract_webpage = tool({
    name: "extract_webpage",
    description: "Extract the content of a webpage",
    parameters: z.object({
        url: z.string(),
    }),
    execute: async ({ url }) => {
        const response = await tvly.extract([url]);
        return response;
    }
});