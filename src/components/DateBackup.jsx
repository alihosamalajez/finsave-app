import { toast } from "sonner"
import ExportPDFButton from "./ExportPDFButton"

export default function DataBackup(){
    const handleExport = ()=>{
        const data = localStorage.getItem("expenses") || "[]"
        const blob = new Blob([data] , {type : "application/json"})
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "expenses-backup.json"
        a.click()
        URL.revokeObjectURL(url)
    }
    const handleImport = (e)=>{
        const file = e.target.files[0]
        if(!file) return

        const reader = new FileReader()
        reader.onload = (event) =>{
            try{
                const data = JSON.parse(event.target.result)
                if(Array.isArray(data)){
                    localStorage.setItem("expenses" , JSON.stringify(data))
                    toast.success("تم استيراد البيانات بنجاح ✅")
                    window.location.reload()
                }else{
                    toast.error("الملف غير صالح ❌")
                }
            }catch{
                toast.error("خطا في قراءة الملف ❌")
            }
        }
        reader.readAsText(file)
    }
    return(
        <div className="bg-white p-4 mt-8 rounded shadow space-y-4">
            <h3 className="font-bold text-gray-800 text-lg">نسخ احتياطي | استيراد البيانات | تصدير PDF</h3>
            <div className="flex gap-10 flex-wrap">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleExport}>تحميل النسخة الاحتياطية</button>
                <ExportPDFButton/>
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm">استيراد الملفات JSON :</label>
                <input type="file" accept=".json" onChange={handleImport} 
                className="border p-2 rounded w-full max-w-sm" />
            </div>
        </div>
    )
}