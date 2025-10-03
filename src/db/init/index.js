import { DatabaseSync } from "node:sqlite";
import runMigrations from "../migrations/index.js";

function initDatabase() {
  const database = new DatabaseSync(
    process.env.DATABASE_PATH ?? "data/yeahmed.db"
  );

  console.log("BEGIN: initDatabase");

  const init_database = `
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meds (
      med_id TEXT PRIMARY KEY,
      med_owner TEXT NOT NULL, 
      name TEXT NOT NULL,
      description TEXT,
      product_id TEXT,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      expired_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(name, category, location),
      FOREIGN KEY (med_owner) REFERENCES users (user_id)
    );

    CREATE TABLE IF NOT EXISTS migrations (
      migration_id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shopping_lists (
      shopping_list_id TEXT PRIMARY KEY,
      med_owner TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (med_owner) REFERENCES users (user_id)
    );
  `;

  database.exec(init_database);

  runMigrations(database);

  console.log("END: initDatabase");

  return database;
}

export default initDatabase();
