import { Link , Outlet , useLocation } from "react-router-dom";
import{FaPlus , FaList , FaChartPie , FaRobot , FaCogs, FaBullseye, FaRedoAlt, FaDashcube} from "react-icons/fa"
import { HiOutlineHome } from "react-icons/hi";
export default function Layout(){
    const {pathname} = useLocation()

    const navLinks = [
       { to : "/" , label : "الرئيسية" , icon : <HiOutlineHome/>},
       { to : "/expenses" , label : "السجل" , icon : <FaList/>},
       { to : "/subscription" , label : "الاشتراكات" , icon : <FaRedoAlt/>},
       { to : "/statistics" , label : "احصائيات" , icon : <FaChartPie/>},
       { to : "/spendingplan" , label : "الخطة" , icon : <FaCogs/>},
       { to : "/goals" , label : "الأهداف" , icon : <FaBullseye/>},
       { to : "/assistant" , label : "المساعد" , icon : <FaRobot/>},
       { to : "/dashboard" , label : "لوحة التحكم" , icon : <FaDashcube/>},
    ]
    return(
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow px-4 py-3 flex gap-3 justify-center text-sm font-medium sticky top-0 z-50">
                {navLinks.map(({to , label , icon})=>(
                    <Link key={to} to = {to} className={`flex items-center gap-1 px-3 py-1 rounded
                    ${pathname === to ? "bg-blue-100 text-blue-700":"text-gray-600 hover:bg-gray-100"}`}>
                        {icon} <span>{label}</span>
                    </Link>
                ))}
            </nav>
            <main className="p-4 max-w-3xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}