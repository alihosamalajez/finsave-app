import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data : JSON.parse(localStorage.getItem('expenses')) || [],
}

const expensesSlice = createSlice({
    name : 'expenses',
    initialState ,
    reducers : {
        addExpense : (state , action) =>{
            state.data.push(action.payload)
            localStorage.setItem('expenses' , JSON.stringify(state.data))
        },
        setExpenses : (state , action) =>{
            state.data = action.payload
            localStorage.setItem('expenses' , JSON.stringify(state.data))
        },
        deleteExpense : (state , action) =>{
            state.data = state.data.filter((e ,i) => i !== action.payload )
            localStorage.setItem('expenses' , JSON.stringify(state.data))
        },
        updateExpense : (state , action) =>{
            const {index , update} = action.payload
            state.data[index] = update
            localStorage.setItem('expenses' , JSON.stringify(state.data))
        },
        clearExpenses :(state)=>{
            state.data = []
            localStorage.removeItem('expenses')
        },
    },
    // extraReducers : (builder) => {
    //     builder
    //     .addCase(fetchExpenses.pending , (state) =>{
    //         state.loading = true
    //     })
    //     .addCase(fetchExpenses.fulfilled , (state , action) =>{
    //         state.list = action.payload
    //         state.loading = false
    //     })
    //     .addCase(addExpense.fulfilled , (state , action) =>{
    //         state.list.push(action.payload)
    //     })
    //     .addCase(deleteExpense.fulfilled , (state , action) =>{
    //         state.list = state.list.filter((e) => e.id !== action.payload )
    //     })
    //     .addCase(updateExpense.fulfilled , (state , action) =>{
    //         const index = state.list.findIndex((e) => e.id === action.payload.id)
    //         if(index !== -1) state.list[index] = action.payload
    //     })
    // }
})

export const {setExpenses , addExpense ,deleteExpense , updateExpense , clearExpenses} = expensesSlice.actions

export default expensesSlice.reducer