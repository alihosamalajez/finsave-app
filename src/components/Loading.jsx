export default function Loading(){
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-14 h-1/4 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-700 font-semibold text-lg">جاري تحميل البيانات</p>
            </div>
        </div>
    )
}