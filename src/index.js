import express from "express";
import usersRouter from "./router/user.router.js";
import medsRouter from "./router/meds.router.js";

try {
  const PORT = 3000;
  const app = express();

  app.use(express.json());

  app.get("/api/health", (req, res) => res.send("API is running"));
  app.use("/api/users", usersRouter);
  app.use("/api/meds", medsRouter);

  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
} catch (error) {
  console.error(error);
}
