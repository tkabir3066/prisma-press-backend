import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

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
    res.status(StatusCodes.CREATED).json({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User registered successfully",
      data: result,
    });
  },
);
export const userController = {
  registerUser,
};
