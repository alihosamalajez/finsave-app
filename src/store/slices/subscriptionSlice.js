import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem("subscriptions")) || []
const subscriptionSlice = createSlice({
    name : "subscriptions" ,
    initialState ,
    reducers : {
        addSubscription : (state , action) =>{
            state.push(action.payload)
            localStorage.setItem("subscriptions" , JSON.stringify(state))
        },
        editSubscription : (state , action) =>{
            const {index , subscription} = action.payload
            state[index] = subscription
            localStorage.setItem("subscriptions" , JSON.stringify(state))
        },
        deleteSubscription : (state , action) =>{
            const index = action.payload
            const newState = state.filter((_ , i)=> i !== index)
            localStorage.setItem("subscriptions" , JSON.stringify(newState))
            return newState
        },
        setSubscriptions : (state , action) =>{
            localStorage.setItem("subscriptions" , JSON.stringify(action.payload))
            return action.payload
        },
        toggleSubscriptions : (state , action) =>{
            const index =  action.payload
            if(state[index]){
                state[index].active = !state[index].active
            }
        },
    }
})

export const {addSubscription , editSubscription , deleteSubscription , setSubscriptions , toggleSubscriptions} = subscriptionSlice.actions
export default subscriptionSlice.reducer