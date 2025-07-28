// 📁 src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logIn } from "../store/slices/authSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  const [error, setError] = useState(" ");
  const defaultCategories = ["فواتير" , "ايجار" ,"مواصلات"]
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(res.user, {
        displayName: form.fullname,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        bio: form.bio,
        avatar: "",
        createAt: new Date(),
      })

      dispatch(logIn(true));
      toast.success("تم التسجيل بنجاح");
      navigate("/dashboard");
      const addDefaults = defaultCategories.map((cat)=>{
        return addDoc(collection(db , "categories"), {
          name : cat,
          userId : res.user.uid
      })
    })
    Promise.all(addDefaults).then(()=>{
      dispatch(fetchCategories(res.user.uid))
    })
      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
        avatar: null,
        bio: "",
      });
      setError("");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        return setError("⚠️ البريد الإلكتروني مستخدم مسبقًا");
      } else {
        setError("حدث خطا اثناء التسجيل");
        console.log(err);
      }
    }

    // مثال على التحقق من وجود البريد مسبقًا
    if (form.email === "test@example.com") {
      return setError("⚠️ البريد الإلكتروني مستخدم مسبقًا");
    }

    setError("");
    console.log("📤 إرسال البيانات:", form);
    // إرسال البيانات للسيرفر هنا
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 relative">
        <h2 className="text-xl font-bold text-center">انشاء حساب جديد</h2>

        <div className="flex justify-center">
          <label htmlFor="avatar" className="cursor-pointer relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  صورة
                </div>
              )}
            </div>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-primary hidden group-hover:block">
              نغيير الصورة
            </span>
          </label>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullname"
            type="text"
            placeholder="الاسم الكامل"
            value={form.fullname}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="username"
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="البريد الالكتروني"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />

          {<p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
          >
            انشاء الحساب
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          لديك حساب ؟{" "}
          <Link to="/login" className="text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>

    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    //   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
    //     <form
    //       onSubmit={handleSubmit}
    //       className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md space-y-4"
    //     >
    //       <h2 className="text-xl font-bold text-center">تسجيل الدخول</h2>

    //       <div
    //         onClick={() => fileInputRef.current.click()}
    //         className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow cursor-pointer hover:ring-2 ring-primary transition"
    //       >
    //         {previewUrl ? (
    //           <img
    //             src={previewUrl}
    //             alt="Avatar"
    //             className="w-full h-full object-cover"
    //           />
    //         ) : (
    //           <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
    //             اختر صورة
    //           </div>
    //         )}
    //       </div>

    //       <input
    //         type="text"
    //         placeholder="كلمة المرور"
    //         value={form.password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //         className="w-full border rounded-lg p-2"
    //       />
    //       <textarea
    //         name="bio"
    //         value={form.bio}
    //         onChange={handleChange}
    //         placeholder="نبذة قصيرة عنك"
    //         className="w-full border rounded px-3 py-2"
    //         rows={3}
    //       />
    //       <button
    //         type="submit"
    //         className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition"
    //       >
    //         دخول
    //       </button>
    //       {error && (
    //         <p className="text-center text-red-600">
    //           خطا في الايميل او كلمة المرور
    //         </p>
    //       )}
    //     <div className="text-sm text-gray-600 mt-4">
    //       لديك حساب بالفعل؟{" "}
    //       <a href="/login" className="text-blue-600 hover:underline">
    //         تسجيل الدخول
    //       </a>
    //     </div>

    //     </form>
    //   </div>
    // </div>
  );
}
