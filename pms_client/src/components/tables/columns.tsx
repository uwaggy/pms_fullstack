import { ColumnDef } from "@tanstack/react-table";
import { clsx } from "clsx";

export interface Users {
  id?: string;
  names: string;
  email: string;
  role: string;
  telephone: string;
}

export interface Vehicle {
  id?: string;
  plateNumber: string;
  parkingCode: string;
  entryDateTime: string;
  exitDateTime: string | null;
  chargedAmount: number;
  duration?: number;
  ticketNumber?: string;
  billNumber?: string;
}

export interface Requests {
  id?: string;
  userId: string;
  vehicleId: string;
  parkingSlotId?: string;
  checkIn?: string;
  checkOut?: string;
  ticketNumber?: string;
  billNumber?: string;
  duration?: number;
  chargedAmount?: number;
}

export interface Slots {
  id?: string;
  code: string;
  name: string;
  location: string;
  totalSpaces: number;
  availableSpaces: number;
  chargingFee: number;
}

//user columns 
export const userColumns = (): ColumnDef<Users>[] => [
  {
    accessorKey: "names",
    header: "Username",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "telephone",
    header: "Phone number",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => info.getValue(),
  }
];

// VEHICLE COLUMNS
export const vehicleColumns = (): ColumnDef<Vehicle>[] => [
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
  },
  {
    accessorKey: "parkingCode",
    header: "Parking Code",
  },
  {
    accessorKey: "entryDateTime",
    header: "Entry Date/Time",
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "exitDateTime",
    header: "Exit Date/Time",
    cell: (info) => {
      const value = info.getValue() as string | null;
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: (info) => {
      const value = info.getValue() as number;
      if (!value) return "—";
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return `${hours}h ${minutes}m`;
    },
  },
  {
    accessorKey: "chargedAmount",
    header: "Charged Amount",
    cell: (info) => {
      const value = info.getValue() as number;
      return `$${value.toFixed(2)}`;
    },
  },
  {
    accessorKey: "ticketNumber",
    header: "Ticket Number",
    cell: (info) => {
      const value = info.getValue() as string;
      return value || "—";
    },
  },
  {
    accessorKey: "billNumber",
    header: "Bill Number",
    cell: (info) => {
      const value = info.getValue() as string;
      return value || "—";
    },
  },
];

// REQUEST COLUMNS
export const requestColumns = (): ColumnDef<Requests>[] => [
  {
    accessorKey: "parkingSlot.slotNumber",
    header: "Parking Slot",
    cell: (info) => info.getValue() || "Not yet assigned",
  },
  {
    accessorKey: "vehicle.plateNumber",
    header: "Plate Number",
    cell: (info) => info.getValue() || "Not yet assigned",
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
    cell: (info) => {
      const value = info.getValue() as string | null;
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleString(); // Formats to "MM/DD/YYYY, HH:MM:SS"
    },
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: (info) => {
      const value = info.getValue() as string | null;
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "requestedAt",
    header: "Requested date",
    cell: (info) => {
      const value = info.getValue() as string | null;
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as string;

      const statusColor = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={clsx(
            "px-2 py-1 rounded-full text-sm font-medium",
            statusColor[status as keyof typeof statusColor] ||
              "bg-gray-100 text-gray-800"
          )}
        >
          {status}
        </span>
      );
    },
  },
];

// SLOT COLUMNS
export const slotColumns = (): ColumnDef<Slots>[] => [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "totalSpaces",
    header: "Total Spaces",
  },
  {
    accessorKey: "availableSpaces",
    header: "Available Spaces",
    cell: (info) => {
      const value = info.getValue() as number;
      return (
        <span className={clsx(
          "px-2 py-1 rounded-full text-sm font-medium",
          value > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "chargingFee",
    header: "Charging Fee",
    cell: (info) => {
      const value = info.getValue() as number;
      return `$${value.toFixed(2)}/hour`;
    },
  },
];
