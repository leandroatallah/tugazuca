import express from "express";
import { getWordComparison } from "./ask.controller";

const router = express.Router();

// TODO: Replace mocked swagger config
/**
 * @swagger
 * /ask/:term:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
router.get("/:term", getWordComparison);

export default router;
