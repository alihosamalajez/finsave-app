import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#EC4899"];

export default function AdvancedStatistics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [dailyTrends, setDailyTrends] = useState([]);
  const [highestDay, setHighestDay] = useState(null);
  const [topCategory, setTopCategory] = useState(null);
  const [averageMonthly, setAverageMonthly] = useState(0);
  const [averageDaily, setAverageDaily] = useState(0);

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const subs = JSON.parse(localStorage.getItem("subscriptions") || "[]");

    const monthlyTotals = {};
    const monthSet = new Set();
    expenses.forEach((exp) => {
      if (!exp.date || !exp.amount) return;
      const dateObj = new Date(exp.date);
      const monthLabel = dateObj.toLocaleString("ar", { month: "short", year: "numeric" });
      if (!monthlyTotals[monthLabel]) monthlyTotals[monthLabel] = 0;
      monthlyTotals[monthLabel] += Number(exp.amount);
      monthSet.add(monthLabel);
    });
    const formattedMonthly = Object.entries(monthlyTotals).map(([month, total]) => ({ الشهر: month, الإجمالي: total }));
    setMonthlyData(formattedMonthly);

    const monthsCount = monthSet.size || 1;
    const totalSpent = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);
    setAverageMonthly((totalSpent / monthsCount).toFixed(2));

    const categoryTotals = {};
    expenses.forEach((exp) => {
      const cat = exp.category || "غير محدد";
      if (!categoryTotals[cat]) categoryTotals[cat] = 0;
      categoryTotals[cat] += Number(exp.amount);
    });
    const formattedCategories = Object.entries(categoryTotals).map(([cat, total]) => ({ name: cat, value: total }));
    setCategoryData(formattedCategories);

    const dailyTotals = {};
    const daySet = new Set();
    expenses.forEach((exp) => {
      const day = new Date(exp.date).toLocaleDateString("ar");
      if (!dailyTotals[day]) dailyTotals[day] = 0;
      dailyTotals[day] += Number(exp.amount);
      daySet.add(day);
    });
    const dailyArray = Object.entries(dailyTotals).map(([date, total]) => ({ date, total }));
    setDailyTrends(dailyArray);

    const daysCount = daySet.size || 1;
    const totalDailySpent = Object.values(dailyTotals).reduce((a, b) => a + b, 0);
    setAverageDaily((totalDailySpent / daysCount).toFixed(2));

    if (dailyArray.length > 0) {
      const highest = dailyArray.reduce((max, curr) => (curr.total > max.total ? curr : max), dailyArray[0]);
      setHighestDay(highest);
    }

    if (formattedCategories.length > 0) {
      const top = formattedCategories.reduce((max, curr) => (curr.value > max.value ? curr : max), formattedCategories[0]);
      setTopCategory(top);
    }

    setSubscriptionCount(subs.length);
  }, []);

  const boxStyle = "bg-white rounded-xl shadow p-4 text-center h-full";
  const headingStyle = "text-base font-bold text-primary mb-2";
  const valueStyle = "text-xl font-extrabold text-gray-700";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className={boxStyle}>
          <h2 className={headingStyle}>📊 إجمالي المصاريف حسب الشهر</h2>
          {monthlyData.length === 0 ? <p className="text-gray-500">لا توجد بيانات.</p> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="الشهر" />
                <YAxis />
                <Tooltip formatter={(v) => `${v} ₪`} />
                <Bar dataKey="الإجمالي" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className={boxStyle}>
          <h2 className={headingStyle}>📂 المصاريف حسب التصنيف</h2>
          {categoryData.length === 0 ? <p className="text-gray-500">لا توجد بيانات.</p> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} ₪`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={boxStyle}>
          <h2 className={headingStyle}>📈 تطور الإنفاق اليومي</h2>
          {dailyTrends.length === 0 ? <p className="text-gray-500">لا توجد بيانات.</p> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v) => `${v} ₪`} />
                <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={boxStyle}>
            <h2 className={headingStyle}>📅 أعلى يوم إنفاق</h2>
            {highestDay ? (
              <p className={valueStyle}>{highestDay.date} - {highestDay.total} ₪</p>
            ) : <p className="text-gray-500">لا توجد بيانات</p>}
          </div>
          <div className={boxStyle}>
            <h2 className={headingStyle}>🏆 أكثر تصنيف استخدامًا</h2>
            {topCategory ? (
              <p className={valueStyle}>{topCategory.name} - {topCategory.value} ₪</p>
            ) : <p className="text-gray-500">لا توجد بيانات</p>}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={boxStyle}>
          <h2 className={headingStyle}>📆 متوسط المصروف الشهري</h2>
          <p className={valueStyle}>{averageMonthly} ₪</p>
        </div>
        <div className={boxStyle}>
          <h2 className={headingStyle}>🗓️ متوسط المصروف اليومي</h2>
          <p className={valueStyle}>{averageDaily} ₪</p>
        </div>
      </div>

      <div className={boxStyle}>
        <h2 className={headingStyle}>📦 عدد الاشتراكات النشطة</h2>
        <p className="text-3xl font-extrabold text-green-500">{subscriptionCount}</p>
      </div>
    </div>
  );
}
