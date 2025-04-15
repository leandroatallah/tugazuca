require("dotenv").config();

import express from "express";
import router from "./routes";
import askRoutes from "./ask/ask.routes";

const app = express();

app.use(express.json());

// routes
app.use("/", router);
app.use("/ask", askRoutes);

export default app;
