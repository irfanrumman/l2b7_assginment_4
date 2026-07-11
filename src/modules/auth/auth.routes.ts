import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middelwares/validate";
import {loginUserSchema, registerUserSchema, updateUserProfileSchema } from "./auth.validation";
import { auth } from "../../middelwares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post('/register', validate(registerUserSchema), authController.registerUser);  

router.post('/login', validate(loginUserSchema), authController.loginUser);                 
router.post("/refresh-token", authController.refreshToken) 


router.get('/me', auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),  authController.getMyProfile); 

router.patch("/my-profile", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), validate(updateUserProfileSchema), authController.updateMyProfile);  


export const authRoutes = router;