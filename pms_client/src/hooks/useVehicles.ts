import { useState, useEffect } from "react";
import { getAllVehicles } from "../services/vehicleService";
import { Vehicle } from "../pages/vehicles/columns";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await getAllVehicles();
      const { data: { vehicles } } = response;
      setVehicles(vehicles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch vehicles"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
  };
} 