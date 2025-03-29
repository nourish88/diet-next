import { useState, useEffect } from "react";
import useClientActions from "@/hooks/useClientActions";
import { Loader2 } from "lucide-react";

interface ClientSelectorProps {
  onSelectClient: (clientId: number | null) => void;
  selectedClientId: number | null;
}

interface Client {
  id: number;
  name: string;
  surname: string;
}

const ClientSelector = ({
  onSelectClient,
  selectedClientId,
}: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { getClients, isLoading } = useClientActions();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  return (
    <div className="rounded-lg border-2 border-purple-700 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 border-b border-indigo-800 text-white">
        <h3 className="text-lg font-medium">Müşteri Seçimi</h3>
        <p className="text-sm text-blue-100 mt-1">
          Beslenme programını hangi müşteri için hazırlıyorsunuz?
        </p>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mr-2" />
            <span>Müşteriler yükleniyor...</span>
          </div>
        ) : clients.length > 0 ? (
          <select
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedClientId || ""}
            onChange={(e) =>
              onSelectClient(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">-- Müşteri Seçin --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.surname}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-center p-4 text-gray-500">
            <p>Henüz müşteri bulunmuyor.</p>
            <button
              onClick={fetchClients}
              className="mt-2 text-indigo-600 hover:text-indigo-800 underline text-sm"
            >
              Yenile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSelector;
