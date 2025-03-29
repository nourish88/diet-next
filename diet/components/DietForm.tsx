"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import DietHeader from "./DietHeader";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formSchema } from "../schemas/formSchema";
import { Diet, Ogun } from "../types/types";

import DietTable from "./DietTable";

import { initialDiet } from "../models/dietModels";
import DietFormActions from "./DietFormActions";
import DietFormBasicFields from "./DietFormBasicFields";
import { create } from "zustand";
// import { useDietActions } from "../hooks/useDietActions";
// import { useClientActions } from "../hooks/useClientActions";
import { ToastContainer } from "./ui/toast";
import { useToast } from "./ui/use-toast";
// import ClientSelector from "./ClientSelector";

export const useFontStore = create<{
  fontSize: number;
  increase: () => void;
  decrease: () => void;
}>(
  (
    set: (
      updater: (state: { fontSize: number }) => { fontSize: number }
    ) => void
  ) => ({
    fontSize: 16,
    increase: () => set((state) => ({ fontSize: state.fontSize + 1 })),
    decrease: () => set((state) => ({ fontSize: state.fontSize - 1 })),
  })
);

// Interface for the ClientSelector component
interface ClientSelectorProps {
  onSelectClient: (clientId: number | null) => void;
  selectedClientId: number | null;
}

// Placeholder ClientSelector component
const ClientSelector = ({
  onSelectClient,
  selectedClientId,
}: ClientSelectorProps) => (
  <div className="rounded-lg border-2 border-purple-700 bg-white shadow-sm overflow-hidden">
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 border-b border-indigo-800 text-white">
      <h3 className="text-lg font-medium">Müşteri Seçimi</h3>
      <p className="text-sm text-blue-100 mt-1">
        Müşteri seçimi geçici olarak devre dışı
      </p>
    </div>
    <div className="p-6">
      <p>Veritabanı yapılandırma aşamasında</p>
    </div>
  </div>
);

const DietForm = () => {
  const [diet, setDiet] = useState<Diet>(initialDiet);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [contextId] = useState(0);

  // Disable for initial deployment
  // const { toast, toasts, dismiss } = useToast();
  // const { saveDiet, isLoading: isSaving } = useDietActions(selectedClientId || 0);
  const { toast, toasts, dismiss } = {
    toast: () => {},
    toasts: [],
    dismiss: () => {},
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const { fontSize } = useFontStore();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleAddOgun = () => {
    const newOgun: Ogun = {
      name: "",
      time: "",
      items: [],
      detail: "",
      order: diet.Oguns.length + 1,
    };
    setDiet((prev) => ({
      ...prev,
      Oguns: [...prev.Oguns, newOgun],
    }));
  };

  const handleRemoveOgun = (index: number) => {
    setDiet((prev) => ({
      ...prev,
      Oguns: prev.Oguns.filter((_, idx) => idx !== index),
    }));
  };

  const handleOgunChange = (
    index: number,
    field: keyof Ogun,
    value: string
  ) => {
    setDiet((prev) => ({
      ...prev,
      Oguns: prev.Oguns.map((ogun, idx) =>
        idx === index ? { ...ogun, [field]: value } : ogun
      ),
    }));
  };

  // Check how menu items are being added
  const handleAddMenuItem = (ogunIndex: number) => {
    setDiet((prev) => ({
      ...prev,
      Oguns: prev.Oguns.map((ogun, idx) =>
        idx === ogunIndex
          ? {
              ...ogun,
              items: [...ogun.items, { birim: "", miktar: "", besin: "" }],
            }
          : ogun
      ),
    }));
  };

  const handleMenuItemChange = (
    ogunIndex: number,
    itemIndex: number,
    field: string,
    value: string
  ) => {
    console.log(
      `Updating menu item: ogun=${ogunIndex}, item=${itemIndex}, ${field}=${value}`
    );

    setDiet((prev) => {
      const newDiet = {
        ...prev,
        Oguns: prev.Oguns.map((ogun, idx) =>
          idx === ogunIndex
            ? {
                ...ogun,
                items: ogun.items.map((item, itemIdx) =>
                  itemIdx === itemIndex ? { ...item, [field]: value } : item
                ),
              }
            : ogun
        ),
      };

      console.log("Updated diet state:", newDiet);
      return newDiet;
    });
  };

  const generatePDF = async () => {
    const element = document.getElementById("content");
    console.log("Generating PDF with diet data:", diet);

    if (!element) {
      console.error("Element with id 'content' not found.");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Adjust the image height to fit within A4 page height if necessary
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    if (heightLeft <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save("diet-plan.pdf");
  };

  const handleSaveToDB = async () => {
    // Temporary placeholder for database saving
    alert("Database saving temporarily disabled for deployment testing.");
    // Original code commented out for now
    /*
    if (!selectedClientId) {
      toast({
        title: "Hata",
        description: "Lütfen önce bir müşteri seçin",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await saveDiet(diet);

      if (result) {
        toast({
          title: "Başarılı",
          description: "Beslenme programı veritabanına kaydedildi.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Veritabanına kaydetme hatası:", error);
      toast({
        title: "Hata",
        description: "Veritabanına kaydetme sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
    */
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div style={{ fontSize: `${fontSize}px` }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DietHeader />

            <div className="mb-4">
              <ClientSelector
                onSelectClient={(clientId) => setSelectedClientId(clientId)}
                selectedClientId={selectedClientId}
              />
            </div>

            <div className="mb-8">
              <DietFormBasicFields form={form} diet={diet} setDiet={setDiet} />
            </div>

            <div id="content" className="mb-8">
              <DietTable
                setDiet={setDiet}
                diet={diet}
                contextId={contextId}
                fontSize={fontSize}
                handleOgunChange={handleOgunChange}
                handleRemoveOgun={handleRemoveOgun}
                handleAddMenuItem={handleAddMenuItem}
                handleMenuItemChange={handleMenuItemChange}
              />
            </div>

            <div className="flex space-x-4 mt-8">
              <DietFormActions
                onAddOgun={handleAddOgun}
                onGeneratePDF={generatePDF}
                dietData={{
                  fullName: diet.AdSoyad,
                  dietDate: diet.Tarih ? diet.Tarih.toString() : "",
                  weeklyResult: diet.Sonuc,
                  target: diet.Hedef,
                  ogunler: diet.Oguns.map((ogun) => ({
                    name: ogun.name,
                    time: ogun.time,
                    menuItems: ogun.items
                      .filter((item) => item.besin && item.besin.trim() !== "")
                      .map((item) =>
                        `${item.miktar || ""} ${item.birim || ""} ${
                          item.besin || ""
                        }`.trim()
                      ),
                    notes: ogun.detail,
                  })),
                  waterConsumption: diet.Su,
                  physicalActivity: diet.Fizik,
                }}
                diet={diet}
                clientId={selectedClientId || undefined}
                onSaveToDatabase={handleSaveToDB}
              />
            </div>
          </form>
        </Form>
      </div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default DietForm;
