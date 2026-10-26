import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";
import { corsOptions } from "./config/cors.config";
import { requestLogger } from "@/middleware/request-logger.middleware";
import { errorHandler } from "./middleware/error-handler.middleware";
const app = express();

// ---------------------------
// Middlewares
// ---------------------------
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------
// Routes
// ---------------------------
app.use("/api", routes);
app.use(errorHandler);

export default app;