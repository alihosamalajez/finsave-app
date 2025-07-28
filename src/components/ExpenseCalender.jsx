

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useSelector } from "react-redux";

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export default function ExpenseCalendar() {
  const [daysData, setDaysData] = useState([]);
  const [expensesByDay, setExpensesByDay] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const expenses = useSelector((state) => state.expenses.data); // [{amount, date, ...}]

  useEffect(() => {

    const now = new Date();
    const daysInMonth = getDaysInMonth(now.getMonth(), now.getFullYear());

    const dailyTotals = Array(daysInMonth).fill(0);
    const dayMap = {};

    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        const day = d.getDate() - 1;
        dailyTotals[day] += Number(e.amount);

        if (!dayMap[day]) dayMap[day] = [];
        dayMap[day].push(e);
      }
    });

    setDaysData(dailyTotals);
    setExpensesByDay(dayMap);
  }, [expenses]);

  const getColor = (amount) => {
    if (amount === 0) return "bg-gray-100 text-gray-500";
    if (amount < 50) return "bg-green-100 text-green-700";
    if (amount < 150) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleDayClick = (dayIndex) => {
    const expenses = expensesByDay[dayIndex] || [];
    setSelectedDay(dayIndex + 1);
    setSelectedExpenses(expenses);
  };

  return (
    <div className="mx-auto mt-10">
      <h3 className="text-xl font-bold mb-4 text-primary">📅 تقويم مصاريف الشهر</h3>
      <div className="grid grid-cols-7 gap-2">
        {daysData.map((amount, i) => (
          <div
            key={i}
            onClick={() => handleDayClick(i)}
            className={`h-24 cursor-pointer rounded-lg p-2 text-sm font-medium flex flex-col justify-between items-center shadow transition hover:scale-[1.02] ${getColor(amount)}`}
          >
            <span className="text-xs text-gray-600">{i + 1} يوليو</span>
            <span className="text-base font-bold">{amount > 0 ? `₪${amount}` : "—"}</span>
          </div>
        ))}
      </div>

      {/* ✅ Popup Modal للتفاصيل */}
      <Dialog open={selectedDay !== null} onClose={() => setSelectedDay(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <Dialog.Title className="text-lg font-bold text-primary">
              🧾 تفاصيل يوم {selectedDay} يوليو
            </Dialog.Title>

            {selectedExpenses.length === 0 ? (
              <p className="text-sm text-gray-500">لا توجد مصاريف مسجلة لهذا اليوم.</p>
            ) : (
              <ul className="text-sm space-y-2">
                {selectedExpenses.map((e, i) => (
                  <li key={i} className="border p-2 rounded flex justify-between items-center bg-gray-50">
                    <div>
                      <div className="font-semibold">{e.title}</div>
                      <div className="text-xs text-gray-500">{e.category}</div>
                    </div>
                    <div className="text-red-600 font-bold">₪{e.amount}</div>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-end">
              <button
                onClick={() => setSelectedDay(null)}
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
              >
                إغلاق
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
