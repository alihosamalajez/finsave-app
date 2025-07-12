import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon  } from "@heroicons/react/24/solid";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", date: "", type: "ثابت" });
  const [editIndex, setEditIndex] = useState(null);

  // Load income from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("incomes") || "[]");
    setIncomes(stored);
  }, []);

  // Save
  const saveIncome = () => {
    if (!form.name || !form.amount || !form.date) {
      toast.error("❌ جميع الحقول مطلوبة");
      return;
    }

    const updated = [...incomes];
    if (editIndex !== null) {
      updated[editIndex] = { ...form };
      toast.success("✅ تم تعديل الدخل");
    } else {
      updated.push({ ...form });
      toast.success("✅ تم إضافة دخل جديد");
    }

    setIncomes(updated);
    localStorage.setItem("incomes", JSON.stringify(updated));
    setForm({ name: "", amount: "", date: "", type: "ثابت" });
    setEditIndex(null);
    setIncomeModalOpen(false);
  };

  const handleEdit = (i) => {
    setForm(incomes[i]);
    setEditIndex(i);
    setIncomeModalOpen(true);
  };

  const handleDelete = (i) => {
    const updated = [...incomes];
    updated.splice(i, 1);
    setIncomes(updated);
    localStorage.setItem("incomes", JSON.stringify(updated));
    toast.success("🗑️ تم حذف الدخل");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow p-6 mb-8 mt-10">
      <div className="" >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">💰 مصادر الدخل</h2>
          <button
            onClick={() => {
              setEditIndex(null);
              setForm({ name: "", amount: "", date: "", type: "ثابت" });
              setIncomeModalOpen(true);
            }}
            className="flex items-center gap-1 text-white bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700"
          >
            <PlusIcon className="w-4 h-4" />
            إضافة دخل
          </button>
        </div>

        {incomes.length === 0 ? (
          <p className="text-sm text-gray-500">لا يوجد دخل بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-2 px-3">الاسم</th>
                  <th>المبلغ</th>
                  <th>التاريخ</th>
                  <th>النوع</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((inc, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="py-1 px-3">{inc.name}</td>
                    <td>{inc.amount} ₪</td>
                    <td>{inc.date}</td>
                    <td>{inc.type}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(i)} className="text-blue-600 hover:text-blue-800">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(i)} className="text-red-600 hover:text-red-800">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Modal */}
      {incomeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <button
                onClick={() => {
                setIncomeModalOpen(false);
                setEditIndex(null); // إذا بدك ترجع الحالة لوضع الإضافة
            }}
              className="absolute top-3 left-3 text-gray-500 hover:text-red-500"
            >
                <XIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">
              {editIndex !== null ? "✏️ تعديل الدخل" : "➕ إضافة دخل جديد"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveIncome();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="اسم الدخل"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="المبلغ"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="ثابت">ثابت</option>
                <option value="متغير">متغير</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                {editIndex !== null ? "💾 حفظ التعديلات" : "➕ إضافة الدخل"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
