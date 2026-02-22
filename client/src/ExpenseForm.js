import React, { useState } from "react";

export default function ExpenseForm({ onNewExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    // AI categorization
    let category = "Misc";
    try {
      const aiRes = await fetch("http://localhost:5001/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: title }),
      });
      category = await aiRes.json();
    } catch (err) {
      console.log("AI failed, using Misc");
    }

    // Save expense
    const res = await fetch("http://localhost:5001/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category }),
    });
    const newExpense = await res.json();
    onNewExpense(newExpense);

    setTitle("");
    setAmount("");
  };

  return (
    <div className="card">
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}