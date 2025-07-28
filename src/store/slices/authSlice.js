import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem("currentUser"))|| null
// const initialState = { currentUser : null}

const authSlice = createSlice({
    name : "auth" ,
    initialState ,
    reducers : {
        logIn : (state , action) =>{
            localStorage.setItem("currentUser" , JSON.stringify(action.payload))
            return {
                currentUser : action.payload
            }
        },
        logOut : (state , action) =>{
            localStorage.setItem("currentUser" , JSON.stringify(action.payload))
            return {
                currentUser : null
            }
        },
        
    }
})

export const {logIn , logOut} = authSlice.actions
export default authSlice.reducer