/*electron configuration*/

async function loadData() {
    const response = await fetch("../data/electron-config.txt");
    const text = await response.text();

    let elements = {};

    text.split("\n").forEach(line => {
        let parts = line.split(":"); // Split at colon

        if (parts.length < 2) { // Skip invalid lines
            return;
        }

        let nameParts = parts[0].trim().split(" "); // Split atomic number, symbol, and name
        let symbol = nameParts[1]; // Element symbol
        let fullName = nameParts.slice(2).join(" "); // Full element name
        let config = parts[1].trim(); // Electron config

        // Store both symbol and full name for lookup
        elements[symbol.toLowerCase()] = `${symbol}-${config}`;
        elements[fullName.toLowerCase()] = `${symbol}-${config}`;
    });

    return elements;
}

async function searchElement() {
    let elements = await loadData();
    let inputField = document.querySelector(".ui-input");
    let input = inputField.value.trim();
    let query = input.toLowerCase();
    let resultDiv = document.getElementById("result");

    let foundString = elements[query];

    if (query === "" || !foundString) {
        resultDiv.style.display = "none";
        resetElementStyles();

        return;
    }

    let found = foundString.split("-")[1];
    let element = foundString.split("-")[0];

    resultDiv.style.display = found ? "block" : "none";

    if (found) {
        resultDiv.innerHTML = `<strong>${element}:</strong> ${found}`;
        highlightElement(element);
    } else {
        resultDiv.innerHTML = "Element not found.";
    }
}

function highlightElement(input) {
    const classes = [
        'alkali-metal',
        'transition-metal',
        'post-transition-metal',
        'metalloid',
        'noble-gas',
        'reactive-non-metal',
        'lanthanide',
        'unknown-properties',
        'alkaline-earth-metal',
        'actinide'
    ];

    const tds = document.querySelectorAll('td');

    tds.forEach(td => {
        const link = td.querySelector('a');

        if (link && classes.some(className => td.classList.contains(className)) && link.textContent.toLowerCase() === (input.toLowerCase())) {
            td.style.transform = 'scale(1.1)';
            td.style.zIndex = '1';
            td.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.5)';
        } else {
            td.style.backgroundColor = '';
            td.style.transform = '';
            td.style.zIndex = '';
            td.style.boxShadow = '';
        }
    });
}

document.querySelector(".ui-input").addEventListener("input", searchElement);

function resetElementStyles() {
    const tds = document.querySelectorAll('td');

    tds.forEach(td => {
        td.style.transform = '';
        td.style.zIndex = '';
        td.style.boxShadow = '';
    });
}

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
