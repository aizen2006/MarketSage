import { app } from "./app";

const port = Number(process.env.API_PORT) || 4001;

app.listen(port);
console.log(`API backend is running on http://localhost:${port}`);

