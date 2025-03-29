import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Diet } from "@/types/types";
import { FileText, Loader2 } from "lucide-react";

export interface PDFData {
  fullName: string;
  dietDate: string;
  weeklyResult: string;
  target: string;
  ogunler: {
    name: string;
    time: string;
    menuItems: string[];
    notes: string;
  }[];
  waterConsumption: string;
  physicalActivity: string;
}

interface DirectPDFButtonProps extends ButtonProps {
  diet?: Diet;
  pdfData?: PDFData;
}

const DirectPDFButton = ({ diet, pdfData, className, ...props }: DirectPDFButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    try {
      setIsLoading(true);
      
      // Load pdfmake and fonts from CDN
      await loadPdfMakeScripts();

      if (!window.pdfMake) {
        throw new Error("pdfMake is not available after loading scripts");
      }

      // Use provided pdfData or create it from diet object
      const pdfDataToUse = pdfData || (diet ? {
        fullName: diet.AdSoyad || "İsimsiz Hasta",
        dietDate: diet.Tarih
          ? new Date(diet.Tarih).toLocaleDateString("tr-TR")
          : "Tarih Belirtilmemiş",
        weeklyResult: diet.Sonuc || "",
        target: diet.Hedef || "",
        ogunler: diet.Oguns.map((ogun) => ({
          name: ogun.name || "",
          time: ogun.time || "",
          menuItems: ogun.items
            .filter((item) => item.besin && item.besin.trim() !== "")
            .map((item) =>
              `${item.miktar || ""} ${item.birim || ""} ${
                item.besin || ""
              }`.trim()
            ),
          notes: ogun.detail || "",
        })),
        waterConsumption: diet.Su || "",
        physicalActivity: diet.Fizik || "",
      } : null);

      if (!pdfDataToUse) {
        throw new Error("No diet data provided");
      }

      console.log("Generating PDF with data:", pdfDataToUse); // Debug info

      // Define the document definition
      const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 60, 40, 60],
        content: [
          // Program title
          {
            text: "KİŞİYE ÖZEL BESLENME PROGRAMI",
            style: "programTitle",
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
          // Patient info and results section
          {
            columns: [
              {
                width: "30%",
                text: "Adı Soyad:",
                style: "label",
              },
              {
                width: "*",
                text: pdfDataToUse.fullName,
                style: "value",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              {
                width: "30%",
                text: "Diyet Tarihi:",
                style: "label",
              },
              {
                width: "*",
                text: pdfDataToUse.dietDate,
                style: "value",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              {
                width: "30%",
                text: "Haftalık Sonuç:",
                style: "label",
              },
              {
                width: "*",
                text: pdfDataToUse.weeklyResult,
                style: "value",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            columns: [
              {
                width: "30%",
                text: "Hedef:",
                style: "label",
              },
              {
                width: "*",
                text: pdfDataToUse.target,
                style: "value",
              },
            ],
            margin: [0, 0, 0, 20],
          },
          // Diet schedule table
          {
            table: {
              headerRows: 1,
              widths: ["20%", "10%", "35%", "35%"],
              body: buildMealTableRows(pdfDataToUse),
            },
            margin: [0, 0, 0, 20],
          },
          // Water consumption
          {
            columns: [
              {
                width: "30%",
                text: "Su Tüketimi:",
                style: "label",
              },
              {
                width: "*",
                text: pdfDataToUse.waterConsumption,
                style: "value",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          // Physical activity
          {
            columns: [
              {
                width: "30%",
                text: "Fiziksel Aktivite:",
                style: "label",
              },
              {
                width: "*",
                text: pdfDataToUse.physicalActivity,
                style: "value",
              },
            ],
            margin: [0, 0, 0, 10],
          },
        ],
        styles: {
          programTitle: {
            fontSize: 16,
            bold: true,
            color: "#1e3a8a",
            margin: [0, 0, 0, 20],
          },
          label: {
            fontSize: 12,
            bold: true,
          },
          value: {
            fontSize: 12,
          },
          tableHeader: {
            fontSize: 12,
            bold: true,
            fillColor: "#f3f4f6",
            margin: [0, 5, 0, 5],
          },
          tableCell: {
            fontSize: 10,
          },
        },
        footer: {
          text: "Diyetisyen Ezgi Evgin Aktaş | Tel: 0546 265 04 40 | E-posta: ezgievgin_dytsyn@hotmail.com",
          alignment: "center",
          fontSize: 8,
          margin: [0, 0, 0, 10],
        },
      };

      // Create and download the PDF
      window.pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error("Error generating PDF:", error);
      let errorMessage = "Bilinmeyen bir hata oluştu";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert("PDF oluşturulurken bir hata oluştu: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to load pdfMake scripts from CDN
  const loadPdfMakeScripts = async () => {
    // Only load if not already loaded
    if (window.pdfMake) {
      return;
    }

    // Load pdfmake.min.js
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load pdfMake script"));
      document.head.appendChild(script);
    });

    // Load vfs_fonts.js
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load vfs_fonts script"));
      document.head.appendChild(script);
    });
  };

  // Helper function to build meal table rows
  function buildMealTableRows(dietData: any) {
    // First row is the header
    const rows = [
      [
        { text: "Öğün", style: "tableHeader" },
        { text: "Saat", style: "tableHeader" },
        { text: "Menü", style: "tableHeader" },
        { text: "Açıklama", style: "tableHeader" },
      ],
    ];

    // Add rows for each meal from the diet data
    if (
      dietData.ogunler &&
      Array.isArray(dietData.ogunler) &&
      dietData.ogunler.length > 0
    ) {
      dietData.ogunler.forEach((ogun: any) => {
        // Ensure we have valid data for each cell
        const name = ogun.name || "";
        const time = ogun.time || "";
        const menuText = formatMenuItems(ogun.menuItems);
        const notes = ogun.notes || "";

        rows.push([
          { text: name, style: "tableCell" },
          { text: time, style: "tableCell" },
          { text: menuText, style: "tableCell" },
          { text: notes, style: "tableCell" },
        ]);
      });
    } else {
      // Add an empty row if no meals data
      rows.push([
        { text: "Veri yok", style: "tableCell" },
        { text: "", style: "tableCell" },
        { text: "", style: "tableCell" },
        { text: "", style: "tableCell" },
      ]);
    }

    return rows;
  }

  // Helper to format menu items
  function formatMenuItems(items: string[] | undefined) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return "";
    }

    // Filter out any empty items and join with newlines
    return items
      .filter((item) => item && item.trim() !== "")
      .map((item) => `- ${item}`)
      .join("\n");
  }

  return (
    <Button
      type="button"
      onClick={generatePDF}
      disabled={isLoading}
      className={`no-print bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 shadow-sm flex items-center px-4 py-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          PDF Yükleniyor...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          Direkt PDF Oluştur
        </>
      )}
    </Button>
  );
};

// Add this to make TypeScript happy with the global pdfMake
declare global {
  interface Window {
    pdfMake: any;
  }
}

export default DirectPDFButton;
