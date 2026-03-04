import { tavily } from "@tavily/core";
import { tool } from "@openai/agents";
import { z } from "zod";


const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export const web_search = tool({
    name: "web_search",
    description: "Search the web for information",
    parameters: z.object({
        query: z.string(),
    }),
    execute: async ({ query }) => {
        const response = await tvly.search(query);
        return response.results;
    }
});