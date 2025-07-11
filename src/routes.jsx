import { Routes , Route } from "react-router-dom";
import Layout from "./layouts/Layout"
import Expenses from "./pages/Expenses"
import Statistics from "./pages/Statistics"
import Assistant from "./pages/Assistant"
import SpendingPlan from "./pages/SpendingPlan"
import Goals from "./pages/Goals";
import SubscriptionsPage from "./pages/Subscription";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Signup from "./pages/Signup"

export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/login" element ={<Login/>}/>
            <Route path="/signup" element ={<Signup/>}/>
            <Route path="/" element = {<Layout/>}>
                <Route index element = {<Home/>}/>
                <Route path="expenses" element ={<Expenses/>}/>
                <Route path="subscription" element ={<SubscriptionsPage/>}/>
                <Route path="statistics" element ={<Statistics/>}/>
                <Route path="spendingplan" element ={<SpendingPlan/>}/>
                <Route path="goals" element ={<Goals/>}/>
                <Route path="assistant" element ={<Assistant/>}/>
                <Route path="dashboard" element ={<Dashboard/>}/>
            </Route>
        </Routes>
    )
}