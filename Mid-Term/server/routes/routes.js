import express from "express";
import cafeRoutes from "./cafe.routes.js";
import momentRoutes from "./moment.routes.js";

const router = express.Router();

router.use("/cafes", cafeRoutes);
router.use("/moments", momentRoutes);

export default router;
