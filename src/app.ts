import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middelwares/globalError";


const app: Application = express();

app.use(
  cors({
    origin: config.app_ulr,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to RentNest");
});




//auth api
app.use("/api/auth", authRoutes);




// Global Error Handler
app.use(globalErrorHandler)

export default app;