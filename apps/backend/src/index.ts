import "dotenv/config";
import { app } from "./app";

if (!process.env.OPENAI_API_KEY?.trim()) {
	console.warn(
		"[agents] OPENAI_API_KEY is not set; /agents/* (quick, deep, auto, title) requests will fail.",
	);
}

app.listen(process.env.PORT || 3000);
console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);