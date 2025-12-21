import express from "express";
import {
  getAllMoments,
  getMomentById,
  createMoment,
  updateMoment,
  deleteMoment,
} from "../controllers/moment.controller.js";

const router = express.Router();

router.get("/", getAllMoments);
router.get("/:id", getMomentById);
router.post("/", createMoment);
router.put("/:id", updateMoment);
router.delete("/:id", deleteMoment);

export default router;
