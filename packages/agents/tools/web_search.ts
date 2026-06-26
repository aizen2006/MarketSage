import { tool } from "@openai/agents";
import { z } from "zod";
import { tvly } from "../utils/tavily";

export const web_search = tool({
    name:"web_search_tool",
    description: `
        Search the public web for relevant information using a search engine.

        Use this tool when you need:
        - Recent news or current events
        - Company announcements and press releases
        - SEC filings or investor relations pages
        - Market-moving events
        - Macroeconomic developments
        - Industry trends
        - General factual information
        - Finding relevant webpages before extracting their contents

        Returns a ranked list of relevant webpages with titles, URLs, snippets, and metadata.

        Prefer this tool for discovering information. If detailed content from a webpage is required, use web_extract after identifying the appropriate URL.

        Avoid using this tool when you already have the exact webpage URL or require comprehensive multi-source analysis.
        `,
    parameters: z.object({
        query: z.string()
    }),
    async execute({query}){
        try{
            const res = await tvly.search(query);
            return res.results;
        }catch(e){
            return e;
        }
    }
});

export const web_research = tool({
    name:'web_research_tool',
    description: `
        Conduct comprehensive multi-step research across numerous online sources.

        Use this tool for complex questions that require:
        - Deep financial research
        - Company due diligence
        - Investment thesis generation
        - Industry or competitive landscape analysis
        - Market research
        - Multi-source evidence gathering
        - Long-form reports with synthesized findings

        The tool searches, evaluates, cross-references, and synthesizes information from multiple authoritative sources into a structured research report.

        Model options:
        - auto: Balanced quality and speed.
        - mini: Faster and lower cost.
        - pro: Highest quality for complex or high-stakes research.

        Prefer this tool over web_search whenever the question cannot be answered from a few webpages or requires evidence from multiple sources.
        `,
    parameters:z.object({
        input:z.string(),
        model:z.enum(['auto','mini','pro'])
    }),
    async execute({input,model='auto'}){
        try {
            const res = await tvly.research(input,{model});
            return res
        } catch (err) {
            return err
        }
    }
});

export const web_extract = tool({
    name:'web_extract_tool',
    description:`
    Extract the readable contents of one or more webpages.
    
    Use this tool when you already know the webpage URL and need:
    - Full article contents
    - SEC filing text
    - Earnings releases
    - Investor presentations
    - Documentation
    - Blog posts
    - Reports
    - Official announcements
    
    Supports multiple URLs in a single request.
    
    Extraction modes:
    - basic: Faster extraction suitable for most webpages.
    - advanced: More accurate extraction for complex or dynamic webpages.
    
    Output formats:
    - markdown: Preserves headings, tables, and formatting.
    - text: Returns plain text only.
    
    Use this tool after discovering relevant URLs with web_search, or whenever the user directly provides webpage URLs.
    `,
    parameters:z.object({
        url:z.string().array(),
        extractDepth:z.enum(["basic","advanced"]),
        format:z.enum([ "markdown","text"])
    }),
    async execute({url,extractDepth='basic',format='markdown'}){
        try {
            const res = await tvly.extract(url,{extractDepth,format})
            return res.results
        } catch (err) {
            return err
        }
    }
})

