import express from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import {
  createUser,
  getUserByEmail,
  getUserById,
  deleteUser,
} from "../db/queries.js";
import authenticate from "../middleware/authenticate.js";

const usersRouter = express.Router();

const saltRounds = 10;

usersRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required property" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userId = randomUUID();

  const recordedUser = getUserByEmail.get(email);
  if (recordedUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const newUser = createUser.get(userId, email, hashedPassword, Date.now());
  return res.status(201).json({
    message: "Signup success",
    user: {
      userId: newUser.user_id,
      email: newUser.email,
      createdAt: new Date(newUser.created_at).toISOString(),
    },
  });
});

usersRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required property" });
  }

  const registeredUser = getUserByEmail.get(email);
  if (!registeredUser) {
    return res.status(400).json({ error: "User not found" });
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    registeredUser.password_hash
  );

  if (!isCorrectPassword) {
    return res.status(400).json({ error: "Incorrect Password" });
  }

  return res.status(200).json({
    message: "Signin success",
    user: {
      userId: registeredUser.user_id,
      email: registeredUser.email,
      createdAt: new Date(registeredUser.created_at).toISOString(),
    },
  });
});

usersRouter.delete("/:id", authenticate, (req, res) => {
  const userIdParam = req.params.id;
  if (userIdParam !== req.user.user_id) {
    return res.status(403).json({ error: "User unauthorized to delete" });
  }

  deleteUser.run(userIdParam);

  return res.status(200).json({ message: "User successfully deleted" });
});

export default usersRouter;
