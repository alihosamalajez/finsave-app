import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaList,
  FaChartPie,
  FaRobot,
  FaCogs,
  FaBullseye,
  FaRedoAlt,
  FaDashcube,
  FaSignOutAlt,
  FaMoon,
  FaLanguage,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

import defaultAvatar from "../images/avatar.png"; // تأكد من وجود الصورة
import { logOut } from "../store/slices/authSlice";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { resetExpenses } from "../store/slices/expensesSlice";

export default function Layout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [userData, setUserDate] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const profilePanelRef = useRef();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "الرئيسية", icon: <HiOutlineHome /> },
    { to: "/expenses", label: "السجل", icon: <FaList /> },
    { to: "/subscription", label: "الاشتراكات", icon: <FaRedoAlt /> },
    { to: "/statistics", label: "احصائيات", icon: <FaChartPie /> },
    { to: "/spendingplan", label: "الخطة", icon: <FaCogs /> },
    { to: "/goals", label: "الأهداف", icon: <FaBullseye /> },
    { to: "/assistant", label: "المساعد", icon: <FaRobot /> },
    { to: "/dashboard", label: "لوحة التحكم", icon: <FaDashcube /> },
  ];

  // إغلاق لوحة الحساب عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profilePanelRef.current &&
        !profilePanelRef.current.contains(e.target)
      ) {
        setShowProfilePanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDate({
          name: user.displayName || "مستخدم بدون اسم",
          email: user.email,
          photo: user.photoURL,
        });
      }
      // else{
      //     setUserDate(null)
      //   }
      // return () => unsubscribe()
    });
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(resetExpenses());      
      await signOut(auth);
      console.log("تم تسجيل الخروج");
      navigate("/login");
    } catch (error) {
      console.log("خطا اثناء تسجيل الخروج", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg flex-col p-4 sticky top-0 h-screen hidden sm:flex`}
      >
        <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          💸 FinSave
        </h1>
        <nav className="space-y-2 text-sm">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
              ${
                pathname === to
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Collapsible Sidebar for Mobile */}
      {showSidebar && (
        <aside className="fixed right-0 top-16 w-64 h-full bg-white shadow-lg p-4 z-40 sm:hidden">
          <nav className="space-y-2 text-sm">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
                ${
                  pathname === to
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setShowSidebar(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          {/* Mobile Sidebar Button */}
          <div className="flex items-center gap-4 relative">
            <button
              className="sm:hidden text-xl text-gray-500 hover:text-black "
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <FaBars />
            </button>
            <div className="text-sm text-gray-600">🔍 البحث (لاحقًا)</div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button className="text-sm text-gray-500 hover:text-black">
              🌙
            </button>
            <button className="text-sm text-gray-500 hover:text-black">
              🇸🇦 / 🇬🇧
            </button>
            <img
              src={defaultAvatar}
              alt="User"
              className="w-9 h-9 rounded-full object-cover cursor-pointer border"
              onClick={() => setShowProfilePanel(!showProfilePanel)}
            />
          </div>
        </header>

        {/* Profile Panel */}
        {showProfilePanel && (
          <div
            ref={profilePanelRef}
            className="fixed left-0 top-16 h-full w-64 bg-white shadow-xl p-4 z-50 flex flex-col gap-4 transition-all"
          >
            <div className="text-center">
              <img
                src={defaultAvatar}
                className="w-20 h-20 rounded-full mx-auto border mb-2"
              />
              <h3 className="font-bold text-lg text-gray-800">
                {userData?.name}
              </h3>
              <p className="text-xs text-gray-500">{userData?.email}</p>
            </div>

            <hr />
            <div className="space-y-3 text-sm text-gray-700">
              <button className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded w-full">
                <FaMoon /> الوضع الليلي
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded w-full">
                <FaLanguage /> تغيير اللغة
              </button>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded w-full"
              >
                <FaUserCircle /> الملف الشخصي
              </Link>
              <button
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-2 py-1 rounded w-full mt-4"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> تسجيل الخروج
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 bg-white min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
