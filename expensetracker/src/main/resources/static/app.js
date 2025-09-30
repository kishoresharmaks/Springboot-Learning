const apiUrl = "http://localhost:8081/api/expenses";
const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const monthlySummaryEl = document.getElementById("monthlySummary");
const monthFilter = document.getElementById("monthFilter");

let expenses = [];
let editingId = null;

// Format helpers
const formatDate = d => new Date(d).toLocaleDateString("en-US");
const formatMonth = d => d.slice(0, 7);

// Fetch expenses
async function fetchExpenses() {
  try {
    const res = await fetch(apiUrl);
    expenses = await res.json();
    renderExpenses(expenses);
    updateMonthFilter();
    updateSummary();
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

// Render table
function renderExpenses(data) {
  tableBody.innerHTML = data.length
    ? data.map(exp => `
      <tr>
        <td>${exp.title}</td>
        <td>₹${parseFloat(exp.amount).toFixed(2)}</td>
        <td>${exp.category}</td>
        <td>${formatDate(exp.date)}</td>
        <td>
          <button onclick="editExpense(${exp.id})">Edit</button>
          <button onclick="deleteExpense(${exp.id})">Delete</button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="5" style="text-align:center;">No expenses</td></tr>`;
}

// Update dropdown months
function updateMonthFilter() {
  const months = [...new Set(expenses.map(e => formatMonth(e.date)))].sort().reverse();
  monthFilter.innerHTML = `<option value="">All Months</option>` +
    months.map(m => {
      const d = new Date(m + "-01");
      return `<option value="${m}">${d.toLocaleDateString("en-US", { year:"numeric", month:"long" })}</option>`;
    }).join("");
}

// Update summary
function updateSummary(selectedMonth = '') {
  const filtered = selectedMonth
    ? expenses.filter(e => formatMonth(e.date) === selectedMonth)
    : expenses;

  if (!filtered.length) {
    monthlySummaryEl.innerHTML = "<p>No data available</p>";
    return;
  }

  const total = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const avg = filtered.length ? (total / filtered.length) : 0;

  monthlySummaryEl.innerHTML = `
    <p><b>${selectedMonth ? 'Monthly' : 'All-Time'} Summary</b></p>
    <p><b>Total:</b> ₹${total.toFixed(2)}</p>
    <p><b>Count:</b> ${filtered.length}</p>
    <p><b>Average:</b> ₹${avg.toFixed(2)}</p>
  `;
}

// Filter by month
function filterByMonth() {
  const m = monthFilter.value;
  renderExpenses(m ? expenses.filter(e => formatMonth(e.date) === m) : expenses);
  updateSummary(m || new Date().toISOString().slice(0,7));
}

// Add / Update expense
form.onsubmit = async e => {
  e.preventDefault();
  const exp = {
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value
  };
  const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;
  const method = editingId ? "PUT" : "POST";

  await fetch(url, { method, headers: {"Content-Type":"application/json"}, body: JSON.stringify(exp) });
  editingId = null;
  form.reset();
  document.getElementById("date").value = new Date().toISOString().split("T")[0];
  fetchExpenses();
};

// Edit expense
function editExpense(id) {
  const e = expenses.find(x => x.id === id);
  document.getElementById("title").value = e.title;
  document.getElementById("amount").value = e.amount;
  document.getElementById("category").value = e.category;
  document.getElementById("date").value = e.date;
  editingId = id;
  form.querySelector("button").textContent = "Update Expense";
}

// Delete expense
async function deleteExpense(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchExpenses();
}

// Init
window.onload = () => {
  document.getElementById("date").value = new Date().toISOString().split("T")[0];
  fetchExpenses();
};
