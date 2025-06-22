import express from "express";
import {
  getUserById,
  createMed,
  getMedsByUserId,
  getMedById,
  updateMedById,
  deleteMed,
} from "../db/queries.js";
import { uuid } from "../util/index.js";

const medsRouter = express.Router();

// CREATE
medsRouter.post("/", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(400).json({ error: "Missing required header" });
  }

  const { name, description, productId, expiredAt } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Missing required property" });
  }

  const fetchedUser = getUserById.get(userId);
  if (!fetchedUser) {
    return res.status(400).json({ error: "User not found" });
  }

  const addedMed = createMed.get(
    uuid(),
    fetchedUser.user_id,
    name,
    description,
    productId ?? null,
    expiredAt,
    Date.now()
  );

  return res.status(201).json({
    id: addedMed.med_id,
    name,
    description,
    productId,
    expiredAt,
    joined: new Date(addedMed.created_at).toISOString(),
  });
});

// READ
medsRouter.get("/", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(400).json({ error: "Missing required header" });
  }

  const fetchedUser = getUserById.get(userId);
  if (!fetchedUser) {
    return res.status(400).json({ error: "Unauthenticated user" });
  }

  const meds = getMedsByUserId.all(userId);
  return res.status(200).json(
    meds.map(
      ({ med_id, name, description, product_id, expired_at, created_at }) => ({
        id: med_id,
        name,
        description,
        productId: product_id,
        expiredAt: new Date(expired_at).toISOString(),
        createdAt: new Date(created_at).toISOString(),
      })
    )
  );
});

// UPDATE
medsRouter.put("/:id", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(400).json({ error: "Missing required header" });
  }

  const { name, description, productId, expiredAt } = req.body;
  const medId = req.params.id;

  const recordedMed = getMedById.get(medId);
  if (!recordedMed) {
    return res.status(404).json({ error: "Med not found" });
  }

  if (recordedMed.med_owner !== userId) {
    return res
      .status(401)
      .json({ error: "User unauthorized to update this med" });
  }

  const updatedMed = updateMedById.get(
    name,
    description,
    productId,
    expiredAt,
    recordedMed.med_owner,
    medId
  );

  return res.status(200).json({
    message: "Successfully updated med",
    update: {
      id: updatedMed.med_id,
      name,
      description,
      productId: updatedMed.product_id,
      expiredAt: new Date(updatedMed.expired_at).toISOString(),
      createdAt: new Date(updatedMed.created_at).toISOString(),
    },
  });
});

// DELETE
medsRouter.delete("/:id", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(400).json({ error: "Missing required header" });
  }

  const medId = req.params.id;
  const recordedMed = getMedById.get(medId);
  if (!recordedMed) {
    return res.status(404).json({ error: "Med not found" });
  }

  if (recordedMed.med_owner !== userId) {
    return res
      .status(401)
      .json({ error: "User unauthorized to delete this med" });
  }

  deleteMed.run(medId, userId);

  return res.status(200).json({ message: "Med successfully deleted!" });
});

export default medsRouter;
