export const schemas = {
  User: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
      },
      firstName: {
        type: "string",
        example: "John",
      },
      lastName: {
        type: "string",
        example: "Doe",
      },
      telephone: {
        type: "string",
        example: "+250788123456",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN"],
        example: "USER",
      },
      balance: {
        type: "number",
        minimum: 0,
        example: 0,
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CreateUserDTO: {
    type: "object",
    required: ["email", "firstName", "lastName", "password", "role"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
      },
      firstName: {
        type: "string",
        example: "John",
      },
      lastName: {
        type: "string",
        example: "Doe",
      },
      telephone: {
        type: "string",
        example: "+250788123456",
      },
      password: {
        type: "string",
        minLength: 6,
        example: "password123",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN"],
        example: "USER",
      },
      balance: {
        type: "number",
        minimum: 0,
        example: 0,
      },
    },
  },
  UpdateUserDTO: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
      },
      firstName: {
        type: "string",
        example: "John",
      },
      lastName: {
        type: "string",
        example: "Doe",
      },
      telephone: {
        type: "string",
        example: "+250788123456",
      },
      balance: {
        type: "number",
        minimum: 0,
        example: 0,
      },
    },
  },
  Vehicle: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      plateNumber: {
        type: "string",
        pattern: "^RA[A-Z] \\d{3}[A-Z]$",
        example: "RAB 123A",
      },
      color: {
        type: "string",
        example: "blue",
      },
      userId: {
        type: "string",
        format: "uuid",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CreateVehicleDTO: {
    type: "object",
    required: ["plateNumber", "color"],
    properties: {
      plateNumber: {
        type: "string",
        pattern: "^RA[A-Z] \\d{3}[A-Z]$",
        example: "RAB 123A",
      },
      color: {
        type: "string",
        example: "blue",
      },
    },
  },
  UpdateVehicleDTO: {
    type: "object",
    properties: {
      plateNumber: {
        type: "string",
        pattern: "^RA[A-Z] \\d{3}[A-Z]$",
        example: "RAB 123A",
      },
      color: {
        type: "string",
        example: "blue",
      },
    },
  },
  ParkingRequest: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      vehicleId: {
        type: "string",
        format: "uuid",
      },
      parkingSlotId: {
        type: "string",
        format: "uuid",
      },
      checkIn: {
        type: "string",
        format: "date-time",
      },
      checkOut: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      chargedAmount: {
        type: "number",
        minimum: 0,
      },
      status: {
        type: "string",
        enum: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"],
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CreateParkingRequestDTO: {
    type: "object",
    required: ["vehicleId", "checkIn"],
    properties: {
      vehicleId: {
        type: "string",
        format: "uuid",
        example: "64fae6a7c13f0a001f1b1234",
      },
      checkIn: {
        type: "string",
        format: "date-time",
        example: "2024-03-20T08:00:00.000Z",
      },
    },
  },
  UpdateParkingRequestDTO: {
    type: "object",
    properties: {
      status: {
        type: "string",
        enum: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"],
      },
      checkOut: {
        type: "string",
        format: "date-time",
      },
      chargedAmount: {
        type: "number",
        minimum: 0,
      },
    },
  },
  LoginDTO: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
      },
      password: {
        type: "string",
        minLength: 6,
        example: "password123",
      },
    },
  },
  AuthResponse: {
    type: "object",
    properties: {
      token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      user: {
        $ref: "#/components/schemas/User",
      },
    },
  },
}; 