import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";


export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (uesrId) => {
    const q = query(
      collection(db, "categories"),
      where("userId", "==", uesrId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

export const addCategoryFromFB = createAsyncThunk(
  "categories/addCategory",
  async ({ name, userId }) => {
    const docRef = await addDoc(collection(db, "categories"), {
      name,
      userId,
    });
    return { id: docRef.id, name };
  }
);

export const deleteCategoryFromFB = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId) => {
    await deleteDoc(doc(db, "categories", categoryId));
    return categoryId;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    addLoading: false,
    error : null
  },
  reducers: {
    // addCategory : (state , action) =>{
    //     const newCategory = action.payload
    //     state.data.push(newCategory)
    //             if(!state.data.includes(newCategory)){
    //         state.data.push(newCategory)
    //     }
    // },
    deleteCategory: (state, action) => {
      state.data = state.data.filter((cat) => cat.id !== action.payload);
    },
    // setCategory : (state , action) =>{
    //     localStorage.setItem("categories" , JSON.stringify(action.payload))
    //     return action.payload
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addCategoryFromFB.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(addCategoryFromFB.fulfilled, (state, action) => {
        state.addLoading = false;
        state.data.push(action.payload);
      })
      .addCase(addCategoryFromFB.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload
      })
      .addCase(deleteCategoryFromFB.fulfilled, (state, action) => {
        state.data = state.data.filter((cat) => cat.id !== action.payload);
      });
  },
});

export const { deleteCategory} = categoriesSlice.actions
export default categoriesSlice.reducer;
