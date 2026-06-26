import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { Role } from "../../generated/prisma/enums";

export const auth = (...requiredRoles: Role[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { id, name, email, role } = verifiedToken.data as JwtPayload;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden! You do not have permission to perform this action",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: id, name: name, email: email, role: role },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("User is blocked. Please contact support.");
    }

    req.user = { id, name, email, role };
    next();
  });
