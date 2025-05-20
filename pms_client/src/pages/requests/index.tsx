import React, { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/tables";
import {
  requestColumns,
  Requests,
} from "../../components/tables/columns";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import Loader from "../../components/commons/loader";
import CreateEditRequest from "../../components/modals/request/createEditRequest";
import { approveRequest, deleteRequest, rejectRequest, getAllRequests } from "../../services/requestService";
import { BillTicketSection } from "../../components/dashboard/BillTicketSection";

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState<Requests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Requests | null>(null);
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : {};
  const UserRole = parsedUser.role?.toLowerCase();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllRequests();
      const { data: { requests } } = response;
      console.log("Fetched requests:", requests);
      setRequests(requests);
    } catch (err) {
      console.error("Request fetch error:", err);
      setError("Failed to fetch requests");
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleEdit = (request: Requests) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleCreateRequest = () => {
    setSelectedRequest(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (request: Requests) => {
    try {
      await deleteRequest(request.id || "");
      toast.success("Request deleted successfully");
      fetchRequests();
    } catch {
      toast.error("Failed to delete request");
    }
  };

  const handleSuccess = () => {
    fetchRequests();
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id);
      toast.success("Request approved successfully");
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id);
      toast.success("Request rejected successfully");
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Parking Requests</h1>
      
      {/* Bill and Ticket Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Recent Bills & Tickets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.slice(0, 3).map((request) => (
            <BillTicketSection
              key={request.id}
              vehicleId={request.vehicleId}
              ticketNumber={request.ticketNumber}
              billNumber={request.billNumber}
              duration={request.duration}
              chargedAmount={request.chargedAmount}
              entryDateTime={request.checkIn}
              exitDateTime={request.checkOut || undefined}
            />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl text-green-700 font-semibold mb-4">
          {
            UserRole === "admin"
              ? "All Requests"
              : UserRole === "user"
              ? "My Requests"
              : "Requests"
          }
        </h1>

        {/* User Create Request */}
        {UserRole === "user" && (
          <Button onClick={handleCreateRequest} className="mb-4 mr-2 bg-green-800">
            Create Request
          </Button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <DataTable<Requests>
          data={requests}
          columns={requestColumns()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
          role={UserRole}
          tableType="requests"
        />
      )}

      <CreateEditRequest
        isOpen={isDialogOpen}
        requestToEdit={
          selectedRequest
            ? selectedRequest.checkIn && selectedRequest.checkOut
              ? {
                  id: selectedRequest.id,
                  vehicleId: selectedRequest.vehicleId,
                  checkIn: selectedRequest.checkIn,
                  checkOut: selectedRequest.checkOut,
                }
              : null
            : null
        }
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default RequestPage;
