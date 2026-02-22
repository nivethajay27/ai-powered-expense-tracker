import React, { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  return (
    <div>
      <ExpenseForm onNewExpense={addExpense} />
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            <span>{e.title} - ${e.amount}</span>
            <span className="category">{e.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}