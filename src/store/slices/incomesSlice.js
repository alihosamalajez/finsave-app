import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, auth } from "../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// جلب 

export const fetchIncomes = createAsyncThunk(
  "incomes/fetchIncomes",
  async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "incomes"),
      where("userId", "==", user.uid)
      // orderBy("createdAt", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
);

// اضافة 
export const addincomesFirebase = createAsyncThunk(
  "incomes/add",
  async (income) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "incomes"), {
      ...income,
      userId: user.uid,
      createdAt: new Date().toISOString(),

    });
    return { id: docRef.id, ...income };
  }
);

// حذف 
export const deleteincomesFirebase = createAsyncThunk(
  "incomes/delete",
  async (id) => {
    await deleteDoc(doc(db, "incomes", id));
    return id;
  }
);

// تعديل 
export const updateincomesFirebase = createAsyncThunk(
  "incomes/update",
  async ({ id, update }) => {
    await updateDoc(doc(db, "incomes", id), update);
    return { id, update };
  }
);

const incomesSlice = createSlice({
  name: "incomes",
  initialState: {
    data: [],
    loading: true,
    addLoading: false,
    error : null
  },
  // reducers : {
  //     addIncomes : (state , action) =>{
  //         state.push(action.payload)
  //     },
  //     editIncomes : (state , action) =>{
  //         const {index , income} = action.payload
  //         state[index] = income
  //     },
  // deleteIncomes: (state, action) => {
  //   state.data = state.data.filter((e) => e.id !== action.payload);
  // },
  //     setIncomes : (state , action) =>{
  //         return action.payload
  //     },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //   add
      .addCase(addincomesFirebase.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(addincomesFirebase.fulfilled, (state, action) => {
        state.addLoading = false
        state.data.push(action.payload);
      })
      .addCase(addincomesFirebase.rejected, (state, action) => {
        state.addLoading = false
        state.error = action.payload;
      })

      //   delete
      .addCase(deleteincomesFirebase.fulfilled, (state, action) => {
        state.data = state.data.filter((e) => e.id !== action.payload);
      })
      //   update
      .addCase(updateincomesFirebase.fulfilled, (state, action) => {
        const index = state.data.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...action.payload.update,
          };
        }
      });
  },
});

// export const {addIncomes , editIncomes , deleteIncomes , setIncomes} = incomesSlice.actions
export default incomesSlice.reducer;
