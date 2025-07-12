import { createSlice } from "@reduxjs/toolkit"

const initialState = JSON.parse(localStorage.getItem("categories"))  || ["طعام " , "مواصلات"]

const categoriesSlice = createSlice({
    name : "categories" ,
    initialState ,
    reducers : {
        addCategory : (state , action) =>{
            const newCategory = action.payload
            if(!state.includes(newCategory)){
                state.push(newCategory)
                localStorage.setItem("categories" , JSON.stringify(state))
            }
        },
        editCategory : (state , action) =>{
            const {index , newValue} = action.payload
            if(newValue.trim()){
                state[index] = newValue
                localStorage.setItem("categories" , JSON.stringify(state))
            }
        },
        deleteCategory : (state , action) =>{
            const index = action.payload
            const newState = state.filter((_ , i)=> i !== index)
            localStorage.setItem("categories" , JSON.stringify(newState))
            return newState
        },
        setCategory : (state , action) =>{
            localStorage.setItem("categories" , JSON.stringify(action.payload))
            return action.payload
        },
    }
})

export const {addCategory , editCategory , deleteCategory , setCategory} = categoriesSlice.actions
export default categoriesSlice.reducer