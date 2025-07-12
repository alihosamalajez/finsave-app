import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem("subscriptions") || [])
const subscriptionsSlice = createSlice({
    name : "subscriptions" ,
    initialState ,
    reducers : {
        addsubscriptions : (state , action) =>{
            state.push(action.payload)
            localStorage.setItem("subscriptions" , JSON.stringify(state))
        },
        editsubscriptions : (state , action) =>{
            const {index , subscription} = action.payload
            state[index] = subscription
            localStorage.setItem("subscriptions" , JSON.stringify(state))
        },
        deletesubscriptions : (state , action) =>{
            const index = action.payload
            const newState = state.filter((_ , i)=> i !== index)
            localStorage.setItem("subscriptions" , JSON.stringify(newState))
            return newState
        },
        setsubscriptions : (state , action) =>{
            localStorage.setItem("subscriptions" , JSON.stringify(action.payload))
            return action.payload
        },
    }
})

export const {addsubscriptions , editsubscriptions , deletesubscriptions , setsubscriptions} = subscriptionsSlice.actions
export default subscriptionsSlice.reducer