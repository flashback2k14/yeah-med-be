import migration_001_script from "./001/index.js";
import migration_002_script from "./002/index.js";
import migration_003_script from "./003/index.js";

export default function runMigrations(database) {
  console.log(" BEGIN: runMigrations");

  migration_001_script(database);
  migration_002_script(database);
  migration_003_script(database);

  console.log(" END: runMigrations");
}
