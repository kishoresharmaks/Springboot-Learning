const apiUrl = "http://localhost:8081/api/expenses";
const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const totalEl = document.getElementById("total");
const monthwiseBody = document.querySelector("#monthwiseTable tbody");

let expenses = [];
let editingId = null;

// Format helpers
const formatDate = d => new Date(d).toLocaleDateString("en-GB"); // DD/MM/YYYY
const formatMonth = m => {
  const [year, month] = m.split("-");
  return new Date(`${year}-${month}-01`).toLocaleDateString("en-US", { year: "numeric", month: "long" });
};

// Fetch all expenses
async function fetchExpenses() {
  try {
    const res = await fetch(apiUrl);
    expenses = await res.json();
    renderExpenses();
    updateTotal();
  } catch (err) {
    console.error("Error fetching expenses:", err);
  }
}

// Fetch monthwise summary
async function fetchMonthwise() {
  try {
    const res = await fetch(`${apiUrl}/monthwise`);
    const monthwise = await res.json();
    renderMonthwise(monthwise);
  } catch (err) {
    console.error("Error fetching monthwise report:", err);
  }
}


// Render expenses table
function renderExpenses() {
  tableBody.innerHTML = expenses.length
    ? expenses.map(exp => `
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
    : `<tr><td colspan="5" style="text-align:center;">No expenses yet</td></tr>`;
}
function renderMonthwise(data) {
  if (!data.length) {
    monthwiseBody.innerHTML = `<tr><td colspan="2" style="text-align:center;">No data available</td></tr>`;
    return;
  }

  // Group expenses by month
  const monthTotals = {};
  data.forEach(exp => {
    const month = exp.date.slice(0, 7); // yyyy-MM
    monthTotals[month] = (monthTotals[month] || 0) + parseFloat(exp.amount);
  });

  // Render rows
  monthwiseBody.innerHTML = Object.entries(monthTotals)
    .map(([month, total]) => `
      <tr>
        <td>${formatMonth(month)}</td>
        <td>₹${total.toFixed(2)}</td>
      </tr>
    `).join("");
}


// Update total expense
function updateTotal() {
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  totalEl.textContent = `₹${total.toFixed(2)}`;
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

  try {
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp)
    });

    editingId = null;
    form.querySelector("button").textContent = "Add Expense";
    form.reset();
    document.getElementById("date").value = new Date().toISOString().split("T")[0];
    fetchExpenses();
    fetchMonthwise();
  } catch (err) {
    console.error("Error saving expense:", err);
  }
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
  try {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchExpenses();
    fetchMonthwise();
  } catch (err) {
    console.error("Error deleting expense:", err);
  }
}

// Init
window.onload = () => {
  document.getElementById("date").value = new Date().toISOString().split("T")[0];
  fetchExpenses();
  fetchMonthwise();
};
