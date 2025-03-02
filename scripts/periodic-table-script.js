/*electron configuration*/

async function loadData() {
    const response = await fetch("../data/electron-config.txt");
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

async function searchElement() {
    let elements = await loadData();
    let inputField = document.querySelector(".ui-input");
    let input = inputField.value.trim();
    let query = input.toLowerCase();
    let resultDiv = document.getElementById("result");

    let found = elements[query];

    if (query === ""){
        resultDiv.style.display = "none";
    }

    resultDiv.style.display = found ? "block" : "none";
    if (found) {
        resultDiv.innerHTML = `<strong>${input}:</strong> ${found}`;
        highlightElement(input);
    } else {
        resultDiv.innerHTML = "Element not found.";
    }
    
}

function highlightElement(input) {
    const classes = ['alkali-metal', 'transition-metal', 'post-transition-metal', 'metalloid', 'noble-gas', 'reactive-non-metal'];
    const tds = document.querySelectorAll('td');

    tds.forEach(td => {
        const link = td.querySelector(query);
        if (link && classes.some(className => td.classList.contains(className)) && link.textContent.toLowerCase() === (input.toLowerCase())) {
            td.style.transform = 'scale(1.1)';
            td.style.zIndex = '1';
            td.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.5)';
        }
        else
        {
            td.style.backgroundColor = '';
            td.style.transform = '';
            td.style.zIndex = '';
            td.style.boxShadow = '';
        }
    });
}

document.querySelector(".ui-input").addEventListener("input", searchElement);

/*login*/

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