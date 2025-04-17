import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swagger.js";
import dictionaryRoutes from "../dictionary/dictionary.routes.js";
import redis from "../services/redis.js";

const router = express.Router();

// Swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocs));

// Redis ping
router.get("/redis-ping", async (_, res) => {
  const ping = await redis.ping();
  res.send(ping);
});

// Routes
router.use("/ask", dictionaryRoutes);

export default router;
