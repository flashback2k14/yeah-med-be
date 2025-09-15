import {
  alterTable,
  create,
  getById,
} from "../../queries/migrations-queries.js";

export default function migration_003_script(database) {
  const id = getById(database).get("003");

  if (!id) {
    alterTable(
      database,
      `
      ALTER TABLE meds 
      ADD COLUMN company TEXT NOT NULL DEFAULT 'TBD';
    `
    );

    alterTable(
      database,
      `
      CREATE UNIQUE INDEX idx_meds_company ON meds(company);
    `
    );

    create(database).get(
      "003",
      "add company and unique constraint on meds table",
      Date.now()
    );

    console.log("   Migration_003_script executed.");
  }
}
