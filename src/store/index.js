import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from '../store/slices/expensesSlice'
import categoriesReducer from '../store/slices/categoriesSlice'
import goalsReducer from '../store/slices/goalsSlice'
import incomesReducer from '../store/slices/incomesSlice'
import subscriptionsReducer from '../store/slices/subscriptionSlice'
import authReducer from '../store/slices/authSlice'

export const store = configureStore({
    reducer :{
        expenses : expensesReducer ,
        incomes : incomesReducer,
        goals : goalsReducer,
        categories : categoriesReducer,
        subscriptions : subscriptionsReducer,
        currentUser : authReducer ,
    }
})