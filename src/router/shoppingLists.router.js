import express from "express";
import { randomUUID } from "node:crypto";
import {
  createEntry,
  deleteEntry,
  getById,
  getByUserId,
  updateEntry,
} from "../db/queries/shoppingLists_queries.js";
import authenticate from "../middleware/authenticate.js";

const shoppingListRouter = express.Router();

// CREATE
shoppingListRouter.post("/", authenticate, (req, res) => {
  const { name, company } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required property: 'name'" });
  }

  const added = createEntry.get(
    randomUUID(),
    req.user.user_id,
    name,
    company ?? null,
    Date.now()
  );

  return res.status(201).json({
    id: added.shopping_list_id,
    name,
    company,
    createdAt: new Date(added.created_at).toISOString(),
  });
});

// READ
shoppingListRouter.get("/", authenticate, (req, res) => {
  const entries = getByUserId.all(req.user.user_id);
  return res.status(200).json(
    entries.map(({ shopping_list_id, name, company, created_at }) => ({
      id: shopping_list_id,
      name,
      company,
      createdAt: new Date(created_at).toISOString(),
    }))
  );
});

// UPDATE
shoppingListRouter.put("/:id", authenticate, (req, res) => {
  const { name, company } = req.body;
  const id = req.params.id;

  const recorded = getById.get(id);
  if (!recorded) {
    return res.status(404).json({ error: "Shopping list entry not found" });
  }

  if (recorded.med_owner !== req.user.user_id) {
    return res
      .status(401)
      .json({ error: "User unauthorized to update this shopping list entry" });
  }

  const updated = updateEntry.get(
    name,
    company ?? null,
    recorded.med_owner,
    id
  );

  return res.status(200).json({
    message: "Successfully updated shopping list entry",
    update: {
      id: updated.shopping_list_id,
      name,
      company: updated.company,
      createdAt: new Date(updated.created_at).toISOString(),
    },
  });
});

// DELETE
shoppingListRouter.delete("/:id", authenticate, (req, res) => {
  const id = req.params.id;
  const recorded = getById.get(id);
  if (!recorded) {
    return res.status(404).json({ error: "shopping list entry not found" });
  }

  if (recorded.med_owner !== req.user.user_id) {
    return res
      .status(401)
      .json({ error: "User unauthorized to delete this shopping list entry" });
  }

  deleteEntry.run(id, req.user.user_id);

  return res
    .status(200)
    .json({ message: "Shopping list entry successfully deleted!" });
});

export default shoppingListRouter;
