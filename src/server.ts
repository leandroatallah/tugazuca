import express from "express";
import router from "./routes/index.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use("/", router);

export default app;
