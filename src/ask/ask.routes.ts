import express from "express";
import { getWordComparison } from "./ask.controller.js";

const router = express.Router();

/**
 * @swagger
 * /ask/{term}:
 *   get:
 *     summary: Compare word usage between Brazilian and European Portuguese
 *     parameters:
 *       - in: path
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: The word to compare
 *     responses:
 *       200:
 *         description: Word comparison details
 *       500:
 *         description: Internal server error
 */
router.get("/:term", async (req, res) => {
  try {
    await getWordComparison(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
