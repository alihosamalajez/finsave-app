import Subscriptions from "../components/Subscription";
import { useState, useEffect } from "react";

export default function SubscriptionsPage() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(stored);
  }, []);

  return (
    <Subscriptions onUpdateExpenses={setExpenses} />
  );
}
