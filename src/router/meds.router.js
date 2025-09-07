import express from "express";
import { randomUUID } from "node:crypto";
import {
  createMed,
  getMedsByUserId,
  getMedById,
  updateMedById,
  deleteMed,
  getCategories,
  getLocations,
} from "../db/queries.js";
import authenticate from "../middleware/authenticate.js";

const medsRouter = express.Router();

// CREATE
medsRouter.post("/", authenticate, (req, res) => {
  const { name, category, location, expiredAt, description, productId } =
    req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required property: 'name'" });
  }

  if (!category) {
    return res
      .status(400)
      .json({ error: "Missing required property: 'category'" });
  }

  if (!location) {
    return res
      .status(400)
      .json({ error: "Missing required property: 'location'" });
  }

  if (!expiredAt) {
    return res
      .status(400)
      .json({ error: "Missing required property: 'expiredAt'" });
  }

  const addedMed = createMed.get(
    randomUUID(),
    req.user.user_id,
    name,
    description,
    productId ?? null,
    category,
    location,
    expiredAt,
    Date.now()
  );

  return res.status(201).json({
    id: addedMed.med_id,
    name,
    description,
    productId,
    category,
    location,
    expiredAt,
    joined: new Date(addedMed.created_at).toISOString(),
  });
});

// READ
medsRouter.get("/", authenticate, (req, res) => {
  const meds = getMedsByUserId.all(req.user.user_id);
  return res.status(200).json(
    meds.map(
      ({
        med_id,
        name,
        description,
        product_id,
        category,
        location,
        expired_at,
        created_at,
      }) => ({
        id: med_id,
        name,
        description,
        productId: product_id,
        category,
        location,
        expiredAt: new Date(expired_at).toISOString(),
        createdAt: new Date(created_at).toISOString(),
      })
    )
  );
});

medsRouter.get("/categories", authenticate, (req, res) => {
  const fetchedCategories = getCategories.all(req.user.user_id);
  if (!fetchedCategories) {
    return res.status(400).json({ error: "No categories found." });
  }

  return res.status(200).json(fetchedCategories.map((entry) => entry.category));
});

medsRouter.get("/locations", authenticate, (req, res) => {
  const fetchedLocations = getLocations.all(req.user.user_id);
  if (!fetchedLocations) {
    return res.status(400).json({ error: "No locations found." });
  }

  return res.status(200).json(fetchedLocations.map((entry) => entry.location));
});

// UPDATE
medsRouter.put("/:id", authenticate, (req, res) => {
  const { name, description, productId, category, location, expiredAt } =
    req.body;
  const medId = req.params.id;

  const recordedMed = getMedById.get(medId);
  if (!recordedMed) {
    return res.status(404).json({ error: "Med not found" });
  }

  if (recordedMed.med_owner !== req.user.user_id) {
    return res
      .status(401)
      .json({ error: "User unauthorized to update this med" });
  }

  const updatedMed = updateMedById.get(
    name,
    description,
    productId,
    category,
    location,
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
      category: updatedMed.category,
      location: updatedMed.location,
      expiredAt: new Date(updatedMed.expired_at).toISOString(),
      createdAt: new Date(updatedMed.created_at).toISOString(),
    },
  });
});

// DELETE
medsRouter.delete("/:id", authenticate, (req, res) => {
  const medId = req.params.id;
  const recordedMed = getMedById.get(medId);
  if (!recordedMed) {
    return res.status(404).json({ error: "Med not found" });
  }

  if (recordedMed.med_owner !== req.user.user_id) {
    return res
      .status(401)
      .json({ error: "User unauthorized to delete this med" });
  }

  deleteMed.run(medId, req.user.user_id);

  return res.status(200).json({ message: "Med successfully deleted!" });
});

export default medsRouter;
