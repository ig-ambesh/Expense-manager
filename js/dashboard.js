let editId = null;
let expenseChart;

let currency = localStorage.getItem("currency") || "₹";

const balance = document.getElementById("balance");

const income = document.getElementById("income");

const expense = document.getElementById("expense");

const totalTransaction = document.getElementById("totalTransaction");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location = "index.html";
}

// LogOut Logic which is in the sidebar

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Add Transaction Popup

const addBtn = document.getElementById("addBtn");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");

addBtn.addEventListener("click", function () {
  editId = null;
  transactionForm.reset();
  popup.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

cancelBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

// save a transtion

const transactionForm = document.getElementById("transactionForm");

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = document.getElementById("type").value;

  const amount = document.getElementById("amount").value;

  const category = document.getElementById("category").value;

  const description = document.getElementById("description").value;

  const date = document.getElementById("date").value;

  const transaction = {
    id: Date.now(),
    type,
    amount,
    category,
    description,
    date,
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // edit logic......
  if (editId === null) {
    transactions.push(transaction);
  } else {
    transactions = transactions.map(function (item) {
      if (item.id === editId) {
        return {
          ...transaction,
          id: editId,
        };
      }

      return item;
    });

    editId = null;
  }
  // .............................
  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions();
  updateCards();
  loadChart();

  popup.style.display = "none";

  transactionForm.reset();

  alert("Transaction Added");
});

// display the localstorage transaction to the table

// const tableBody = document.getElementById("tableBody");

function displayTransactions() {
  const tableBody = document.getElementById("tableBody");

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  tableBody.innerHTML = "";

  transactions.forEach(function (transaction) {
    const row = `
      <tr>
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount}</td>
        
        <td>
        <button class="editBtn" onclick="editTransaction(${transaction.id})">
        <i class="ri-edit-line"></i> Edit </button>

        <button class="deleteBtn" onclick="deleteTransaction(${transaction.id})">
        <i class="ri-delete-bin-line"></i> Delete </button>
        </td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
}
displayTransactions();
updateCards();
loadChart();

// Delete function in the table.........

function deleteTransaction(id) {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactions = transactions.filter(function (transaction) {
    return transaction.id !== id;
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions();
  updateCards();
  loadChart();
}

// Edit function.....

function editTransaction(id) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const transaction = transactions.find(function (item) {
    return item.id === id;
  });

  document.getElementById("type").value = transaction.type;

  document.getElementById("amount").value = transaction.amount;

  document.getElementById("category").value = transaction.category;

  document.getElementById("description").value = transaction.description;

  document.getElementById("date").value = transaction.date;

  editId = id;

  popup.style.display = "flex";
}

// Dashboard Cards - income,expense....

function updateCards() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      totalIncome += Number(transaction.amount);
    } else {
      totalExpense += Number(transaction.amount);
    }
  });

  const totalBalance = totalIncome - totalExpense;

  income.textContent = `${currency}${totalIncome}`;

  expense.textContent = `${currency}${totalExpense}`;

  balance.textContent = `${currency}${totalBalance}`;

  totalTransaction.textContent = transactions.length;
}
updateCards();

// moon changing int sun....

const icon = document.getElementById("icon");
const moon = document.querySelector("#icon i");

icon.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    moon.classList.remove("ri-moon-line");
    moon.classList.add("ri-sun-line");
  } else {
    moon.classList.remove("ri-sun-line");
    moon.classList.add("ri-moon-line");
  }
});

// chart......

function loadChart() {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let income = 0;
  let expense = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      income += Number(transaction.amount);
    } else {
      expense += Number(transaction.amount);
    }
  });

  if (expenseChart) {
    expenseChart.destroy();
  }

  const ctx = document.getElementById("expenseChart");

  expenseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount (₹)",
          data: [income, expense],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderRadius: 10,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
loadChart();

// setting.........

const greeting = document.getElementById("greeting");

greeting.textContent = `Hello ! ${currentUser.name}`;

const settingsBtn = document.getElementById("settingsBtn");

const settingsPopup = document.getElementById("settingsPopup");

const saveSettings = document.getElementById("saveSettings");

const newName = document.getElementById("newName");

const currencySelect = document.getElementById("currency");

settingsBtn.addEventListener("click", function (e) {
  e.preventDefault();

  settingsPopup.style.display = "flex";

  newName.value = currentUser.name;

  currencySelect.value = currency;
});

saveSettings.addEventListener("click", function () {
  const updatedName = newName.value.trim();

  if (updatedName) {
    currentUser.name = updatedName;

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    greeting.textContent = `Hello ! ${updatedName}`;
  }

  currency = currencySelect.value;

  localStorage.setItem("currency", currency);

  displayTransactions();
  updateCards();
  loadChart();

  settingsPopup.style.display = "none";
});

const closeSettings = document.getElementById("closeSettings");

closeSettings.addEventListener("click", function () {
  settingsPopup.style.display = "none";
});
