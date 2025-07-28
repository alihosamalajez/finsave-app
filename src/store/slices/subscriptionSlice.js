import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
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
export const fetchsubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "subscriptions"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
);

// اضافة
export const addsubscriptionsFirebase = createAsyncThunk(
  "subscriptions/add",
  async (income) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "subscriptions"), {
      ...income,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...income };
  }
);

// حذف
export const deletesubscriptionsFirebase = createAsyncThunk(
  "subscriptions/delete",
  async (id) => {
    await deleteDoc(doc(db, "subscriptions", id));
    return id;
  }
);

// تعديل
export const updatesubscriptionsFirebase = createAsyncThunk(
  "subscriptions/update",
  async ({ id, update }) => {
    await updateDoc(doc(db, "subscriptions", id), update);
    return { id, update };
  }
);

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    data: [],
    loading: true,
    addLoading: false,
    error: null,
  },
  //   reducers: {
  //     addSubscription: (state, action) => {
  //       state.push(action.payload);
  //     },
  //     editSubscription: (state, action) => {
  //       const { index, subscription } = action.payload;
  //       state[index] = subscription;
  //     },
  //     deleteSubscription: (state, action) => {
  //       const index = action.payload;
  //       const newState = state.filter((_, i) => i !== index);
  //       return newState;
  //     },
  //     setSubscriptions: (state, action) => {
  //       return action.payload;
  //     },
  //     toggleSubscriptions: (state, action) => {
  //       const index = action.payload;
  //       if (state[index]) {
  //         state[index].active = !state[index].active;
  //       }
  //     },
  //   },
  extraReducers: (builder) => {
    builder
      .addCase(fetchsubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchsubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //   add
      .addCase(addsubscriptionsFirebase.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(addsubscriptionsFirebase.fulfilled, (state, action) => {
        state.addLoading = false;
        state.data.push(action.payload);
      })
      .addCase(addsubscriptionsFirebase.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })

      //   delete
      .addCase(deletesubscriptionsFirebase.fulfilled, (state, action) => {
        state.data = state.data.filter((e) => e.id !== action.payload);
      })
      //   update
      .addCase(updatesubscriptionsFirebase.fulfilled, (state, action) => {
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

// export const {
//   addSubscription,
//   editSubscription,
//   deleteSubscription,
//   setSubscriptions,
//   toggleSubscriptions,
// } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;




