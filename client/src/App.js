// import React, { useState, useEffect } from "react";
// import "./App.css";

// function App() {
//   const [expenses, setExpenses] = useState([]);
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [message, setMessage] = useState("");

//   useEffect(() => fetchExpenses(), []);

//   const fetchExpenses = async () => {
//     const res = await fetch("http://localhost:5001/expenses");
//     const data = await res.json();
//     if (Array.isArray(data)) {
//       setExpenses(data);
//     } else {
//       console.warn("Expenses API did not return an array:", data);
//       setExpenses([]);
//     }
//   };

//   const handleAddOrEdit = async (e) => {
//     e.preventDefault();
//     if (!title || !amount) return;

//     // AI category
//     const aiRes = await fetch("http://localhost:5001/ai/categorize", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text: title }),
//     });
//     const aiCategory = await aiRes.json();

//     if (editingId) {
//       await fetch(`http://localhost:5001/expenses/${editingId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, amount, category: aiCategory }),
//       });
//       setEditingId(null);
//       setMessage("Expense updated!");
//     } else {
//       await fetch("http://localhost:5001/expenses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, amount, category: aiCategory }),
//       });
//       setMessage("Expense added!");
//     }

//     setTitle("");
//     setAmount("");
//     fetchExpenses();
//   };

//   const handleEditClick = (exp) => {
//     setEditingId(exp.id);
//     setTitle(exp.title);
//     setAmount(exp.amount);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5001/expenses/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete");
//       fetchExpenses();
//       setMessage("Expense deleted!");
//     } catch (err) {
//       console.error(err);
//       alert("Could not delete expense");
//     }
//   };

//   return (
//     <div className="container">
//       <h1> AI Expense Tracker</h1>

//       <form className="form" onSubmit={handleAddOrEdit}>
//         <input
//           className="input"
//           placeholder="Expense title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <input
//           className="input"
//           placeholder="Amount"
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//         <button className="btn" type="submit">{editingId ? "Update" : "Add"}</button>
//       </form>

//       <table className="expenses-table">
//         <thead>
//           <tr>
//             <th>Title</th><th>Amount</th><th>Category</th><th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {expenses.map(exp => (
//             <tr key={exp.id}>
//               <td>{exp.title}</td>
//               <td>${exp.amount}</td>
//               <td>{exp.category}</td>
//               <td>
//                 <button className="edit-btn" onClick={() => handleEditClick(exp)}>Edit</button>
//                 <button className="delete-btn" onClick={() => handleDelete(exp.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* <Analytics /> */}
//     </div>
//   );
// }

// // function Analytics() {
// //   const [data, setData] = useState([]);
// //   useEffect(() => {
// //     fetch("http://localhost:5001/expenses/analytics/category")
// //       .then(res => res.json())
// //       .then(setData);
// //   }, []);

// //   return (
// //     <div className="analytics">
// //       <h2>Category-wise Spending</h2>
// //       <ul>
// //         {data.map(item => <li key={item.category}>{item.category}: ${item.total}</li>)}
// //       </ul>
// //     </div>
// //   );
// // }

// export default App;


import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => fetchExpenses(), []);
  useEffect(() => fetchAnalytics(), []);

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5001/expenses");
      const data = await res.json();
      if (Array.isArray(data)) setExpenses(data);
      else setExpenses([]);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  // Fetch analytics (sum per category)
  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5001/expenses/analytics/category");
      const data = await res.json();
      if (Array.isArray(data)) setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setAnalyticsData([]);
    }
  };

  // Add or update expense
  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      // Get AI category
      const aiRes = await fetch("http://localhost:5001/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: title }),
      });
      const aiCategory = await aiRes.json();

      if (editingId) {
        await fetch(`http://localhost:5001/expenses/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, amount, category: aiCategory }),
        });
        setMessage("Expense updated!");
        setEditingId(null);
      } else {
        await fetch("http://localhost:5001/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, amount, category: aiCategory }),
        });
        setMessage("Expense added!");
      }

      setTitle("");
      setAmount("");
      fetchExpenses();
      fetchAnalytics();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add/update expense");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Edit click
  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setTitle(exp.title);
    setAmount(exp.amount);
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMessage("Expense deleted!");
      fetchExpenses();
      fetchAnalytics();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Could not delete expense");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="container">
      <h1>AI Expense Tracker</h1>

      {message && <div className="message">{message}</div>}

      <form className="form" onSubmit={handleAddOrEdit}>
        <input
          className="input"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn" type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <table className="expenses-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td>${exp.amount}</td>
              <td>{exp.category}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(exp)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <Analytics data={analyticsData} /> */}
    </div>
  );
}

// // // Analytics component
// function Analytics({ data }) {
//   if (!Array.isArray(data) || data.length === 0) return null;

//   return (
//     <div className="analytics">
//       <h2>Category-wise Spending</h2>
//       <ul>
//         {data.map((item) => (
//           <li key={item.category}>
//             {item.category || "Misc"}: ${item.total}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default App;