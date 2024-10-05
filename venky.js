const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || {};
let totalAmount = 0;

let idliTotal = 0;
let dosaTotal = 0;
let maggiTotal = 0;
const backendWebServiceUrl = 'https://backend-web-service-yn3n.onrender.com/';

// New data structure to store user names and their selected items
const userSelections = [];

function addItem(name, price) {
    if (!selectedItems[name]) {
        selectedItems[name] = { price: price, quantity: 1 };
    } else {
        selectedItems[name].quantity += 1;
    }
    updateSelectedItems();
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
}

function removeItem(name) {
    if (selectedItems[name]) {
        delete selectedItems[name];
        updateSelectedItems();
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }
}

function decreaseQuantity(name) {
    if (selectedItems[name] && selectedItems[name].quantity > 0) {
        selectedItems[name].quantity -= 1;
        if (selectedItems[name].quantity === 0) {
            delete selectedItems[name];
        }
        updateSelectedItems();
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }
}

function increaseQuantity(name) {
    if (selectedItems[name]) {
        selectedItems[name].quantity += 1;
        updateSelectedItems();
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }
}

function updateSelectedItems() {
    const selectedItemsList = document.getElementById('selectedItems');
    selectedItemsList.innerHTML = '';

    totalAmount = 0;
    idliTotal = 0;
    dosaTotal = 0;
    maggiTotal = 0;

    for (const [name, item] of Object.entries(selectedItems)) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${name} - ₹${item.price}</span>
            <div>
                <button onclick="decreaseQuantity('${name}')">-</button>
                <span id="quantity-${name}">${item.quantity}</span>
                <button onclick="increaseQuantity('${name}')">+</button>
                <button onclick="removeItem('${name}')">Remove</button>
            </div>
        `;
        selectedItemsList.appendChild(listItem);
        totalAmount += item.price * item.quantity;

        if (name.toLowerCase().includes('idli')) {
            idliTotal += item.price * item.quantity;
        } else if (name.toLowerCase().includes('dosa')) {
            dosaTotal += item.price * item.quantity;
        } else if (name.toLowerCase().includes('maggi')) {
            maggiTotal += item.price * item.quantity;
        }
    }

    document.getElementById('totalAmount').innerText = totalAmount;
}

function searchItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemName = item.querySelector('.item-name').textContent.toLowerCase();
        if (itemName.includes(searchInput)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function showSpinPopup() {
    document.getElementById('spinPopup').style.display = 'block';
}

function closeSpinPopup() {
    document.getElementById('spinPopup').style.display = 'none';
    // Clear all selected items from localStorage
    localStorage.removeItem('selectedItems');
    // Optionally, clear the selectedItems object in memory
    Object.keys(selectedItems).forEach(key => delete selectedItems[key]);
    updateSelectedItems(); // Update the UI to reflect the changes
    // Clear the name and random image
    document.getElementById('userNameInput').value = '';
    document.getElementById('selectedItemName').innerText = ''; // Clear the selected item name
    document.getElementById('cardImage').src = 'images/Plain_Dosa.jpg'; // Clear the card image
    
}

function spinWheel() {
    const wheel = document.getElementById('wheel');
    const segments = wheel.getElementsByClassName('wheel-segment');
    const startButton = document.getElementById('startButton');

    startButton.style.display = 'none';

    const weightedItems = [
        { item: 'Plain Dosa', weight: 60 },
        { item: 'Kutti Dosa', weight: 10 },
        { item: 'Onion Dosa', weight: 10 },
        { item: 'Karam Dosa', weight: 10 },
        { item: 'Ghee Dosa', weight: 10 }
    ];

    const weightedArray = [];
    weightedItems.forEach(({ item, weight }) => {
        for (let i = 0; i < weight; i++) {
            weightedArray.push(item);
        }
    });

    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    const selectedItem = weightedArray[randomIndex];

    document.getElementById('selectedItemName').innerText = `${selectedItem}`;

    Array.from(segments).forEach((segment) => {
        segment.style.opacity = segment.getAttribute('data-item') === selectedItem ? '1' : '0.5';
    });

    setTimeout(() => {
        startButton.style.display = 'block';
    }, 3000);
}

function closeCongratsNotification() {
    const notification = document.getElementById('spinOption');
    if (notification) {
        notification.style.display = 'none';
    }
}

document.getElementById('checkEligibilityButton').addEventListener('click', () => {
    // Only check eligibility, do not modify selectedItems
    const combinedTotal = idliTotal + dosaTotal + maggiTotal;

    if (combinedTotal >= 150) {
        document.getElementById('spinOption').style.display = 'block';
        document.getElementById('notEligibleMessage').classList.add('hidden');
    } else {
        document.getElementById('spinOption').style.display = 'none';
        document.getElementById('notEligibleMessage').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('notEligibleMessage').classList.add('hidden');
        }, 3000);
    }
});

document.getElementById('spinButton').addEventListener('click', () => {
    document.getElementById('userNameInput').style.display = 'block';
    document.getElementById('submitNameButton').style.display = 'block';
    document.getElementById('spinButton').style.display = 'none';
});

document.getElementById('submitNameButton').addEventListener('click', () => {
    const userNameInput = document.getElementById('userNameInput');
    const userName = userNameInput.value.trim();
    if (userName) {
        showSpinPopup();
        closeCongratsNotification();
        document.querySelector('.popup-content button').style.display = 'block'; // Show start button
    } else {
        alert("Name is required to play the game.");
    }
});

const dosaImages = [
    { src: 'images/Plain_Dosa.jpg', name: 'Plain Dosa' },
    { src: 'images/kutti_dosa.jpg', name: 'Kutti Dosa' },
    { src: 'images/onion_dosa.jpg', name: 'Onion Dosa' },
    { src: 'images/karam_dosa.jpg', name: 'Karam Dosa' },
    { src: 'images/ghee_dosa.jpg', name: 'Ghee Dosa' }
];

let animationInterval;

function startCardAnimation() {
    const cardImage = document.getElementById('cardImage');
    const startButton = document.querySelector('.popup-content button');
    startButton.style.display = 'none';

    let index = 0;
    const speed = 100;

    animationInterval = setInterval(() => {
        index = (index + 1) % dosaImages.length;
        cardImage.src = dosaImages[index].src;
        cardImage.alt = dosaImages[index].name;
    }, speed);

    setTimeout(() => {
        stopCardAnimation();
    }, 3000);
}

function stopCardAnimation() {
    clearInterval(animationInterval);
    const cardImage = document.getElementById('cardImage');
    const randomIndex = Math.floor(Math.random() * dosaImages.length);
    const selectedItem = dosaImages[randomIndex];
    cardImage.src = selectedItem.src;
    cardImage.alt = selectedItem.name;

    const selectedItemName = document.getElementById('selectedItemName');
    selectedItemName.textContent = `${selectedItem.name}`;

    // Store the user's name and selected item
    const userName = document.getElementById('userNameInput').value.trim();
    if (userName) {
        console.log(`User Name: ${userName}, Selected Item: ${selectedItem.name}`);
        userSelections.push({ userName, selectedItem: selectedItem.name });
        addWinner(userName, selectedItem.name); // Add the winner to the list
        addNewWinner(userName, selectedItem.name); // Store the winner in the backend
    } else {
        alert("Name is required to play the game.");
    }

    confetti({
        particleCount: 1500, // Further increased particle count
        spread: 600, // Further increased spread for a more explosive effect
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff7f50', '#ff1493', '#1e90ff', '#32cd32'],
        shapes: ['circle', 'square', 'triangle', 'star'],
        scalar: 1.5 // Keeping scalar the same to not increase the size
    });
}

function addWinner(userName, wonItem) {
    const winnersList = document.getElementById('winners');
    if (!winnersList) {
        console.error("Element with ID 'winners' not found.");
        return;
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="winner-name">${userName}</span> won <span class="winner-item">${wonItem}</span>`;
    winnersList.appendChild(listItem);
}



