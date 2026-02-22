import React from "react";
import ExpenseList from "./ExpenseList";
import "./index.css";

export default function App() {
  return (
    <div className="container">
      <h1>Smart Expense Tracker</h1>
      <ExpenseList />
    </div>
  );
}