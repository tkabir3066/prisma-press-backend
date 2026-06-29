import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.service";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await postService.createPost(payload, id as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All Posts retrieved successfully",
      data: result,
    });
  },
);
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStats();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Post stats retrived successfully",
      data: result,
    });
  },
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const result = await postService.getMyPosts(authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "My posts retrieved successfully",
      data: result,
    });
  },
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post Id required in params");
    }

    const result = await postService.getPostById(postId as string);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Post by Id retrieved successfully",
      data: result,
    });
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const payload = req.body;
    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post Id required in params");
    }
    const result = await postService.updatePost(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Post Updated successfully",
      data: result,
    });
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id required in params");
    }

    await postService.deletePost(postId as string, authorId as string, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Post Deleted successfully",
      data: null,
    });
  },
);

export const postController = {
  createPost,
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
