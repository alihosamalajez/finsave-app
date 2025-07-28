import { useSelector } from "react-redux";

// 📅 دالة مساعدة لفحص هل التاريخ ضمن الشهر الحالي
const isThisMonth = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  );
};

export default function SalaryStats() {
  const salaries = useSelector((state) => state.incomes.data); // [{amount, date, type}]
  const expenses = useSelector((state) => state.expenses.data); // [{amount, date, ...}]

  
  // 🔢 حساب الرواتب حسب الشهر والحساب الكلي
  const totalMonthlySalary = salaries
    .filter((sal) => isThisMonth(sal.date))
    .reduce((sum, sal) => sum + Number(sal.amount), 0);

  const totalAllSalary = salaries.reduce((sum, sal) => sum + Number(sal.amount), 0);

  const totalMonthlyExpenses = expenses
    .filter((exp) => isThisMonth(exp.date))
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const totalAllExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const remainingThisMonth = totalMonthlySalary - totalMonthlyExpenses;
  const overallNet = totalAllSalary - totalAllExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-10">
      <div className="bg-white p-5 rounded-xl shadow space-y-2">
        <h3 className="font-bold text-lg mb-2">📅 هذا الشهر</h3>
        <p>💵 إجمالي الراتب : <span className="font-semibold text-green-600"> {totalMonthlySalary} ₪</span></p>
        <p>💸 المصروفات : <span className="font-semibold text-red-500"> {totalMonthlyExpenses} ₪</span></p>
        <p>🧮 المتبقي :  
          <span className={`font-semibold ${remainingThisMonth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {" "+ remainingThisMonth} ₪
          </span>
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow space-y-2">
        <h3 className="font-bold text-lg mb-2">📊 التحليل الكلي</h3>
        <p>💼 مجموع الرواتب : <span className="font-semibold text-green-700"> {totalAllSalary} ₪</span></p>
        <p>🧾 مجموع المصروفات : <span className="font-semibold text-red-600"> {totalAllExpenses} ₪</span></p>
        <p>🧠 صافي الربح : 
          <span className={`font-semibold ${overallNet >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {" "+ overallNet} ₪
          </span>
        </p>
      </div>
    </div>
  );
}
