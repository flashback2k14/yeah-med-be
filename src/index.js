import express from "express";
import cors from "cors";

import usersRouter from "./router/users.router.js";
import medsRouter from "./router/meds.router.js";

import pkg from "./../package.json" with { type: "json" };

try {
  console.log(`VERSION: ${pkg.version}`);

  const PORT = 3000;
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN_URL,
    })
  );
  app.use(express.json());

  app.get("/api/health", (req, res) => res.send("API is running"));
  app.use("/api/users", usersRouter);
  app.use("/api/meds", medsRouter);

  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
} catch (error) {
  console.error(error);
}
