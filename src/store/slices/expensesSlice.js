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

// جلب المصايف

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid)
      // orderBy("createdAt", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
);

// اضافة مصروف
export const addExpensesFirebase = createAsyncThunk(
  "expenses/add",
  async (expense) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "expenses"), {
      ...expense,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...expense };
  }
);

// حذف مصروف
export const deleteExpensesFirebase = createAsyncThunk(
  "expenses/delete",
  async (id) => {
    await deleteDoc(doc(db, "expenses", id));
    return id;
  }
);

// تعديل مصروف
export const updateExpensesFirebase = createAsyncThunk(
  "expenses/update",
  async ({ id, update }) => {
    await updateDoc(doc(db, "expenses", id), update);
    return { id, update };
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    data: [],
    loading: true,
    error: null,
  },
  reducers: {
    addExpense: (state, action) => {
      state.data.push(action.payload);
    },
    // setExpenses: (state, action) => {
    //   state.data = action.payload;
    // //   localStorage.setItem("expenses", JSON.stringify(state.data));
    // },
    deleteExpense: (state, action) => {
      state.data = state.data.filter((e) => e.id !== action.payload);
    },
    updateExpense: (state, action) => {
      const { id, update } = action.payload;
      const index = state.data.findIndex((exp) => exp.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...update };
      }
    },
    resetExpenses: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //   add
      .addCase(addExpensesFirebase.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      //   delete
      .addCase(deleteExpensesFirebase.fulfilled, (state, action) => {
        state.data = state.data.filter((e) => e.id !== action.payload);
      })
      //   update
      .addCase(updateExpensesFirebase.fulfilled, (state, action) => {
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

export const {
  //   setExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  resetExpenses,
} = expensesSlice.actions;

export default expensesSlice.reducer;
