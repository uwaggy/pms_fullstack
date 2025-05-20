import { compare, compareSync, hash, hashSync } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import {
  sendAccountVerificationEmail,
  sendPaswordResetEmail,
} from "../utils/mail";


//Handle user login by validating email and password, comparing the hashed password,
//  generating a JWT token if valid, and returning a success response with user info and token.
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return ServerResponse.error(res, "Invalid email or password");
    const isMatch = compareSync(password, user.password);
    if (!isMatch) return ServerResponse.error(res, "Invalid email or password");
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" }
    );
    return ServerResponse.success(res, "Login successful", { user, token });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};


//Initiate password reset by generating a 6-digit code with 6-hour expiry,
//  updating the user's record, sending a reset email, and returning a success message.
const initiateResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const passwordResetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6 hours
    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode,
        passwordResetExpires,
      },
    });
    await sendPaswordResetEmail(email, user.firstName, passwordResetCode);
    return ServerResponse.success(
      res,
      "Password reset email sent successfully"
    );
  } catch (error) {
    console.log(error);
    return ServerResponse.error(res, "Error occured", { error });
  }
};


//Reset the user's password by validating the code and expiry, hashing the new password,
//  updating the user's record, clearing the reset data, and returning a success response.
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, code } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        passwordResetCode: code,
        passwordResetExpires: { gte: new Date() },
      },
    });
    if (!user) return ServerResponse.error(res, "Invalid or expired code");
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null,
      },
    });
    return ServerResponse.success(res, "Password reset successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};


//Verify email request by checking if the user exists and is unverified, 
// then generate a 6-digit code with 6-hour expiry, update user with code and status, send a verification email, and return a success response.
const initiateEmailVerification: any = async (req:Request, res:Response) => {
  try {
    const { email } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });


    if (!existingUser) {
      return ServerResponse.error(res, "User with this email not found");
    }

    if (existingUser.verificationStatus === "VERIFIED") {
      return ServerResponse.success(res, "Email is already verified");
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6 hours

    const user = await prisma.user.update({
      where: { email },
      data: {
        verificationCode,
        verificationExpires,
        verificationStatus: "PENDING",
      },
    });

    await sendAccountVerificationEmail(
      user.email,
      user.firstName,
      verificationCode
    );

    return ServerResponse.success(res, "Verification email sent successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};


//Verify the user's email by checking the valid code from URL params, and if found, mark the user as verified, clear
//  the code and expiry, and return a success message.
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code,
        verificationExpires: { gte: new Date() },
      },
    });
    if (!user) return ServerResponse.error(res, "Invalid or expired code");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationStatus: "VERIFIED",
        verificationCode: null,
        verificationExpires: null,
      },
    });
    return ServerResponse.success(res, "Verification successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return ServerResponse.error(res, "User with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = hashSync(password, 10);

    // Create user with essential fields
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: "USER", // Default role
        profilePicture: "https://firebasestorage.googleapis.com/v0/b/relaxia-services.appspot.com/o/relaxia-profiles%2Fblank-profile-picture-973460_960_720.webp?alt=media",
        verificationStatus: "UNVERIFIED",
        passwordResetStatus: "IDLE"
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" }
    );

    return ServerResponse.created(res, "User registered successfully", { user, token });
  } catch (error) {
    console.error("Registration error:", error);
    return ServerResponse.error(res, "Error occurred during registration", { error });
  }
};

// grouping and exports all functions as a single object for use in route handlers.

const authController = {
  login,
  register,
  initiateResetPassword,
  resetPassword,
  initiateEmailVerification,
  verifyEmail,
};



export default authController;
