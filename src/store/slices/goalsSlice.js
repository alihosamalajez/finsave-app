import { createSlice } from "@reduxjs/toolkit"

// const initialState = JSON.parse(localStorage.getItem("goals") || [])
const initialState = []

const goalsSlice = createSlice({
    name : "goals" ,
    initialState ,
    reducers : {
        addGoal : (state , action) =>{
            state.push(action.payload)
            localStorage.setItem("goals" , JSON.stringify(state))
        },
        editGoal : (state , action) =>{
            const {index , goal} = action.payload
            state[index] = goal
            localStorage.setItem("goals" , JSON.stringify(state))
        },
        deleteGoal : (state , action) =>{
            state.splice(action.payload , 1)
            localStorage.setItem("goals" , JSON.stringify(State))
        },
        setGoal : (state , action) =>{
            localStorage.setItem("goals" , JSON.stringify(action.payload))
            return action.payload
        },
    }
})

export const {addGoal , editGoal , deleteGoal , setGoal} = goalsSlice.actions
export default goalsSlice.reducer