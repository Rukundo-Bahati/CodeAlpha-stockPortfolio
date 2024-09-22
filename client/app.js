document.getElementById('viewStocksLink').addEventListener('click', showLandingPage);
document.getElementById('addStockLink').addEventListener('click', showAddStockPage);

// Fetch stocks on page load
fetchCurrentStocks();

async function fetchCurrentStocks() {
    const response = await fetch('http://127.0.0.1:5000/api/stocks');
    const stocks = await response.json();
    const recentStocksTable = document.querySelector('#recentStocksTable tbody');
    
    // Clear the table
    recentStocksTable.innerHTML = '';

    // Populate table with fetched stocks
    stocks.forEach(stock => {
        const row = `<tr data-id="${stock._id}">
            <td>${stock.name}</td>
            <td>${stock.quantity}</td>
            <td>${stock.price}</td>
            <td class="actionBtns">
                <button onclick="editStock('${stock._id}')" id="edit" class="actionBtn">Edit</button>
                <button onclick="deleteStock('${stock._id}')" id="delete" class="actionBtn">Delete</button>
            </td>
        </tr>`;
        recentStocksTable.innerHTML += row;
    });
}

function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('addStockPage').style.display = 'none';
    fetchCurrentStocks(); // Refresh the stock list
}

function showAddStockPage() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('addStockPage').style.display = 'block';
    document.getElementById('addStockForm').reset();
}

// Function to add a stock
async function addStock(event) {
    event.preventDefault();
    const stockData = {
        name: document.getElementById('stockName').value,
        quantity: document.getElementById('stockQuantity').value,
        price: document.getElementById('stockPrice').value,
    };

    await fetch('http://127.0.0.1:5000/api/stocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockData),
    });

    showLandingPage(); // Show the landing page after adding
   
}

// Function to delete a stock
async function deleteStock(stockId) {
    if (confirm("Are you sure you want to delete this stock?")) {
        await fetch(`http://127.0.0.1:5000/api/stocks/${stockId}`, {
            method: 'DELETE',
        });
        fetchCurrentStocks(); // Refresh stock list
    }
}

// Function to edit a stock
function editStock(stockId) {
    const row = document.querySelector(`tr[data-id="${stockId}"]`);
    const name = row.cells[0].textContent;
    const quantity = row.cells[1].textContent;
    const price = row.cells[2].textContent;

    document.getElementById('stockName').value = name;
    document.getElementById('stockQuantity').value = quantity;
    document.getElementById('stockPrice').value = price;

    // Set up the form to update
    document.getElementById('addStockForm').onsubmit = async (e) => {
        e.preventDefault();
        const updatedStock = {
            name: document.getElementById('stockName').value,
            quantity: document.getElementById('stockQuantity').value,
            price: document.getElementById('stockPrice').value,
        };
        await fetch(`http://127.0.0.1:5000/api/stocks/${stockId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStock),
        });
        showLandingPage(); // Refresh stock list and show landing page
    };

    showAddStockPage(); // Show the add stock form to edit
}


//toggling sidebar
let menuIcon = document.querySelector(".bx");
let sidebarA = document.querySelector(".sidebar");

menuIcon.addEventListener("click", () => {
    sidebarA.classList.toggle("show"); // Use toggle to show/hide
});
