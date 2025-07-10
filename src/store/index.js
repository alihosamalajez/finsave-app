import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from '../store/slices/expensesSlice'

export const store = configureStore({
    reducer :{
        expenses : expensesReducer ,
        // income : incomeReducer,
        // goals : goalsReducer,
        // categories : categoriesReducer,
    }
})