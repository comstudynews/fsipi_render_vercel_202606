import { createApp } from "./app.js";
import { connectDatabase } from "./services/database.js";

const port = Number(process.env.PORT ?? 10000);

await connectDatabase();

const app = createApp();
app.listen(port, "0.0.0.0", () => {
  console.info(`[server] http://0.0.0.0:${port}`);
});
