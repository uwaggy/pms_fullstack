import React, { useEffect, useState } from "react";
import DataTable from "../../components/tables";
import {
  slotColumns,
  Slots,
} from "../../components/tables/columns";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import Loader from "../../components/commons/loader";
import { deleteSlot, getAllSlots } from "../../services/slotService";
import CreateEditSlot from "../../components/modals/slot/createEditSlot";

const SlotsPage: React.FC = () => {
  const [slots, setSlots] = useState<Slots[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slots | null>(null);
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : {};
  const UserRole = parsedUser.role?.toLowerCase();

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSlots();
      const { data: { parkingSlots } } = response;
      console.log("Fetched slots:", parkingSlots);
      setSlots(parkingSlots);
    } catch (err) {
      console.error("Slots fetch error:", err);
      setError("Failed to fetch slots");
      toast.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slot: Slots) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  const handleCreateSlot = () => {
    setSelectedSlot(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (slot: Slots) => {
    try {
      await deleteSlot(slot.id || "");
      toast.success("Slot deleted successfully");
      fetchSlots();
    } catch {
      toast.error("Failed to delete slot");
    }
  };

  const handleSuccess = () => {
    fetchSlots();
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-green-700">Slots</h1>

        {/* Admin Create Slot */}
        {UserRole === "admin" && (
          <Button onClick={handleCreateSlot} className="mb-4 mr-2 bg-green-800">
            Create Slot
          </Button>   
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <DataTable<Slots>
          data={slots}
          columns={slotColumns()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          role={UserRole}
          tableType="slots"
        />
      )}

      <CreateEditSlot
        isOpen={isDialogOpen}
        slotToEdit={selectedSlot}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default SlotsPage;
