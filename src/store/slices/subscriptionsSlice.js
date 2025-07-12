import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem("subscriptions") || [])

const subscriptionsSlice = createSlice({
    name : "subscriptions" ,
    initialState ,
    reducers : {
        addSubscriotion : (state , action) =>{
            state.push(action.payload)
            localStorage.setItem("subscriptions" , JSON.stringify(state))
        },
        editSubscriotion : (state , action) =>{
            const {index , subscription} = action.payload
            state[index] = subscription
            localStorage.setItem("subscriptions" , JSON.stringify(state))
        },
        deleteSubscriotion : (state , action) =>{
            const index = action.payload
            const newState = state.filter((_ , i)=> i !== index)
            localStorage.setItem("subscriptions" , JSON.stringify(newState))
            return newState
        },
        setSubscriotion : (state , action) =>{
            localStorage.setItem("subscriptions" , JSON.stringify(action.payload))
            return action.payload
        },
    }
})

export const {addSubscriotion , editSubscriotion , deleteSubscriotion , setSubscriotion} = subscriptionsSlice.actions
export default subscriptionsSlice.reducer