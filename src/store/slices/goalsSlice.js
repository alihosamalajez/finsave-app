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
export const fetchgoals = createAsyncThunk(
  "goals/fetchgoals",
  async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(db, "goals"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
    //   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
);

// اضافة 
export const addgoalsFirebase = createAsyncThunk(
  "goals/add",
  async (income) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "goals"), {
      ...income,
      userId: user.uid,
    //   createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...income };
  }
);

// حذف 
export const deletegoalsFirebase = createAsyncThunk(
  "goals/delete",
  async (id) => {
    await deleteDoc(doc(db, "goals", id));
    return id;
  }
);

// تعديل 
export const updategoalsFirebase = createAsyncThunk(
  "goals/update",
  async ({ id, update }) => {
    await updateDoc(doc(db, "goals", id), update);
    return { id, update };
  }
);

const initialState = JSON.parse(localStorage.getItem("goals")) || []
// const initialState = []

const goalsSlice = createSlice({
    name : "goals" ,
    initialState : {
        data : [],
    },
    reducers : {
        // addGoal : (state , action) =>{
        //     state.push(action.payload)
        // },
        // editGoal : (state , action) =>{
        //     const {index , goal} = action.payload
        //     state[index] = goal
        // },
        // deleteGoal : (state , action) =>{
        //     state.splice(action.payload , 1)
        // },
        // setGoal : (state , action) =>{
        //     return action.payload
        // },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchgoals.fulfilled, (state, action) => {
            state.data = action.payload;
          })
          //   add
          .addCase(addgoalsFirebase.fulfilled, (state, action) => {
            state.data.push(action.payload);
          })
          //   delete
          .addCase(deletegoalsFirebase.fulfilled, (state, action) => {
            state.data = state.data.filter((e) => e.id !== action.payload);
          })
          //   update
          .addCase(updategoalsFirebase.fulfilled, (state, action) => {
            const index = state.data.findIndex((e) => e.id === action.payload.id);
            if (index !== -1) {
              state.data[index] = {
                ...state.data[index],
                ...action.payload.update,
              };
            }
          });
      },
})

// export const {addGoal , editGoal , deleteGoal , setGoal} = goalsSlice.actions
export default goalsSlice.reducer