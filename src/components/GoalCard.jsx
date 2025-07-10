import { motion } from "framer-motion";

export default function GoalCard({ goal, currentSaving ,onEdit , onDelete }) {
  const { title, amount, days, createdAt } = goal;
  const target = Number(amount);
  const progress = Math.min(currentSaving / target, 1);
  const created = new Date(createdAt);
  const now = new Date();
  const passedDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(days - passedDays, 0);

  const status =
    progress >= 1
      ? "🎉 اكتمل الهدف!"
      : progress >= passedDays / days
      ? "✅ على الطريق الصحيح"
      : "⚠️ متأخر عن الجدول";

  return (
    <motion.div
      className="bg-white shadow p-4 rounded-xl border"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 {title}</h3>
      <p className="text-sm text-gray-600 mb-1">الهدف: {target}₪</p>
      <p className="text-sm text-gray-600 mb-1">الأيام المتبقية: {remainingDays}</p>
      <div className="w-full bg-gray-200 h-3 rounded mt-2 mb-1 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-2 text-sm">
      <span className="">الحالة: {status}</span>
      <div className="space-x-2 rtl:space-x-reverse">
        <button className="text-blue-600 hover:underline ml-2" onClick = {onEdit}>تعديل</button>
        <button className="text-red-600 hover:underline" onClick = {onDelete}>حذف</button>
      </div> 
      </div>
    </motion.div>
  );
}
