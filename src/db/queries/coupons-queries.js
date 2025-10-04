import database from "../init/index.js";

const createEntry = database.prepare(`
  INSERT INTO coupons (
    coupon_id,
    med_owner,
    name,
    website,
    expired_at,
    created_at
  ) VALUES (?, ?, ?, ?, ?, ?)
  RETURNING
    coupon_id,
    name,
    website,
    expired_at,
    created_at  
`);

const getByUserId = database.prepare(`
  SELECT *
  FROM coupons
  WHERE med_owner = ?
  ORDER BY name ASC  
`);

const getById = database.prepare(`
  SELECT * FROM coupons WHERE coupon_id = ?  
`);

const updateEntry = database.prepare(`
  UPDATE coupons
    SET
      name = ?,
      website = ?,
      expired_at = ?
  WHERE med_owner = ? AND coupon_id = ?
  RETURNING
    coupon_id,
    name,
    website,
    expired_at,
    created_at  
`);

const deleteEntry = database.prepare(`
  DELETE from coupons WHERE coupon_id = ? AND med_owner = ?  
`);

export { createEntry, getByUserId, getById, updateEntry, deleteEntry };
