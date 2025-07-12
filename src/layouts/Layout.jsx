import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaList, FaChartPie, FaRobot, FaCogs,
  FaBullseye, FaRedoAlt, FaDashcube
} from "react-icons/fa";
import { HiOutlineHome } from "react-icons/hi";

export default function Layout() {
  const { pathname } = useLocation();

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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden sm:flex flex-col p-4 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">💸 FinSave</h1>
        <nav className="space-y-2 text-sm">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
              ${pathname === to ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="text-sm text-gray-600">🔍 البحث (لاحقًا)</div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-500 hover:text-black">🌙</button>
            <button className="text-sm text-gray-500 hover:text-black">🇸🇦 / 🇬🇧</button>
            <img src="./src/images/avatar.png" alt="User" className="w-8 h-8 rounded-full object-cover" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


