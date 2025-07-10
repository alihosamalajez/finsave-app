import { useEffect, useState } from "react";

export default function SmartRecommendations() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    if (expenses.length === 0) return;

    const income = 2500; // دخل تقديري
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const saving = Math.max(0, income - total);
    const percentSaved = Math.round((saving / income) * 100);

    // 🔍 حساب مجموع التصنيفات
    const categoryTotals = {};
    expenses.forEach((e) => {
      const cat = e.category || "غير مصنف";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
    });

    // 🔝 أعلى تصنيف
    const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCats[0];

    // 📅 مقارنة شهرية (اختياري - لو عندك أكثر من شهر)
    const currentMonth = new Date().getMonth();
    const lastMonthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth - 1;
    });
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthDiff = total - lastMonthTotal;
    const monthDiffPercent = lastMonthTotal > 0 ? Math.round((monthDiff / lastMonthTotal) * 100) : 0;

    const rec = [];

    if (topCat && topCat[1] > income * 0.3) {
      rec.push(`⚠️ أنت تصرف أكثر من ${Math.round((topCat[1] / income) * 100)}% على "${topCat[0]}"، جرّب تقليله.`);
    }

    if (monthDiffPercent > 15) {
      rec.push(`📈 صرفك هذا الشهر زاد بنسبة ${monthDiffPercent}% مقارنة بالشهر الماضي.`);
    }

    if (percentSaved < 20) {
      rec.push(`💰 نسبة التوفير منخفضة (${percentSaved}%)، جرّب ادخار على الأقل 25%.`);
    } else {
      rec.push(`🟢 ممتاز! وفرّت ${saving}₪ هذا الشهر (${percentSaved}%).`);
    }

    setTips(rec);
  }, []);

  if (!tips.length) return null;

  return (
    <div className="bg-white p-4 mt-8 rounded shadow space-y-4">
      <h3 className="text-xl font-bold mb-4 text-primary">💡 توصيات ذكية</h3>
      <ul className="list-disc text-gray-700 pl-5 space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}