import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import prisma from "../../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";

// verify that a user is logged in by checking and validating their JWT token from the request headers.
export const checkLoggedIn = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // extracts the token from the Authorization header.
    let token = req.headers.authorization;

    if (!token) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }
    //Checks if the token exists and is in the correct "Bearer" format.
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.split(" ")[1];
    }
    //Verifies the token using a secret key.
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (!decoded) {
      return ServerResponse.unauthenticated(res, "You are not logged in");
    }

    req.user = { id: (decoded as any).id };
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return ServerResponse.error(res, "Invalid or expired token");
  }
};

//ensure that the logged-in user is an admin before allowing access to certain routes.
export const checkAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return ServerResponse.unauthorized(res, "You are not an admin");
    }

    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    //Uses the decoded user ID to fetch the user from the database.
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).id },
    });

    if (!user) {
      return ServerResponse.unauthorized(res, "User not found");
    }
    //Checks if the user's role is "ADMIN".
    //If the user is admin, attaches the user ID to req.user and proceeds.
    if (user.role !== "ADMIN") {
      return ServerResponse.unauthorized(
        res,
        "You're not allowed to access this resource"
      );
    }

    req.user = { id: user.id };
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return ServerResponse.error(res, "Internal server error");
  }
};

