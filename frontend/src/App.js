import "./App.css";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BASE_URL = "https://expense-tracker-16a5.onrender.com";

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const chartData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#3b82f6"
        ],
        borderWidth: 0
      }
    ]
  };

  // FETCH
  useEffect(() => {
    fetch(`${BASE_URL}/api/expenses`)
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  // ADD
  const addExpense = async () => {
    if (!title || !amount || !category) {
      alert("Fill all fields");
      return;
    }

    await fetch(`${BASE_URL}/api/expenses/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, amount, category })
    });

    const res = await fetch(`${BASE_URL}/api/expenses`);
    const data = await res.json();
    setExpenses(data);

    setTitle("");
    setAmount("");
    setCategory("");
  };

  // DELETE
  const deleteExpense = async (id) => {
    await fetch(`${BASE_URL}/api/expenses/${id}`, {
      method: "DELETE"
    });

    const res = await fetch(`${BASE_URL}/api/expenses`);
    const data = await res.json();
    setExpenses(data);
  };

  return (
    <div className="container">

      <div className="left">
        <h2>💰 Expense Tracker</h2>

        <input className="input" placeholder="Title"
          value={title} onChange={(e) => setTitle(e.target.value)} />

        <input className="input" placeholder="Amount"
          value={amount} onChange={(e) => setAmount(e.target.value)} />

        <input className="input" placeholder="Category"
          value={category} onChange={(e) => setCategory(e.target.value)} />

        <button className="button" onClick={addExpense}>
          Add Expense
        </button>

        <div className="total">Total: ₹{total}</div>

        <div className="chart">
          <Pie data={chartData} />
        </div>
      </div>

      <div className="right">
        <h2>All Expenses</h2>

        {expenses.map((e) => (
          <div key={e._id} className="expense-item">
            <span>
              {e.title} - ₹{e.amount} ({e.category})
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteExpense(e._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
