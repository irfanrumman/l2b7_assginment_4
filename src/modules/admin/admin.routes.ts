import { Router } from "express";
import { validate } from "../../middelwares/validate";
import { auth } from "../../middelwares/auth";
import { getAllUsersSchema } from "./admin.validation";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();


router.get("/users", auth(Role.ADMIN), validate(getAllUsersSchema, "query"), adminController.getAllUsers);

// router.patch(
//   "/users/:id",
//   validate(userIdSchema, "params"),
//   validate(updateUserStatusSchema),
//   updateUserStatus
// );

// router.get("/properties", validate(adminQuerySchema, "query"), getAllProperties);

// router.get("/rentals", validate(adminQuerySchema, "query"), getAllRentals);



export const adminRoutes = router;