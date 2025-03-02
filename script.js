function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const maxLength = 20;

    if (username.length > maxLength) {
        alert(`Username must be ${maxLength} characters or less.`);
        return;
    }

    if (username) {
        //save the username in local storage
        localStorage.setItem('username', username);

        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] Login attempt - ${username}`;
        console.log(logEntry); //log to console or display somewhere
        window.location.href = "../index.html";
    } else {
        alert('Please enter a username.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userInfo = document.getElementById('user-info');

    if (username) {
        welcomeMessage.textContent = `Hello, ${username}!`;
    } else {
        userInfo.style.display = 'none';
    }
});

document.getElementById('logout-button').addEventListener('click', function () {
    //remove username from local storage
    localStorage.removeItem('username');

    //redirect to login page
    window.location.href = 'login.html';
});


async function loadData() {
    const response = await fetch("/data/electron-config.txt");
    const text = await response.text();

    let elements = {};
    text.split("\n").forEach(line => {
        let parts = line.split(":"); // Split at colon
        if (parts.length < 2) return; // Skip invalid lines

        let nameParts = parts[0].trim().split(" "); // Split atomic number, symbol, and name
        let symbol = nameParts[1].toLowerCase(); // Element symbol
        let fullName = nameParts.slice(2).join(" ").toLowerCase(); // Full element name
        let config = parts[1].trim(); // Electron config

        // Store both symbol and full name for lookup
        elements[symbol] = config;
        elements[fullName] = config;
    });

    return elements;
}

// Search function
async function searchElement() {
    let elements = await loadData();
    let inputField = document.querySelector(".ui-input");
    let query = inputField.value.trim().toLowerCase();
    let resultDiv = document.getElementById("result");

    let found = elements[query];

    if (query === ""){
        resultDiv.style.display = "none";
    }

    resultDiv.style.display = found ? "block" : "none";
    resultDiv.innerHTML = found
        ? `<strong>${query}:</strong> ${found}`
        : "Element not found.";
}

// Attach event listener
document.querySelector(".ui-input").addEventListener("input", searchElement);
