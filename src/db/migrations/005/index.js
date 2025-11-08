import {
  alterTable,
  create,
  getById,
} from "../../queries/migrations-queries.js";

export default function migration_005_script(database) {
  const id = getById(database).get("005");

  if (!id) {
    alterTable(
      database,
      `ALTER TABLE meds 
       ADD COLUMN in_use INTEGER DEFAULT 0;`
    );

    create(database).get("005", "add in use on meds table", Date.now());

    console.log("   Migration_005_script executed.");
  }
}
