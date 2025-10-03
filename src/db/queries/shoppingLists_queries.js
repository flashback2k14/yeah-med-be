import database from "../init/index.js";

const createEntry = database.prepare(`
  INSERT INTO shopping_lists (
    shopping_list_id,
    med_owner,
    name,
    company,
    created_at
  ) VALUES (?, ?, ?, ?, ?)
  RETURNING
    shopping_list_id,
    name,
    company,
    created_at
`);

const getByUserId = database.prepare(`
  SELECT *
  FROM shopping_lists
  WHERE med_owner = ?
  ORDER BY name ASC  
`);

const getById = database.prepare(`
  SELECT * FROM shopping_lists WHERE shopping_list_id = ?
`);

const updateEntry = database.prepare(`
  UPDATE shopping_lists
    SET
      name = ?,
      company = ?
  WHERE med_owner = ? AND shopping_list_id = ?
  RETURNING
    shopping_list_id,
    name,
    company,
    created_at
`);

const deleteEntry = database.prepare(`
  DELETE from shopping_lists WHERE shopping_list_id = ? AND med_owner = ?  
`);

export { createEntry, getByUserId, getById, updateEntry, deleteEntry };
