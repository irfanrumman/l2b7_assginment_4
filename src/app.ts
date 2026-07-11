import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middelwares/globalError";
import { landlordRoutes } from "./modules/landLord/landLord.routes";
import { categoryRoutes } from "./modules/category/category.routes";
import { propertyRoutes } from "./modules/property/property.routes";
import { rentalRoutes } from "./modules/rental/rental.routes";



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




// api 
app.use("/api/auth", authRoutes);
app.use ("/api/landlord", landlordRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rentals", rentalRoutes);


// app.use("/api/payments", paymentRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/admin", adminRoutes);




// protected route

// Global Error Handler
app.use(globalErrorHandler)

export default app;