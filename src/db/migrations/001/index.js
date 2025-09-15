import {
  alterTable,
  create,
  getById,
} from "../../queries/migrations-queries.js";

export default function migration_001_script(database) {
  const id = getById(database).get("001");

  if (!id) {
    alterTable(
      database,
      `
      ALTER TABLE meds 
      ADD COLUMN category_color TEXT;
    `
    );

    create(database).get(
      "001",
      "add color for category on meds table",
      Date.now()
    );

    console.log("   Migration_001_script executed.");
  }
}
