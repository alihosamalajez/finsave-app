// 📁 src/pages/Signup.jsx
import React, { useState } from "react";
// import { register } from "../services/authService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  //   try {
  //     await register(form.email, form.password);
  //     toast.success("✅ تم إنشاء الحساب");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     toast.error(`❌ ${err.message}`);
  //   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">إنشاء حساب جديد</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full border rounded-lg p-2"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
        >
          إنشاء حساب
        </button>
      </form>
    </div>
  );
}
