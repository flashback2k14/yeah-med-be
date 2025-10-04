import express from "express";
import { randomUUID } from "node:crypto";
import {
  createEntry,
  deleteEntry,
  getById,
  getByUserId,
  updateEntry,
} from "../db/queries/coupons-queries.js";
import authenticate from "../middleware/authenticate.js";

const couponsRouter = express.Router();

// CREATE
couponsRouter.post("/", authenticate, (req, res) => {
  const { name, website, expiredAt } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required property: 'name'" });
  }

  if (!expiredAt) {
    return res
      .status(400)
      .json({ error: "Missing required property: 'expiredAt'" });
  }

  const added = createEntry.get(
    randomUUID(),
    req.user.user_id,
    name,
    website ?? null,
    expiredAt,
    Date.now()
  );

  return res.status(201).json({
    id: added.coupon_id,
    name,
    website,
    expiredAt: new Date(added.expired_at).toISOString(),
    createdAt: new Date(added.created_at).toISOString(),
  });
});

// READ
couponsRouter.get("/", authenticate, (req, res) => {
  const entries = getByUserId.all(req.user.user_id);
  return res.status(200).json(
    entries.map(({ coupon_id, name, website, expired_at, created_at }) => ({
      id: coupon_id,
      name,
      website,
      expiredAt: new Date(expired_at).toISOString(),
      createdAt: new Date(created_at).toISOString(),
    }))
  );
});

// UPDATE
couponsRouter.put("/:id", authenticate, (req, res) => {
  const { name, website, expiredAt } = req.body;
  const id = req.params.id;

  const recorded = getById.get(id);
  if (!recorded) {
    return res.status(404).json({ error: "Coupon entry not found" });
  }

  if (recorded.med_owner !== req.user.user_id) {
    return res
      .status(401)
      .json({ error: "User unauthorized to update this coupon entry" });
  }

  const updated = updateEntry.get(
    name,
    website ?? null,
    expiredAt,
    recorded.med_owner,
    id
  );

  return res.status(200).json({
    message: "Successfully updated coupon entry",
    update: {
      id: updated.coupon_id,
      name,
      website: updated.website,
      expiredAt: new Date(updated.expired_at).toISOString(),
      createdAt: new Date(updated.created_at).toISOString(),
    },
  });
});

// DELETE
couponsRouter.delete("/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const recorded = getById.get(id);
  if (!recorded) {
    return res.status(404).json({ error: "coupon entry not found" });
  }

  if (recorded.med_owner !== req.user.user_id) {
    return res
      .status(401)
      .json({ error: "User unauthorized to delete this coupon entry" });
  }

  deleteEntry.run(id, req.user.user_id);

  return res
    .status(200)
    .json({ message: "Coupon entry successfully deleted!" });
});

export default couponsRouter;
