// 📁 src/components/ExportButton.jsx
import { exportPDF } from "../utils/pdfExporter";

const ExportPDFButton = () => {
  const handleExport = () => {
    const goals = JSON.parse(localStorage.getItem("goals") || "[]");
    const subscriptions = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    exportPDF({ goals, subscriptions, expenses });
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      📥 تصدير التقرير PDF
    </button>
  );
};

export default ExportPDFButton;
