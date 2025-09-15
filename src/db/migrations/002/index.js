import {
  alterTable,
  create,
  getById,
} from "../../queries/migrations-queries.js";

export default function migration_002_script(database) {
  const id = getById(database).get("002");

  if (!id) {
    alterTable(
      database,
      `
      ALTER TABLE meds 
      ADD COLUMN count INTEGER;
    `
    );

    create(database).get("002", "add count on meds table", Date.now());

    console.log("   Migration_002_script executed.");
  }
}
