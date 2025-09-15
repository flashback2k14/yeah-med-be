const alterTable = (database, sql) => database.exec(sql);

const create = (database) =>
  database.prepare(`
    INSERT INTO migrations (migration_id, name, created_at) 
    VALUES (?, ?, ?)
    RETURNING migration_id, name, created_at
  `);

const getById = (database) =>
  database.prepare(`
    SELECT migration_id FROM migrations WHERE migration_id = ?
  `);

export { alterTable, create, getById };
