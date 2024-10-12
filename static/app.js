document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners for view and add stock links
    document.getElementById('viewStocksLink').addEventListener('click', showLandingPage);
    document.getElementById('addStockLink').addEventListener('click', showAddStockPage);

    // Modal close button event listener
    document.getElementById('closeModal').addEventListener('click', closeModal);

    fetchCurrentStocks();
});

// Function to fetch and display current stocks
async function fetchCurrentStocks() {
    const response = await fetch('/api/stocks');
    const stocks = await response.json();

    const tbody = document.querySelector('#recentStocksTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    stocks.forEach(stock => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${stock.name}</td>
            <td>${stock.quantity}</td>
            <td>${stock.price}</td>
            <td>
                <button onclick="openEditStockModal('${stock._id}')" id="edit" class="actionBtn">Edit</button>
                <button onclick="deleteStock('${stock._id}')" id="delete" class="actionBtn">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to add a stock
async function addStock(event) {
    event.preventDefault();

    const stock = {
        name: document.getElementById('stockName').value,
        quantity: document.getElementById('stockQuantity').value,
        price: document.getElementById('stockPrice').value
    };

    const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stock)
    });

    if (response.ok) {
        alert('Stock added successfully!');
        fetchCurrentStocks();
        showLandingPage();
    } else {
        alert('Failed to add stock.');
    }
}

// Function to open the edit stock modal and populate it
async function openEditStockModal(stockId) {
    const response = await fetch(`/api/stocks/${stockId}`);
    const stock = await response.json();

    if (response.ok) {
        // Populate the edit form with the current stock data
        document.getElementById('editStockName').value = stock.name;
        document.getElementById('editStockQuantity').value = stock.quantity;
        document.getElementById('editStockPrice').value = stock.price;

        // Show the modal
        document.getElementById('editStockModal').style.display = 'block';

        // Handle the update submission
        document.getElementById('editStockForm').onsubmit = async function (e) {
            e.preventDefault(); // Prevent default form submission

            const updatedStock = {
                name: document.getElementById('editStockName').value,
                quantity: document.getElementById('editStockQuantity').value,
                price: document.getElementById('editStockPrice').value
            };

            const updateResponse = await fetch(`/api/stocks/${stockId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStock)
            });

            if (updateResponse.ok) {
                alert('Stock updated successfully!');
                fetchCurrentStocks();
                closeModal();
            } else {
                alert('Failed to update stock.');
            }
        };
    } else {
        alert('Failed to fetch stock data.');
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('editStockModal').style.display = 'none';
}

// Function to delete a stock
async function deleteStock(stockId) {
    const response = await fetch(`/api/stocks/${stockId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Stock deleted successfully!');
        fetchCurrentStocks();
    } else {
        alert('Failed to delete stock.');
    }
}

// Functions to show and hide pages
function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('addStockPage').style.display = 'none';
}

function showAddStockPage() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('addStockPage').style.display = 'block';
}
