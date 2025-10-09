import {
  alterTable,
  create,
  getById,
} from "../../queries/migrations-queries.js";

export default function migration_004_script(database) {
  const id = getById(database).get("004");

  if (!id) {
    alterTable(
      database,
      `ALTER TABLE coupons
       ADD COLUMN notes TEXT;`
    );

    create(database).get("004", "add notes to coupons table", Date.now());

    console.log("   Migration_004_script executed.");
  }
}
