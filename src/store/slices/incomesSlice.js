import { createSlice } from "@reduxjs/toolkit"

// const initialState = JSON.parse(localStorage.getItem("incomes") || [])
const initialState = []

const incomesSlice = createSlice({
    name : "incomes" ,
    initialState ,
    reducers : {
        addIncomes : (state , action) =>{
            state.push(action.payload)
            localStorage.setItem("incomes" , JSON.stringify(state))
        },
        editIncomes : (state , action) =>{
            const {index , income} = action.payload
            state[index] = income
            localStorage.setItem("incomes" , JSON.stringify(state))
        },
        deleteIncomes : (state , action) =>{
            const index = action.payload
            const newState = state.filter((_ , i)=> i !== index)
            localStorage.setItem("incomes" , JSON.stringify(newState))
            return newState
        },
        setIncomes : (state , action) =>{
            localStorage.setItem("incomes" , JSON.stringify(action.payload))
            return action.payload
        },
    }
})

export const {addIncomes , editIncomes , deleteIncomes , setIncomes} = incomesSlice.actions
export default incomesSlice.reducer