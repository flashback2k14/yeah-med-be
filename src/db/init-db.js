import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(
  process.env.DATABASE_PATH ?? "data/yeahmed.db"
);

const initDatabase = `
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
`;

database.exec(initDatabase);

export default database;
