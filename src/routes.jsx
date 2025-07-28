import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import Layout from "./layouts/Layout";

import Expenses from "./pages/Expenses";
import Statistics from "./pages/Statistics";
import Assistant from "./pages/Assistant";
import SpendingPlan from "./pages/SpendingPlan";
import Goals from "./pages/Goals";
import SubscriptionsPage from "./pages/Subscription";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Loading from "./components/Loading";

export default function AppRoutes() {
  const RequireAuth = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    if (loading) return children;
    
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="expenses"
          element={
            <RequireAuth>
              <Expenses />
            </RequireAuth>
          }
        />
        <Route
          path="subscription"
          element={
            <RequireAuth>
              <SubscriptionsPage />
            </RequireAuth>
          }
        />
        <Route
          path="statistics"
          element={
            <RequireAuth>
              <Statistics />
            </RequireAuth>
          }
        />
        <Route
          path="spendingplan"
          element={
            <RequireAuth>
              <SpendingPlan />
            </RequireAuth>
          }
        />
        <Route
          path="goals"
          element={
            <RequireAuth>
              <Goals />
            </RequireAuth>
          }
        />
        <Route
          path="assistant"
          element={
            <RequireAuth>
              <Assistant />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}
