import { tavily } from "@tavily/core"
import 'dotenv/config'

if(!process.env.TAVILY_API_KEY){ console.error("The tavily API KEY is not loaded ")}

export const tvly = tavily({apiKey:process.env.TAVILY_API_KEY})