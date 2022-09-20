import express, { Express } from "express";

const app: Express = express();
const port = Number.isInteger(process.env.PORT)
  ? Number(process.env.PORT)
  : 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
