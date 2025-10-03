import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'

import usersRouter from "./router/users.router.js";
import medsRouter from "./router/meds.router.js";
import shoppingListRouter from "./router/shoppingLists.router.js";

import pkg from "../package.json" with { type: "json" };

try {
  console.log(`VERSION: ${pkg.version}`);

  const PORT = 3000;
  const app = express();

  app.set('trust proxy', 1);

  app.use(rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
  }));
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN_URL,
    })
  );
  app.use(express.json());

  app.get("/api/health", (_, res) => res.send("API is running"));
  app.use("/api/users", usersRouter);
  app.use("/api/meds", medsRouter);
  app.use("/api/shopping-lists", shoppingListRouter)

  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
} catch (error) {
  console.error(error);
}
