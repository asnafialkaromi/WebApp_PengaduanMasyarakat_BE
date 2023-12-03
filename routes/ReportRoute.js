import express from "express";

import {
  getReport,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} from "../controller/Report.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/report", verifyUser, getReport);
router.get("/report/:id", verifyUser, getReportById);
router.post("/report", verifyUser, createReport);
router.patch("/report", verifyUser, adminOnly, updateReport);
router.delete("/report/:id", verifyUser, adminOnly, deleteReport);

export default router;
