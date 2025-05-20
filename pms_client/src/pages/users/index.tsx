import DataTable from "../../components/tables";
import { getAllUsers } from "../../services/userService";
import { useEffect, useState } from "react";
import { userColumns, Users } from "../../components/tables/columns";
import Loader from "../../components/commons/loader";
import { toast } from "sonner";

export default function UserPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllUsers();
        const { data: { users } } = response;
        console.log("Fetched users:", users);
        setUsers(users);
      } catch (err) {
        console.error("Users fetch error:", err);
        setError("Failed to fetch users");
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Users</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <Loader />
      ) : (
        <DataTable<Users> 
          data={users} 
          columns={userColumns()} 
          tableType="users"
        />
      )}
    </div>
  );
}
