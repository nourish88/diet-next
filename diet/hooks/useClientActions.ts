import { useState } from "react";

interface ClientData {
  name: string;
  surname: string;
  birthdate?: string | Date | null;
  phoneNumber?: string;
  notes?: string;
}

export const useClientActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (clientData: ClientData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create client");
      }

      const data = await response.json();
      return data.client;
    } catch (err: any) {
      console.error("Error creating client:", err);
      setError(err.message || "An error occurred while creating the client");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getClients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/clients");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get clients");
      }

      const data = await response.json();
      return data.clients;
    } catch (err: any) {
      console.error("Error getting clients:", err);
      setError(err.message || "An error occurred while getting clients");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getClient = async (clientId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clients/${clientId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get client");
      }

      const data = await response.json();
      return data.client;
    } catch (err: any) {
      console.error("Error getting client:", err);
      setError(err.message || "An error occurred while getting the client");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (
    clientId: number,
    clientData: Partial<ClientData>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update client");
      }

      const data = await response.json();
      return data.client;
    } catch (err: any) {
      console.error("Error updating client:", err);
      setError(err.message || "An error occurred while updating the client");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (clientId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete client");
      }

      return true;
    } catch (err: any) {
      console.error("Error deleting client:", err);
      setError(err.message || "An error occurred while deleting the client");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
    isLoading,
    error,
  };
};

export default useClientActions;
