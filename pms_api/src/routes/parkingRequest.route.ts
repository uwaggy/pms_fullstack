import { Router } from "express";
import parkingRequestController from "../controllers/parkingRequest.controller";
import { CreateParkingRequestDTO, UpdateParkingRequestDTO } from "../dtos/parkingRequest.dto";
import { checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const parkingRequestRouter = Router();

// Register car entry
parkingRequestRouter.post(
  "/entry",
  [checkLoggedIn, validationMiddleware(CreateParkingRequestDTO)],
  parkingRequestController.registerCarEntry
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Register car entry'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              plateNumber: {
                type: "string",
                pattern: "^[A-Z0-9]{3}-[A-Z0-9]{3}$"
              },
              parkingSlotId: {
                type: "string",
                format: "uuid"
              }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "Car entry registered successfully",
      schema: {
        $ref: "#/definitions/ParkingRequest"
      }
    }
  */
);

// Register car exit
parkingRequestRouter.post(
  "/exit",
  [checkLoggedIn],
  parkingRequestController.registerCarExit
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Register car exit'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              parkingRequestId: {
                type: "string",
                format: "uuid"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Car exit registered successfully",
      schema: {
        $ref: "#/definitions/ParkingRequest"
      }
    }
  */
);

// Get all parking requests
parkingRequestRouter.get(
  "/",
  [checkLoggedIn],
  parkingRequestController.getAllParkingRequests
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Get all parking requests'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "Parking requests retrieved successfully",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/ParkingRequest"
        }
      }
    }
  */
);

// Get parking requests by date range
parkingRequestRouter.post(
  "/date-range",
  [checkLoggedIn],
  parkingRequestController.getParkingRequestsByDateRange
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Get parking requests by date range'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              startDate: {
                type: "string",
                format: "date-time"
              },
              endDate: {
                type: "string",
                format: "date-time"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Parking requests retrieved successfully",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/ParkingRequest"
        }
      }
    }
  */
);

// Get active parking requests
parkingRequestRouter.get(
  "/active",
  [checkLoggedIn],
  parkingRequestController.getActiveParkingRequests
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Get active parking requests'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "Active parking requests retrieved successfully",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/ParkingRequest"
        }
      }
    }
  */
);

// Get parking request by ID
parkingRequestRouter.get(
  "/:id",
  [checkLoggedIn],
  parkingRequestController.getParkingRequestById
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Get parking request by ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters[0] = {
      in: "path",
      name: "id",
      required: true,
      type: "string",
      description: "Parking Request ID"
    }
    #swagger.responses[200] = {
      description: "Parking request retrieved successfully",
      schema: {
        $ref: "#/definitions/ParkingRequest"
      }
    }
  */
);

// Update parking request
parkingRequestRouter.put(
  "/:id",
  [checkLoggedIn, validationMiddleware(UpdateParkingRequestDTO)],
  parkingRequestController.updateParkingRequest
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Update parking request'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters[0] = {
      in: "path",
      name: "id",
      required: true,
      type: "string",
      description: "Parking Request ID"
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]
              },
              checkOut: {
                type: "string",
                format: "date-time"
              },
              chargedAmount: {
                type: "number",
                minimum: 0
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Parking request updated successfully",
      schema: {
        $ref: "#/definitions/ParkingRequest"
      }
    }
  */
);

// Delete parking request
parkingRequestRouter.delete(
  "/:id",
  [checkLoggedIn],
  parkingRequestController.deleteParkingRequest
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Delete parking request'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters[0] = {
      in: "path",
      name: "id",
      required: true,
      type: "string",
      description: "Parking Request ID"
    }
    #swagger.responses[200] = {
      description: "Parking request deleted successfully"
    }
  */
);

// Get user's parking requests
parkingRequestRouter.get(
  "/user/requests",
  [checkLoggedIn],
  parkingRequestController.getUserParkingRequests
  /*
    #swagger.tags = ['Parking Requests']
    #swagger.description = 'Get current user\'s parking requests'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: "User's parking requests retrieved successfully",
      schema: {
        type: "array",
        items: {
          $ref: "#/definitions/ParkingRequest"
        }
      }
    }
  */
);

export default parkingRequestRouter;
