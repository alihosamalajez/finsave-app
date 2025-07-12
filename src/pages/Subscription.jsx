import { useSelector } from "react-redux";
import Subscriptions from "../components/Subscription";
import { useState, useEffect } from "react";

export default function SubscriptionsPage() {
  const expenses = useSelector((state) => state.expenses.data)
  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem("expenses") ) ;
  //   setExpenses(stored);
  // }, []);

  return (
    <Subscriptions onUpdateExpenses={expenses} />
  );
}
