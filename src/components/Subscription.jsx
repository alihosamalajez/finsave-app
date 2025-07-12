import { useEffect, useState } from "react";
import { useSelector , useDispatch} from "react-redux";
import { toast } from "sonner";
// import { addsubscriptions, editsubscriptions, deletesubscriptions } from "../store/slices/subscriptionSlice";

export default function Subscriptions({ onUpdateExpenses }) {
  const categories = useSelector((state) => state.categories)

  const [subscriptions, setSubscriptions] = useState([]);
  const dispatch = useDispatch()
  const subsc = useSelector((state)=> state)
  console.log(subsc);
  
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    frequency: "monthly",
    startDate: "",
  });

  // ✅ تحميل الاشتراكات وتفعيل التكرار الذكي
  useEffect(() => {
    const existingSubs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const lastAddedMap = JSON.parse(localStorage.getItem("subscriptionLog") || "{}");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    const now = new Date();

    const newExpenses = [];

    existingSubs.forEach((sub, index) => {
      const lastDate = new Date(lastAddedMap[index] || sub.startDate);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

      const due =
        (sub.frequency === "monthly" && diffDays >= 30) ||
        (sub.frequency === "weekly" && diffDays >= 7);

      if (due) {
        newExpenses.push({
          id: Date.now() + index,
          title: sub.title,
          amount: Number(sub.amount),
          category: sub.category,
          date: now.toISOString().split("T")[0],
          note: "تمت إضافته تلقائيًا من الاشتراكات",
        });
        lastAddedMap[index] = now.toISOString();
        toast.success(`✅ تم إضافة ${sub.name} تلقائيًا (${sub.amount}₪)`);
      }
    });

    if (newExpenses.length > 0) {
      const updatedExpenses = [...expenses, ...newExpenses];
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
      localStorage.setItem("subscriptionLog", JSON.stringify(lastAddedMap));
      onUpdateExpenses(updatedExpenses); // إعلام التطبيق بالتحديث
    }

    setSubscriptions(existingSubs);
  }, []);

  // ✅ إرسال النموذج
  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...subscriptions, form];
    localStorage.setItem("subscriptions", JSON.stringify(updated));
    setSubscriptions(updated);
    setForm({ title: "", amount: "", category: "", frequency: "monthly", startDate: "" });
    toast.success("✅ تم إضافة الاشتراك بنجاح");
  };

  const handleDelete = (index)=>{
    const updated = [...subscriptions]
    updated.splice(index , 1)
    localStorage.setItem("subscriptions" , JSON.stringify(updated))
    setSubscriptions(updated)
    toast.success("تم حذف الاشتراك بنجاح 🗑️")
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">🔄 الاشتراكات المتكررة</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="اسم الاشتراك"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="input"
        />
        <input
          type="number"
          placeholder="المبلغ"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          className="input"
        />
        <select
          placeholder="التصنيف"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="input"
        >
          <option value="">التصنيف</option>
          {categories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="input"
        >
          <option value="monthly">شهري</option>
          <option value="weekly">أسبوعي</option>
        </select>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          required
          className="input"
        />
        <button
          type="submit"
          className="col-span-2 md:col-span-1 bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/90"
        >
          ➕ إضافة اشتراك
        </button>
      </form>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">📄 الاشتراكات الحالية:</h3>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500">لا يوجد اشتراكات.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {subscriptions.map((sub, i) => (
              <li key={i} className="border p-2 rounded flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <span>📌 {sub.title} – {sub.amount}₪</span>
                  <span className="text-gray-500">({sub.frequency} • من {sub.startDate})</span>
                </div>
                <button onClick={()=> handleDelete(i)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                  حذف 
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
