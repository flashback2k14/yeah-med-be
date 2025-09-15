import database from "../init/index.js";

const createUser = database.prepare(`
  INSERT INTO users (user_id, email, password_hash, created_at)
  VALUES (?, ?, ?, ?)
  RETURNING user_id, email, created_at    
`);

const getUserByEmail = database.prepare(`
  SELECT * FROM users WHERE email = ?
`);

const getUserById = database.prepare(`
  SELECT * FROM users WHERE user_id = ?
`);

const deleteUser = database.prepare(`
  DELETE from users WHERE user_id = ?
`);

export { createUser, getUserByEmail, getUserById, deleteUser };
