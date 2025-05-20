import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";

export interface Vehicle {
  id: string;
  plateNumber: string;
  parkingCode: string;
  entryDateTime: Date;
  exitDateTime: Date | null;
  chargedAmount: number;
  duration: number;
  ticketNumber: string | null;
  billNumber: string | null;
}

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plateNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-green-700"
        >
          Plate Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "parkingCode",
    header: "Parking Code",
  },
  {
    accessorKey: "entryDateTime",
    header: "Entry Time",
    cell: ({ row }) => {
      const date = row.getValue("entryDateTime") as Date;
      return date ? new Date(date).toLocaleString() : "—";
    },
  },
  {
    accessorKey: "exitDateTime",
    header: "Exit Time",
    cell: ({ row }) => {
      const date = row.getValue("exitDateTime") as Date | null;
      return date ? new Date(date).toLocaleString() : "—";
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const minutes = row.getValue("duration") as number;
      if (!minutes) return "—";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    },
  },
  {
    accessorKey: "chargedAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("chargedAmount") as number;
      return amount ? `$${amount.toFixed(2)}` : "—";
    },
  },
  {
    accessorKey: "ticketNumber",
    header: "Ticket",
    cell: ({ row }) => {
      const ticket = row.getValue("ticketNumber") as string | null;
      return ticket || "—";
    },
  },
  {
    accessorKey: "billNumber",
    header: "Bill",
    cell: ({ row }) => {
      const bill = row.getValue("billNumber") as string | null;
      return bill || "—";
    },
  },
]; 