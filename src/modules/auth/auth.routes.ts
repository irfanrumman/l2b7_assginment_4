import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middelwares/validate";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();


router.post('/register', validate(registerSchema), authController.registerUser); // valodate(schema.registerUserSchema),  
router.post('/login', validate(loginSchema), authController.loginUser);   // valodate(schema.loginUserSchema),              

// router.post("/refresh-token", authController.refreshToken) 

export const authRoutes = router;