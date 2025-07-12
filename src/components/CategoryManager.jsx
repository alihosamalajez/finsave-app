import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useSelector , useDispatch } from "react-redux";
import { addCategory, deleteCategory, editCategory } from "../store/slices/categoriesSlice";

export default function CategoryManager() {
  // const [categories, setCategories] = useState([]);
  const categories = useSelector((state) => state.categories)
  const dispatch = useDispatch()
  const [newCat, setNewCat] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // useEffect(() => {
  //   const stored = localStorage.getItem("categories");
  //   setCategories(stored ? JSON.parse(stored) : ["طعام", "مواصلات"]);
  // }, []);

  // const saveToStorage = (list) => {
  //   localStorage.setItem("categories", JSON.stringify(list));
  //   setCategories(list);
  // };

  const handleAdd = () => {
    if (!newCat.trim()) return toast.error("❌ أدخل اسم التصنيف");
    if (categories.includes(newCat)) return toast.error("⚠️ التصنيف موجود مسبقًا");

    dispatch(addCategory(newCat))
    setNewCat("");
    toast.success("✅ تم إضافة التصنيف");
  };

  const handleDelete = (index) => {
    dispatch(deleteCategory(index))
    toast.success("🗑️ تم الحذف");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(categories[index]);
  };

  const confirmEdit = () => {
    if (!editValue.trim()) return;
    dispatch(editCategory({index : editIndex , newValue : editValue}))
    setEditIndex(null);
    toast.success("✏️ تم التعديل");
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
            {editIndex === i ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 border rounded px-2 py-1"
              />
            ) : (
              <span>{cat}</span>
            )}
            <div className="flex items-center gap-2">
              {editIndex === i ? (
                <button onClick={confirmEdit} className="text-green-600 hover:text-green-800">
                  <CheckIcon className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={() => handleEdit(i)} className="text-blue-600 hover:text-blue-800">
                  <PencilIcon className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => handleDelete(i)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
