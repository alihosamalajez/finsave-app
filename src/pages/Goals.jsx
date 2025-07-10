// 🎯 صفحة إدارة الأهداف المالية - GoalsPage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    days: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    setGoals(storedGoals);
  }, []);

  const saveGoal = () => {
    if (!form.title || !form.amount || !form.days) {
      toast.error("❌ جميع الحقول مطلوبة");
      return;
    }

    const updatedGoals = [...goals];
    if (editIndex !== null) {
      updatedGoals[editIndex] = {
        ...form,
        amount: Number(form.amount),
        days: Number(form.days),
        createdAt: updatedGoals[editIndex].createdAt,
      };
      toast.success("✅ تم تعديل الهدف بنجاح");
    } else {
      const newGoal = {
        ...form,
        amount: Number(form.amount),
        days: Number(form.days),
        createdAt: new Date().toISOString(),
      };
      updatedGoals.push(newGoal);
      toast.success("✅ تم إضافة الهدف بنجاح");
    }

    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setForm({ title: '', amount: '', days: '' });
    setEditIndex(null);
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    const goal = goals[index];
    setForm({
      title: goal.title,
      amount: goal.amount,
      days: goal.days,
    });
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const updated = [...goals];
    updated.splice(index, 1);
    setGoals(updated);
    localStorage.setItem('goals', JSON.stringify(updated));
    toast.success("🗑️ تم حذف الهدف بنجاح");
  };

  const filteredGoals = goals.filter(goal => goal.title.includes(search));

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-300 to-pink-300 text-white rounded-lg p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">🎯 إدارة الأهداف المالية</h1>
        <p className="text-sm mb-4">حدد أهدافك المالية وابدأ بتحقيقها خطوة بخطوة. قم بإضافة أو تعديل أو حذف الأهداف بسهولة.</p>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="🔍 ابحث عن هدف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-purple-300 rounded-lg px-4 py-2 text-sm shadow-sm w-full"
          />
          <button
            onClick={() => {
              setEditIndex(null);
              setForm({ title: '', amount: '', days: '' });
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <span className="text-sm">إضافة هدف جديد</span>
          </button>
        </div>
      </div>

      {/* Goals Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4">الهدف</th>
              <th>المبلغ</th>
              <th>المدة (بالأيام)</th>
              <th>تاريخ الإضافة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.map((goal, index) => (
              <tr key={index} className="border-t text-gray-700 hover:bg-gray-50">
                <td className="py-1 px-4">{goal.title}</td>
                <td>{goal.amount} ₪</td>
                <td>{goal.days} يوم</td>
                <td>{new Date(goal.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 left-2 text-gray-400 hover:text-red-500"
            >✕</button>
            <h3 className="text-xl font-bold mb-4">{editIndex !== null ? 'تعديل الهدف' : 'إضافة هدف جديد'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); saveGoal(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">اسم الهدف</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">المبلغ المطلوب</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">المدة (باليوم)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white w-full py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
              >
                {editIndex !== null ? 'تحديث الهدف' : 'إضافة هدف'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