// ... existing code ...

// Fetch all items from the server and display them
function fetchItems() {
    fetch(`${backendWebServiceUrl}api/items`) // Ensure the correct API endpoint
        .then(response => response.json())
        .then(items => {
            const itemsContainer = document.getElementById('items');
            itemsContainer.innerHTML = ''; // Clear existing items
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.onclick = () => addItem(item.name, item.price);
                itemDiv.innerHTML = `
                    <img src="images/${item.name.toLowerCase().replace(/ /g, '_').replace(/[()]/g, '')}.jpg" alt="${item.name}">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="price ${item.veg ? 'veg' : 'non-veg'}">₹${item.price}</span>
                    </div>`;
                itemsContainer.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}

// Add a new item to the server
function addNewItem(name, price, isVeg) {
    const newItem = { name, price, veg: isVeg };
    fetch(`${backendWebServiceUrl}api/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(item => {
        console.log('Item added:', item);
        fetchItems(); // Refresh the item list
    })
    .catch(error => console.error('Error adding item:', error));
}

// Update an existing item on the server
function updateItem(id, name, price, isVeg) {
    const updatedItem = { name, price, veg: isVeg };
    fetch(`${backendWebServiceUrl}api/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
    })
    .then(response => response.json())
    .then(item => {
        console.log('Item updated:', item);
        fetchItems(); // Refresh the item list
    })
    .catch(error => console.error('Error updating item:', error));
}

// Delete an item from the server
function deleteItem(id) {
    fetch(`${backendWebServiceUrl}api/items/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        console.log('Item deleted');
        fetchItems(); // Refresh the item list
    })
    .catch(error => console.error('Error deleting item:', error));
}

// Combine window.onload functions
window.onload = function() {
    fetchItems(); // Fetch items from the server on load
    updateSelectedItems();
    fetchWinners();
    // Other initialization code...
};

// Fetch all winners from the server and display them
function fetchWinners() {
    fetch(`${backendWebServiceUrl}api/winners`) // Updated port
        .then(response => response.json())
        .then(winners => {
            const winnersList = document.getElementById('winners');
            winnersList.innerHTML = ''; // Clear existing winners
            winners.forEach(winner => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span class="winner-name">${winner.userName}</span> won <span class="winner-item">${winner.wonItem}</span>`;
                winnersList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching winners:', error));
}

// Add a new winner to the server
function addNewWinner(name, item) {
    const newWinner = { userName: name, wonItem: item };
    fetch(`${backendWebServiceUrl}api/winners`, { // Ensure this URL is correct
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWinner)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(winner => {
        console.log('Winner added:', winner);
        fetchWinners(); // Refresh the winners list
    })
    .catch(error => console.error('Error adding winner:', error));
}
