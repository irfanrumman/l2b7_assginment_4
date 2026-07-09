import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterUserPayload } from "./auth.interface";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";





const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  
  const { name, email, password, role, phone } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new AppError("User already exists", httpStatus.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
     ...(phone ? { phone } : {}),
    },
    omit: {
      password: true,
    },
  });

  return createdUser;
};



export interface ILoginUser {
  email: string;
  password: string;
};
const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

   if(user.status === "BANNED") {
      throw new AppError("Your account has been banned. Please contact support.", httpStatus.FORBIDDEN);
    }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", httpStatus.UNAUTHORIZED);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload, 
    config.jwt_access_secret, 
    config.jwt_access_expires_in as SignOptions
);

 const refreshToken = jwtUtils.createToken(
    jwtPayload, 
    config.jwt_refresh_secret, 
    config.jwt_refresh_expires_in as SignOptions
);


  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async () => {}


export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
  getMe
}