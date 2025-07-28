// صفحة المصاريف بتصميم فخم منسق ✅
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import {
  fetchExpenses,
  addExpensesFirebase,
  deleteExpensesFirebase,
  updateExpensesFirebase,
  updateExpense,
  deleteExpense,
  addExpense,
} from "../store/slices/expensesSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { serverTimestamp, Timestamp } from "firebase/firestore";


export default function Expenses() {
  const dispatch = useDispatch();
  const { data: expenses , loading} = useSelector((state) => state.expenses);
  const { data: categories , loadingcat} = useSelector((state) => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    note: "",
    amount: "",
    category: "",
    date: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      toast.error("يجب ملء جميع الحقول");
      return;
    }
    const user = auth.currentUser;
    if (!user) return;

    const newExpense = {
      title: form.title,
      note: form.note,
      amount: Number(form.amount),
      category: form.category,
      date: form.date || new Date().toISOString().split("T")[0],
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    
    if (editIndex !== null) {
      dispatch(updateExpensesFirebase({ id: editIndex, update: newExpense }));
      dispatch(updateExpense({ id: editIndex, update: newExpense }));
      toast.success("✅ تم تعديل المصروف بنجاح");
    } else {
      dispatch(addExpensesFirebase(newExpense));
      toast.success("✅ تم إضافة المصروف بنجاح");
    }

    setForm({ title: "", note: "", amount: "", category: "", date: "" });
    setShowModal(false);
    setEditIndex(null);
  };
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      (exp.title || "").includes(search) ||
      (exp.note || "").includes(search) ||
      (exp.category || "").includes(search) ||
      (exp.date || "").includes(search);

    const matchesCategory = filterCategory
      ? exp.category === filterCategory
      : true;
    const matchesDate = filterDate ? exp.date === filterDate : true;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleDelete = (index) => {
    dispatch(deleteExpensesFirebase(index));
    dispatch(deleteExpense(index));

    toast.success("🗑️ تم حذف المصروف");
  };

  const total = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return (
    <div className=" mx-auto px-4 py-10 bg-white">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          📊 لوحة إدارة المصاريف
        </h1>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="🔍 ابحث بالاسم أو التاريخ أو التصنيف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-300 bg-white rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-blue-300 bg-white rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            className="border border-blue-300 bg-white rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            إضافة مصروف
          </button>
        </div>
      </div>

       <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-2">الاسم</th>
              <th>الوصف</th>
              <th>المبلغ</th>
              <th>التصنيف</th>
              <th>التاريخ</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse text-gray-300">
                    <td className="py-2 px-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </td>
                    <td>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td>
                      <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                    </td>
                  </tr>
                ))
              : filteredExpenses.map((exp, i) => (
                  <tr
                    key={i}
                    className="border-t text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <td className="py-1 px-2">{exp.title}</td>
                    <td className="p-2 font-size-16">{exp.note}</td>
                    <td>{exp.amount} ₪</td>
                    <td>{exp.category}</td>
                    <td>{exp.date}</td>
                    <td>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setForm(exp);
                            setEditIndex(expenses[i].id);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expenses[i].id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <span>المجموع الظاهر حاليًا: </span>
        {loading ? <span className=" bg-gray-200 rounded animate-pulse pl-10 pt-0 mr-2"></span> : <span className="font-bold text-gray-800"> {" "+ total} ₪</span>}
        
      </div>

      {/* Modal الإضافة/التعديل */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold">
                {editIndex !== null
                  ? "✏️ تعديل المصروف"
                  : "➕ إضافة مصروف جديد"}
              </Dialog.Title>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1">الاسم</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">الوصف</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">المبلغ</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">التصنيف</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">اختر تصنيف</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">التاريخ</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white w-full py-2 rounded hover:bg-blue-700 transition"
              >
                {editIndex !== null ? "تحديث المصروف" : "إضافة"}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
