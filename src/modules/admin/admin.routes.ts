import { Router } from "express";
import { validate } from "../../middelwares/validate";
import { auth } from "../../middelwares/auth";
import {
  adminRentalQuerySchema,
  getAllUsersSchema,
  updateUserStatusSchema,
  userIdSchema,
} from "./admin.validation";
import { Role } from "../../../prisma/generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/users",
  auth(Role.ADMIN),
  validate(getAllUsersSchema, "query"),
  adminController.getAllUsers,
);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validate(userIdSchema, "params"),
  validate(updateUserStatusSchema),
  adminController.updateUserStatus,
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  validate(getAllUsersSchema, "query"),
  adminController.getAllPropertiesForAdmin,
);

router.get(
  "/rentals",
  auth(Role.ADMIN),
  validate(adminRentalQuerySchema, "query"),
  adminController.getAllRentalsForAdmin,
);

export const adminRoutes = router;
