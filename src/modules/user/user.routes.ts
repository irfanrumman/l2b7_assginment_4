import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middelwares/auth";

const router = Router();


router.get('/me', auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),  userController.getMyProfile); 

router.patch("/my-profile", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), userController.updateMyProfile);  // valodate(schema.updateProfileSchema),


export const userRoutes = router;