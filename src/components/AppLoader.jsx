import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch,  } from "react-redux";
import { auth } from "../firebase";
import { useEffect } from "react";
import { fetchExpenses } from "../store/slices/expensesSlice";
import { fetchCategories } from "../store/slices/categoriesSlice";
import { fetchIncomes } from "../store/slices/incomesSlice";
import { fetchsubscriptions } from "../store/slices/subscriptionSlice";
import { fetchgoals } from "../store/slices/goalsSlice";

export default function AppLoader(){
    const dispatch = useDispatch()
    const [user] = useAuthState(auth)

    useEffect(()=>{
        if(user){
            dispatch(fetchCategories(user.uid))
            dispatch(fetchExpenses(user.uid))
            dispatch(fetchIncomes(user.uid))
            dispatch(fetchsubscriptions(user.uid))
            dispatch(fetchgoals(user.uid))
        }
    } , [user , dispatch ])
    return null
}