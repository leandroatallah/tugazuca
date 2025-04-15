import express from "express";
import { getWordComparison } from "./ask.controller";

const router = express.Router();

router.get("/:term", getWordComparison);

export default router;
