// 📁 src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// import { login } from "../services/authService";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        dispatch(logIn(true));
        const user = userCredential.user;
        console.log(user);

        toast.success("✅ تم تسجيل الدخول");
        navigate("/dashboard");
      })
      .catch((error) => {
        setError(true);
        console.log(error);
      });

    // try {
    //   await login(form.email, form.password);
    // } catch (err) {
    //   toast.error(`❌ ${err.message}`);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">تسجيل الدخول</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // required
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // required
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition"
        >
          دخول
        </button>
        {error && (
          <p className="text-center text-red-600">
            خطا في الايميل او كلمة المرور
          </p>
        )}
      <p className=" text-sm text-gray-600 text-center">
        ليس لديك حساب ؟{" "}
        <Link to="/register" className="text-primary hover:underline">
          انشاء الحساب{" "}
        </Link>
      </p>
      </form>
    </div>
  );
}
