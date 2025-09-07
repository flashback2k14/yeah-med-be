import { getUserById } from "../db/queries.js";

export default function authenticate(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ error: "Missing required header" });
    }

    const fetchedUser = getUserById.get(userId);
    if (!fetchedUser) {
      return res.status(400).json({ error: "User not found" });
    }

    req.user = fetchedUser;

    next();
  } catch (error) {
    res.status(500).json({ error });
  }
}
