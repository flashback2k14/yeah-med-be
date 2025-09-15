import express from "express";
import { randomUUID } from "node:crypto";
import {
  createMed,
  getMedsByUserId,
  getMedById,
  getCategories,
  getLocations,
  updateMedById,
  deleteMed,
} from "../db/queries/meds-queries.js";
import authenticate from "../middleware/authenticate.js";

const medsRouter = express.Router();

// CREATE
medsRouter.post("/", authenticate, (req, res) => {
  const {
    name,
    category,
    categoryColor,
    location,
    count,
    company,
    expiredAt,
    description,
    productId,
  } = req.body;

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

  if (!company) {
    return res
      .status(400)
      .json({ error: "Missing required property: 'company'" });
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
    description ?? null,
    productId ?? null,
    category,
    categoryColor ?? null,
    location,
    count ?? null,
    company,
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
    count,
    company,
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
        category_color,
        location,
        count,
        company,
        expired_at,
        created_at,
        is_expired,
      }) => ({
        id: med_id,
        name,
        description,
        productId: product_id,
        category,
        categoryColor: category_color,
        location,
        count,
        company,
        expiredAt: new Date(expired_at).toISOString(),
        createdAt: new Date(created_at).toISOString(),
        isExpired: Boolean(is_expired),
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
  const {
    name,
    description,
    productId,
    category,
    categoryColor,
    location,
    count,
    company,
    expiredAt,
  } = req.body;
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
    categoryColor ?? null,
    location,
    count ?? null,
    company,
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
      categoryColor: updatedMed.category_color,
      location: updatedMed.location,
      count: updatedMed.count,
      company: updatedMed.company,
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
