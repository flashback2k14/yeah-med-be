import database from "../init/index.js";

const createMed = database.prepare(`
  INSERT INTO meds (
    med_id, 
    med_owner, 
    name, 
    description, 
    product_id, 
    category, 
    category_color, 
    location, 
    count,
    company,
    in_use,
    expired_at, 
    created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING 
    med_id,
    name, 
    description, 
    product_id, 
    category, 
    category_color, 
    location, 
    count,
    company,
    in_use,
    expired_at, 
    created_at
`);

const getMedsByUserId = database.prepare(`
  SELECT 
     m.*
    ,unixepoch(m.expired_at) <= unixepoch(datetime('now')) as is_expired
  FROM MEDS m
  WHERE med_owner = ?
  ORDER BY 
     unixepoch(m.expired_at) <= unixepoch(datetime('now')) DESC
    ,m.in_use DESC
`);

const getMedById = database.prepare(`
  SELECT * FROM meds WHERE med_id = ?
`);

const getCategories = database.prepare(`
  SELECT DISTINCT category FROM MEDS WHERE med_owner = ? ORDER BY category ASC   
`);

const getLocations = database.prepare(`
  SELECT DISTINCT location FROM MEDS WHERE med_owner = ? ORDER BY location ASC
`);

const updateMedById = database.prepare(`
  UPDATE meds 
    SET 
      name = ?, 
      description = ?, 
      product_id = ?, 
      category = ?, 
      category_color = ?, 
      location = ?, 
      count = ?,
      company = ?,
      in_use = ?,
      expired_at = ? 
  WHERE med_owner = ? AND med_id = ? 
  RETURNING 
    med_id, 
    name, 
    description, 
    product_id, 
    category, 
    category_color, 
    location, 
    count,
    company,
    in_use,
    expired_at, 
    created_at
`);

const toggleMedInUse = database.prepare(`
  UPDATE meds 
    SET 
      in_use = ?
  WHERE med_owner = ? AND med_id = ? 
  RETURNING 
    med_id, 
    name, 
    description, 
    product_id, 
    category, 
    category_color, 
    location, 
    count,
    company,
    in_use,
    expired_at, 
    created_at
`);

const deleteMed = database.prepare(`
  DELETE from meds WHERE med_id = ? AND med_owner = ?  
`);

export {
  createMed,
  getMedsByUserId,
  getMedById,
  getCategories,
  getLocations,
  updateMedById,
  toggleMedInUse,
  deleteMed,
};
