import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const result = await userService.registerUserIntoDB(req.body);
//     res.status(StatusCodes.CREATED).json({
//       success: true,
//       statusCode: StatusCodes.CREATED,
//       message: "User registered successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: "Failed to register user",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.registerUserIntoDB(req.body);
    // res.status(StatusCodes.CREATED).json({
    //   success: true,
    //   statusCode: StatusCodes.CREATED,
    //   message: "User registered successfully",
    //   data: result,
    // });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User registered successfully",
      data: result,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // // const cookies = req.cookies;
    // const { accessToken } = req.cookies;
    // // const verifiedToken = jwt.verify(accessToken, config.jwt_access_secret);
    // const verifiedToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret,
    // );

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }
    const profile = await userService.getMyProfileFromDB(
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Profile fetched successfully",
      data: profile,
    });
  },
);
const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedProfile = await userService.updateMyProfileInDB(
      req.user?.id as string,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User Profile updated successfully",
      data: updatedProfile,
    });
  },
);
export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
