// صفحة المصاريف بتصميم فخم منسق ✅
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense , deleteExpense , updateExpense } from "../store/slices/expensesSlice";
import { PlusIcon, XIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Dialog } from "@headlessui/react";
// import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

// const categories = ["سكن", "أكل", "مواصلات", "فواتير", "ترفيه", "أخرى"];

export default function Expenses() {
  const dispatch = useDispatch()
  const expenses = useSelector((state) => state.expenses.data)
  const categories = useSelector((state) => state.categories)
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", note: "", amount: "", category: "", date: "" });
  const [editIndex, setEditIndex] = useState(null);
  // const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(()=>{
    if(expenses.length === 0){
      setForm({title : '' , amount : '', category : '' , date : new Date().toISOString().split('T')[0]})
    }
    // const stored = JSON.parse(localStorage.getItem("categories")) || []
    // setCategories(stored)
  } ,[expenses])
  
  // useEffect(()=>{
  // })
  
 
  const handleSubmit = (e) => { 
    e.preventDefault();

    if(!form.title || !form.amount || !form.date){
      toast.error('يجب ملء جميع الحقول')
      return
    }
    const newExpense = {
      title : form.title,
      note : form.note,
      amount: Number(form.amount),
      category : form.category,
      date: form.date || new Date().toISOString().split("T")[0],
    };

    if (editIndex !== null) {
      dispatch(updateExpense({ndex : editIndex , expense : newExpense}))
      toast.success("✅ تم تعديل المصروف بنجاح");
    } else {
      dispatch(addExpense(newExpense))
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

      const matchesCategory = filterCategory ? exp.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    });

  const handleDelete = (index) => {

    dispatch(deleteExpense(index))
    toast.success("🗑️ تم حذف المصروف");
  };


  const total = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-white">
      {/* رأس الصفحة بشكل فخم */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">📊 لوحة إدارة المصاريف</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="🔍 ابحث بالاسم أو التاريخ أو التصنيف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-blue-300 bg-white rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            className="border border-blue-300 bg-white rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
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

      {/* جدول المصاريف */}
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
            {filteredExpenses.map((exp, i) => (
              <tr key={i} className="border-t text-gray-700 hover:bg-gray-50">
                <td className="py-1 px-2">{exp.title}</td>
                <td>{exp.note}</td>
                <td>{exp.amount} ₪</td>
                <td>{exp.category}</td>
                <td>{exp.date}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setForm(exp);
                        setEditIndex(expenses.indexOf(exp));
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expenses.indexOf(exp))}
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
        <span className="font-bold text-gray-800">{total} ₪</span>
      </div>

      {/* Modal الإضافة/التعديل */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
          <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold">{editIndex !== null ? "✏️ تعديل المصروف" : "➕ إضافة مصروف جديد"}</Dialog.Title>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1">الاسم</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-3 py-2"  />
              </div>
              <div>
                <label className="block mb-1">الوصف</label>
                <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full border rounded px-3 py-2"  />
              </div>
              <div>
                <label className="block mb-1">المبلغ</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full border rounded px-3 py-2"  />
              </div>
              <div>
                <label className="block mb-1">التصنيف</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded px-3 py-2" >
                  <option value="">اختر تصنيف</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">التاريخ</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" className="bg-primary text-white w-full py-2 rounded hover:bg-blue-700 transition">
                {editIndex !== null ? "تحديث المصروف" : "إضافة"}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
