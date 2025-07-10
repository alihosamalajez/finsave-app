import { useEffect , useState } from "react";

const DEFAULT_PLAN = {
 اكل : 0.4 ,
 مواصلات : 0.15 ,
 فواتير : 0.2 ,
 ترفيه : 0.1 ,
 تسوق : 0.1 ,
 اخرى : 0.05 ,
}

export default function SpendingPlan(){
    const [income , setIncome] = useState(2000)
    const [expenses , setExpenses] = useState([])
    const [totals , setTotals] = useState({})

    useEffect(()=>{
        const saved = JSON.parse(localStorage.getItem("expenses") || "[]")
        setExpenses(saved)
        const grouped = saved.reduce((acc , item)=>{
            acc[item.category] = (acc[item.category] || 0) + item.amount
            return acc
        } ,{})
        setTotals(grouped)
    },[])
    const format = (num) => num.toFixed(2)
    return(
        <div className="bg-white p-6 shadow rounded-xl">
            <h2 className="text-lg font-bold mb-4 text-gray-800">خطة الانفاق الذكية</h2>
            <div className="mb-4">
                <label className="block mb-2 font-medium">الدخل الشهري (شيكل) :</label>
                <input type="number" className="border p-2 rounded w-full max-w-sm" value={income}
                onChange={(e)=> setIncome(Number(e.target.value))}
                />
            </div>
            <div className="overflow-x-outo">
                <table className="w-full text-sm border text-right">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">التصنيف</th>
                            <th className="p-2 border">الحد المسموح به</th>
                            <th className="p-2 border">الواقع الفعلي</th>
                            <th className="p-2 border">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(DEFAULT_PLAN).map(([category , percent] ,i) =>{
                            const allowed = income * percent
                            const spent = totals[category] || 0
                            const status = 
                            spent > allowed ? "تجاوز الحد !" : spent > allowed * 0.9 ? "اقترب من الحد ⚠️":"جيد ✅"

                            return(
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-2 border">{category}</td>
                                    <td className="p-2 border">{format(allowed)}</td>
                                    <td className="p-2 border">{format(spent)}</td>
                                    <td className="p-2 border">{status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}