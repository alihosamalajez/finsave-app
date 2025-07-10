import { useEffect, useState } from "react";

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export default function ExpenseCalendar() {
  const [daysData, setDaysData] = useState([]);

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const now = new Date();
    const daysInMonth = getDaysInMonth(now.getMonth(), now.getFullYear());

    const dailyTotals = Array(daysInMonth).fill(0);
    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        const day = d.getDate() - 1;
        dailyTotals[day] += e.amount;
      }
    });

    setDaysData(dailyTotals);
  }, []);

  const getColor = (amount) => {
    if (amount === 0) return "bg-gray-100 text-gray-500";
    if (amount < 50) return "bg-green-100 text-green-700";
    if (amount < 150) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h3 className="text-xl font-bold mb-4 text-primary">📅 تقويم مصاريف الشهر</h3>
      <div className="grid grid-cols-7 gap-2">
        {daysData.map((amount, i) => (
          <div
            key={i}
            className={`h-24 rounded-lg p-2 text-sm font-medium flex flex-col justify-between items-center shadow ${getColor(amount)}`}
          >
            <span className="text-xs text-gray-600">{i + 1} يوليو</span>
            <span className="text-base font-bold">{amount > 0 ? `₪${amount}` : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}