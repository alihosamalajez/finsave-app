// 📁 src/pages/Subscriptions.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
// import {
//   addSubscription,
//   deleteSubscription,
//   editSubscription,
//   toggleSubscriptions,
// } from "../store/slices/subscriptionSlice";
import { addExpense, addExpensesFirebase } from "../store/slices/expensesSlice";
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";
import {
  addsubscriptionsFirebase,
  deletesubscriptionsFirebase,
  fetchsubscriptions,
} from "../store/slices/subscriptionSlice";
import { useNavigate } from "react-router-dom";
export default function Subscriptions() {
  const categories = useSelector((state) => state.categories.data);
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    frequency: "monthly",
    startDate: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const subscriptions = useSelector((state) => state.subscriptions.data);
  
  
  

    useEffect(() => {
      // const lastAddedMap = JSON.parse(
        //   localStorage.getItem("subscriptionLog") || "{}"
        // );
        const now = new Date();
        const toDayStr = now.toISOString().split("T")[0]
        // const updatedLog = { ...lastAddedMap };

      subscriptions.forEach(async (sub) => {
        if (!sub.active) return;

        if(sub.lastAddedDate === toDayStr) return

        const lastDateStr = sub.lastAddedDate || sub.startDate
        if(!lastDateStr) return

        const lastDate = new Date(lastDateStr);
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

        const due =
        (sub.frequency === "monthly" && diffDays >= 30) ||
        (sub.frequency === "weekly" && diffDays >= 7);

        if (due) {
          dispatch(
            addExpensesFirebase({
              title: sub.title,
              amount: Number(sub.amount),
              category: sub.category,
              date: now.toISOString().split("T")[0],
              note: "تمت إضافته تلقائيًا من الاشتراك",
            })
          );

          const {doc , updateDoc} = await import('firebase/firestore')
          const {db} = await import('../firebase')

          await updateDoc(doc(db , "subscriptions" , sub.id) , {
            lastAddedDate  : toDayStr
          })

          toast.success(`✅ تمت إضافة ${sub.title} تلقائيًا (${sub.amount}₪)`);
          window.location.href = "/expenses"
          // updatedLog[index] = now.toISOString();
        }
    });

    // localStorage.setItem("subscriptionLog", JSON.stringify(updatedLog));
  }, [subscriptions  , dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addsubscriptionsFirebase({ ...form, active: true, lastAddedDate: "" })
    );
    // dispatch(addSubscription({ ...form, active: true }));
    toast.success("✅ تم إضافة الاشتراك بنجاح");
    setForm({
      title: "",
      amount: "",
      category: "",
      frequency: "monthly",
      startDate: "",
    });
  };

  const handleDelete = (id) => {
    dispatch(deletesubscriptionsFirebase(id));
    // dispatch(deleteSubscription(index));
    toast.success("🗑️ تم حذف الاشتراك");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(subscriptions[index]);
  };

  const confirmEdit = () => {
    // dispatch(editSubscription({ index: editIndex, subscription: editForm }));
    toast.success("✏️ تم تعديل الاشتراك");
    setEditIndex(null);
    setEditForm(null);
  };

  const toggleActive = (index) => {
    // dispatch(toggleSubscriptions(index));
  };

  return (
    <div className="mx-auto px-4 py-10 bg-white">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          🔁 الاشتراكات المتكررة
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-lg  mt-6"
        >
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
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="input"
          >
            <option value="">التصنيف</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
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
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">📋 الاشتراكات الحالية:</h3>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500">لا يوجد اشتراكات.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {subscriptions.map((sub, i) => (
              <li
                key={i}
                className="border p-2 rounded flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                {editIndex === i ? (
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="input"
                    />
                    <input
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({ ...editForm, amount: e.target.value })
                      }
                      className="input"
                    />
                    <button onClick={confirmEdit} className="text-green-600">
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="text-red-600"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 w-full">
                    <div className="flex gap-3">
                      <span className="font-bold">
                        📌 {sub.title} - {sub.amount}₪
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        ({sub.frequency} • من {sub.startDate})
                      </span>
                      {!sub.active && (
                        <span className="text-red-500 ml-2">(غير مفعل)</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleActive(i)}
                        className="text-yellow-600"
                      >
                        {sub.active ? "إلغاء التفعيل" : "تفعيل"}
                      </button>
                      <button
                        onClick={() => handleEdit(i)}
                        className="text-blue-500"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subscriptions[i].id)}
                        className="text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
