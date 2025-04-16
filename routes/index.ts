import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swagger";
import askRoutes from "../ask/ask.routes";

const router = express.Router();

// Swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocs));

// Routes
router.use("/ask", askRoutes);

export default router;
