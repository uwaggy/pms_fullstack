import { ErrorRequestHandler, RequestHandler, Router } from "express";
import userController from "../controllers/user.controller";
import {
  ChangePasswordDTO,
  CreateUserDTO,
  UpdateAvatarDTO,
  UpdateUserDTO,
} from "../dtos/user.dto";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const userRouter = Router();

userRouter.post(
  "/create",
  [validationMiddleware(CreateUserDTO)],
  userController.createUser
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Create a new user'
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
      description: "User created successfully",
      schema: {
        $ref: "#/definitions/User"
      }
    }
  */
);

userRouter.put(
  "/update",
  [checkLoggedIn, validationMiddleware(UpdateUserDTO)],
  userController.updateUser
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update user profile'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              firstName: {
                type: "string",
                minLength: 2,
                maxLength: 50
              },
              lastName: {
                type: "string",
                minLength: 2,
                maxLength: 50
              },
              email: {
                type: "string",
                format: "email"
              },
              telephone: {
                type: "string",
                pattern: "^\\+250\\d{9}$"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "User updated successfully",
      schema: {
        $ref: "#/definitions/User"
      }
    }
  */
);

userRouter.get(
  "/me",
  [checkLoggedIn],
  userController.me
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get current user profile'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "User profile retrieved successfully",
      schema: {
        $ref: "#/definitions/User"
      }
    }
  */
);

userRouter.get(
  "/all",
  [checkAdmin],
  userController.all
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get all users (Admin only)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "Users retrieved successfully",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/User"
        }
      }
    }
  */
);

userRouter.get(
  "/search/:query",
  [checkAdmin],
  userController.searchUser
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Search users by name (Admin only)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters[0] = {
      in: "path",
      name: "query",
      required: true,
      type: "string",
      description: "Search query"
    }
    #swagger.responses[200] = {
      description: "Users found successfully",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/User"
        }
      }
    }
  */
);

userRouter.delete(
  "/me",
  [checkLoggedIn],
  userController.deleteUser
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete current user account'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "User deleted successfully"
    }
  */
);

userRouter.delete(
  "/by-id/:id",
  [checkAdmin],
  userController.deleteById
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete user by ID (Admin only)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters[0] = {
      in: "path",
      name: "id",
      required: true,
      type: "string",
      description: "User ID"
    }
    #swagger.responses[200] = {
      description: "User deleted successfully"
    }
  */
);

userRouter.put(
  "/update-avatar",
  [checkLoggedIn, validationMiddleware(UpdateAvatarDTO)],
  userController.updateAvatar
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update user avatar'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                format: "uri"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Avatar updated successfully",
      schema: {
        $ref: "#/definitions/User"
      }
    }
  */
);

userRouter.put(
  "/update-password",
  [checkLoggedIn, validationMiddleware(ChangePasswordDTO)],
  userController.updatePassword
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update user password'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              oldPassword: {
                type: "string",
                minLength: 6
              },
              newPassword: {
                type: "string",
                minLength: 6
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Password updated successfully"
    }
  */
);

export default userRouter;
