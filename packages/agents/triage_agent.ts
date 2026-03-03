import { Agent } from "@openai/agents";
import Quick_Agent from "./quick_agent";
import Deep_Agent from "./deep_agent";
import "dotenv/config";

// main Agent
const Triage_Agent = new Agent({
    name: "triageAgent",
    instructions: "You are a triage agent that analyze the users query and determine the best agent to answer it.",
    model: "gpt-5-mini",
    handoffs:[Quick_Agent, Deep_Agent],
});
export default Triage_Agent;