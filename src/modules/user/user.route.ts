import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middlewares/auth";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}
router.post("/register", userController.registerUser);

router.get(
  "/me",
  // (req: Request, res: Response, next: NextFunction) => {
  //   // const cookies = req.cookies;
  //   const { accessToken } = req.cookies;
  //   // const verifiedToken = jwt.verify(accessToken, config.jwt_access_secret);
  //   const verifiedToken = jwtUtils.verifyToken(
  //     accessToken,
  //     config.jwt_access_secret,
  //   );

  //   if (!verifiedToken.success) {
  //     throw new Error(verifiedToken.error);
  //   }
  //   const { id, name, email, role } = verifiedToken.data as JwtPayload;
  //   // const requiredRoles = ["USER", "AUTHOR", "ADMIN"];
  //   const requiredRoles = [Role.USER, Role.AUTHOR, Role.ADMIN];

  //   if (!requiredRoles.includes(role)) {
  //     return res.status(StatusCodes.FORBIDDEN).json({
  //       success: false,
  //       statusCode: StatusCodes.FORBIDDEN,
  //       message:
  //         "Forbidden: You do not have permission to access this resource",
  //     });
  //   }

  //   req.user = { id, name, email, role };
  //   next();
  // },
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  userController.getMyProfile,
);

router.patch(
  "/my-profile",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  userController.updateMyProfile,
);
export const userRoutes = router;
