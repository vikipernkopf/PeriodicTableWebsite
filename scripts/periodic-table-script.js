/*electron configuration*/

async function loadData() {
    let elements = {};

    try {
        const response = await fetch("http://localhost:3000/elements"); //local json-server
        const data = await response.text();

        data.forEach(element => {
            const symbol = element.symbol;
            const config = element.electronConfiguration;
            const name = element.name;

            //store both symbol and full name for lookup
            elements[symbol.toLowerCase()] = `${symbol}-${config}`;
            elements[name.toLowerCase()] = `${symbol}-${config}`;
        });

        return elements;
    } catch (error) {
        console.error("Failed to fetch from server, falling back to local file:", error);

        try {
            const response = await fetch("../data/elements.json");
            const data = await response.json();
            
            data.elements.forEach(element => {
                const symbol = element.symbol;
                const config = element.electronConfiguration;
                const name = element.name;

                // Store both symbol and full name for lookup
                elements[symbol.toLowerCase()] = `${symbol}-${config}`;
                elements[name.toLowerCase()] = `${symbol}-${config}`;
            });

        } catch (error) {
            console.error("Failed to load data from both server and local file:", error);
            
            return {};
        }
    }

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
