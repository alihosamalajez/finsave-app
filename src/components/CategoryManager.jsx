import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useSelector , useDispatch } from "react-redux";
import { addCategoryFromFB, deleteCategoryFromFB , deleteCategory} from "../store/slices/categoriesSlice";
import { auth } from "../firebase";

export default function CategoryManager() {
    const { data: categories , loading , addLoading} = useSelector((state) => state.categories);

  const dispatch = useDispatch()
  
  const [newCat, setNewCat] = useState("");


  
  const handleAdd = () => {
    if (!newCat.trim()) return toast.error("❌ أدخل اسم التصنيف");
    if (categories.includes(newCat)) return toast.error("⚠️ التصنيف موجود مسبقًا");
    dispatch(addCategoryFromFB({name : newCat , userId : auth.currentUser.uid}))
    setNewCat("");
  };
  if(addLoading){
    toast.success("  ....جاري التحميل");
  }



  const handleDelete = (categoryId) => {
    console.log(categoryId);
    
    dispatch(deleteCategoryFromFB(categoryId))
    dispatch(deleteCategory(categoryId))
    toast.success("🗑️ تم الحذف");
  };


 

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-bold mb-4">📂 إدارة التصنيفات</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="أدخل اسم تصنيف جديد"
          className="flex-1 border px-3 py-2 rounded-md"
        />
        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          إضافة
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {categories.map((cat, i) => (
          <li key={i} className="flex justify-between items-center border px-3 py-2 rounded"> 
              <span>{cat.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
        {addLoading && (
          <li className="animate-pulse bg-gray-200 h-10 rounded w-full">{newCat}</li>
        )}
      </ul>
    </div>
  );
}
