import database from "./init-db.js";

const createUser = database.prepare(`
  INSERT INTO users (user_id, email, password_hash, created_at)
  VALUES (?, ?, ?, ?)
  RETURNING user_id, email, created_at    
`);

const createMed = database.prepare(`
  INSERT INTO meds (
      med_id, med_owner, name, description, product_id, category, location, expired_at, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING med_id, name, description, product_id, category, location, expired_at, created_at
`);

const getUserByEmail = database.prepare(`
  SELECT * FROM users WHERE email = ?
`);

const getUserById = database.prepare(`
  SELECT * FROM users WHERE user_id = ?
`);

const getMedsByUserId = database.prepare(`
  SELECT * FROM meds WHERE med_owner = ?
`);

const getMedById = database.prepare(`
  SELECT * FROM meds WHERE med_id = ?
`);

const updateMedById = database.prepare(`
  UPDATE meds 
    SET name = ?, description = ?, product_id = ?, category = ?, location = ?, expired_at = ? 
  WHERE med_owner = ? AND med_id = ? 
  RETURNING med_id, name, description, product_id, category, location, expired_at, created_at
`);

const deleteMed = database.prepare(`
  DELETE from meds WHERE med_id = ? AND med_owner = ?  
`);

const deleteUser = database.prepare(`
  DELETE from users WHERE user_id = ?
`);

const getCategories = database.prepare(`
  SELECT DISTINCT category FROM MEDS WHERE med_owner = ?    
`);

const getLocations = database.prepare(`
  SELECT DISTINCT location FROM MEDS WHERE med_owner = ?    
`);

export {
  createUser,
  createMed,
  getUserByEmail,
  getUserById,
  getMedsByUserId,
  getMedById,
  updateMedById,
  deleteMed,
  deleteUser,
  getCategories,
  getLocations,
};
