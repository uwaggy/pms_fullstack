import { RequestHandler, Router } from "express";
import authController from "../controllers/auth.controller";
import {
  InitiateResetPasswordDTO,
  InitiateVerifyEmailDTO,
  LoginDTO,
  ResetPasswordDTO,
  RegisterDTO,
} from "../dtos/auth.dto";
import { checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router();

// Register new user
authRouter.post(
  "/register",
  [validationMiddleware(RegisterDTO)],
  authController.register
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Register a new user'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/definitions/RegisterDTO"
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "User registered successfully",
      schema: {
        $ref: "#/definitions/User"
      }
    }
    #swagger.responses[400] = {
      description: "Bad Request - User already exists or invalid data"
    }
  */
);

authRouter.post(
  "/login",
  [validationMiddleware(LoginDTO)],
  authController.login
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Login user'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/definitions/LoginDTO"
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Login successful",
      schema: {
        $ref: "#/definitions/User"
      }
    }
    #swagger.responses[400] = {
      description: "Bad Request - Invalid credentials"
    }
  */
);

authRouter.put(
  "/initiate-reset-password",
  [validationMiddleware(InitiateResetPasswordDTO)],
  authController.initiateResetPassword
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Initiate password reset'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                format: "email"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Password reset email sent successfully"
    }
  */
);

authRouter.put(
  "/reset-password",
  [validationMiddleware(ResetPasswordDTO)],
  authController.resetPassword
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Reset password with code'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              password: {
                type: "string",
                minLength: 6
              },
              code: {
                type: "string"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Password reset successfully"
    }
  */
);

authRouter.put(
  "/initiate-email-verification",
  [checkLoggedIn],
  [validationMiddleware(InitiateVerifyEmailDTO)],
  authController.initiateEmailVerification
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Initiate email verification'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                format: "email"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Verification email sent successfully"
    }
  */
);

authRouter.put(
  "/verify-email/:code",
  [checkLoggedIn],
  authController.verifyEmail
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Verify email with code'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters[0] = {
      in: "path",
      name: "code",
      required: true,
      type: "string",
      description: "Verification code"
    }
    #swagger.responses[200] = {
      description: "Email verified successfully"
    }
  */
);

export default authRouter;
