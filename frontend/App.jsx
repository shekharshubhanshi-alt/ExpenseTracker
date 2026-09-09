import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const categoryList = [
  "Food", "Transport", "Shopping", "Bills", "Entertainment",
  "Health", "Education", "Travel", "Groceries", "Other"
];

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  expense_date: new Date().toISOString().slice(0, 10)
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [e, s, m, c, b] = await Promise.all([
        axios.get(`${API}/expenses`),
        axios.get(`${API}/analytics/summary`),
        axios.get(`${API}/analytics/monthly`),
        axios.get(`${API}/analytics/categories`),
        axios.get(`${API}/budgets`)
      ]);

      setExpenses(e.data);
      setSummary(s.data);
      setMonthly(m.data);
      setCategories(c.data);
      setBudgets(b.data);
      setError("");
    } catch {
      setError("Backend unavailable. Start the Node.js server and check MySQL settings.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/expenses/${editingId}`, form);
      } else {
        await axios.post(`${API}/expenses`, form);
      }

      setForm(initialForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to save expense.");
    }
  }

  function edit(expense) {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      expense_date: String(expense.expense_date).slice(0, 10)
    });
  }

  async function remove(id) {
    if (!window.confirm("Delete this expense?")) return;
    await axios.delete(`${API}/expenses/${id}`);
    loadData();
  }

  const budgetAlerts = budgets.filter(
    b => Number(b.spent) >= Number(b.amount) * Number(b.alert_threshold) / 100
  );

  return (
    <main className="container">
      <header className="hero">
        <p>PERSONAL FINANCE</p>
        <h1>Expense Tracker</h1>
        <span>Track expenses, monitor budgets and understand spending patterns.</span>
      </header>

      {error && <div className="notice error">{error}</div>}
      {budgetAlerts.length > 0 && (
        <div className="notice">
          ⚠ {budgetAlerts.length} budget alert(s) have reached their threshold.
        </div>
      )}

      <section className="stats">
        <div><small>Total spending</small><strong>₹{Number(summary.total || 0).toLocaleString()}</strong></div>
        <div><small>This month</small><strong>₹{Number(summary.monthlyTotal || 0).toLocaleString()}</strong></div>
        <div><small>Transactions</small><strong>{summary.count || 0}</strong></div>
        <div><small>Categories</small><strong>{categories.length}</strong></div>
      </section>

      <section className="two-col">
        <div className="panel">
          <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>
          <form onSubmit={submit}>
            <input
              placeholder="Expense title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
            />
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {categoryList.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={form.expense_date}
              onChange={e => setForm({ ...form, expense_date: e.target.value })}
              required
            />
            <button type="submit">{editingId ? "Update Expense" : "Add Expense"}</button>
            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={() => { setEditingId(null); setForm(initialForm); }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="panel">
          <h2>Budget Monitoring</h2>
          {budgets.length === 0 ? (
            <p className="muted">No budgets created yet.</p>
          ) : (
            budgets.map(b => {
              const pct = Math.min(100, Number(b.spent) / Number(b.amount) * 100);
              return (
                <div className="budget" key={b.id}>
                  <div className="budget-title">
                    <b>{b.category}</b>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="progress"><i style={{ width: `${pct}%` }} /></div>
                  <small>₹{Number(b.spent).toLocaleString()} / ₹{Number(b.amount).toLocaleString()}</small>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="two-col">
        <div className="panel chart">
          <h2>Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel chart">
          <h2>Category Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categories} dataKey="total" nameKey="category" outerRadius={90} label>
                {categories.map((_, i) => <Cell key={i} fill={`hsl(${210 + i * 25} 70% 50%)`} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h2>Expenses</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {expenses.map(x => (
                <tr key={x.id}>
                  <td>{x.title}</td>
                  <td><span className="tag">{x.category}</span></td>
                  <td>{String(x.expense_date).slice(0, 10)}</td>
                  <td>₹{Number(x.amount).toLocaleString()}</td>
                  <td>
                    <button className="small" onClick={() => edit(x)}>Edit</button>
                    <button className="small danger" onClick={() => remove(x.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
