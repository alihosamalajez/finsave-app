// 📊 Dashboard.jsx — الصفحة الرئيسية المركزية للتطبيق
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LightBulbIcon, CalendarIcon, CreditCardIcon, UserIcon , PencilIcon , TrashIcon , CheckIcon} from '@heroicons/react/24/outline';
import { ArrowRightIcon} from 'lucide-react';
import DataBackup from '../components/DateBackup';
import SmartRecommendations from '../components/smartRecommedations';
import ExpenseCalendar from '../components/ExpenseCalender';
import { toast } from 'sonner';
import CategoryManager from '../components/CategoryManager';
import Income from '../components/Income'
import SalaryStats from '../components/SalaryStats';


const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    setExpenses(JSON.parse(localStorage.getItem('expenses') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('goals') || '[]'));
    setSubs(JSON.parse(localStorage.getItem('subscriptions') || '[]'));
  }, []);

  const total = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  const stats = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const chartData = Object.keys(stats).map((key) => ({ name: key, value: stats[key] }));

  const lastExpense = expenses[expenses.length - 1];
  const today = new Date().toISOString().split("T")[0];
  const todayExpenses = expenses.filter((e) => e.date === today);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">👋 مرحبًا بك في لوحة التحكم</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="text-sm text-gray-500">إجمالي المصروفات</h3>
          <p className="text-2xl font-bold text-blue-700">₪ {total.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="text-sm text-gray-500">آخر مصروف</h3>
          <p className="text-xl font-semibold text-yellow-600">{lastExpense?.title || 'لا يوجد'} : {lastExpense?.amount ? `₪ ${lastExpense.amount}` : ''}</p>
          {/* <p className="text-sm text-gray-600">{lastExpense?.amount ? `₪ ${lastExpense.amount}` : ''}</p> */}
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="text-sm text-gray-500">مصروفات اليوم</h3>
          <p className="text-xl font-semibold text-green-600">{todayExpenses.length} عملية</p>
        </div>
      </div>
      <SalaryStats />

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl p-4 shadow border">
          <h2 className="text-lg font-semibold mb-3">📊 المصاريف حسب التصنيف</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80}>
                  {chartData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₪ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center">لا يوجد بيانات بعد</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 shadow border">
          <h2 className="text-lg font-semibold mb-3">🎯 الأهداف المالية</h2>
          {goals.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {goals.slice(0, 3).map((g, i) => (
                <li key={i} className="flex justify-between items-center border-b pb-1">
                  <span>{g.title}</span>
                  <span className="text-blue-600">₪{g.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">لا يوجد أهداف بعد</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <Link to="/expenses" className="bg-blue-100 p-4 rounded-xl flex items-center gap-3 hover:bg-blue-200 transition">
          <CreditCardIcon className="w-6 h-6 text-blue-600" />
          إدارة المصاريف
          <ArrowRightIcon className="w-4 h-4 ml-auto text-blue-500" />
        </Link>

        <Link to="/subscription" className="bg-green-100 p-4 rounded-xl flex items-center gap-3 hover:bg-green-200 transition">
          <CalendarIcon className="w-6 h-6 text-green-600" />
          الاشتراكات الشهرية
          <ArrowRightIcon className="w-4 h-4 ml-auto text-green-500" />
        </Link>

        <Link to="/goals" className="bg-yellow-100 p-4 rounded-xl flex items-center gap-3 hover:bg-yellow-200 transition">
          <LightBulbIcon className="w-6 h-6 text-yellow-600" />
          الأهداف المالية
          <ArrowRightIcon className="w-4 h-4 ml-auto text-yellow-500" />
        </Link>
      </div>
      <ExpenseCalendar/>
      <Income/>
      <CategoryManager/>
      <SmartRecommendations/>
      <DataBackup/>
    </div>
  );
};

export default Dashboard;
