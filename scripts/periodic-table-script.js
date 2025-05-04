/*electron configuration*/

/**
 * Loads element data by first attempting to fetch it from the server.
 * If the server fetch fails, it falls back to loading from a local file.
 * @returns {Promise<Object>} A promise that resolves to the processed elements data.
 */
async function loadData() {
    try {
        return await loadFromServer();
    } catch (serverError) {
        console.error("Failed to load data from server:", serverError);

        try {
            return await loadFromFile();
        } catch (fileError) {
            console.error("Failed to load data from local file:", fileError);

            return {};
        }
    }
}

/**
 * Fetches element data from the server.
 * @returns {Promise<Object>} A promise that resolves to the processed elements data.
 * @throws Will throw an error if the server response is not ok or if no data is received.
 */
async function loadFromServer() {
    const response = await fetch("https://elements.black2.cf/elements");

    if (!response.ok) {
        throw new Error('Server response was not ok');
    }

    const data = await response.json();

    //handle both possible data structures (array or object with elements property)
    const elementsArray = !Array.isArray(data) ? (data?.elements ?? []) : data;

    if (!elementsArray || elementsArray.length === 0) {
        throw new Error('No elements data received from server');
    }

    return processElements(elementsArray);
}

/**
 * Fetches element data from a local file.
 * @returns {Promise<Object>} A promise that resolves to the processed elements data.
 * @throws Will throw an error if the file response is not ok or if the data format is invalid.
 */
async function loadFromFile() {
    const response = await fetch("../data/elements.json");

    if (!response.ok) {
        throw new Error('Failed to load local file');
    }

    const data = await response.json();

    if (!data?.elements || !Array.isArray(data.elements) || data.elements.length === 0) {
        throw new Error('Invalid or empty data format in local file');
    }

    return processElements(data.elements);
}

/**
 * Processes an array of element objects into a lookup object.
 * @param {Array} elementsArray - The array of element objects.
 * @returns {Object} A lookup object with element symbols and names as keys and their configurations as values.
 */
function processElements(elementsArray) {
    const elements = {};

    elementsArray.forEach(element => {
        if (element?.name && element?.symbol && element?.electronConfiguration) {
            const symbol = element.symbol;
            const config = element.electronConfiguration;
            const name = element.name;

            if (config) {
                elements[symbol.toLowerCase()] = `${symbol}-${config}`;
                elements[name.toLowerCase()] = `${symbol}-${config}`;
            }
        }
    });

    return elements;
}

/**
 * Searches for an element based on user input and displays its electron configuration.
 * Highlights the corresponding element in the periodic table if found.
 */
async function searchElement() {
    let inputField = document.querySelector(".ui-input");
    let input = inputField.value.trim();
    let resultDiv = document.getElementById("result");

    if (input === "") {
        resultDiv.style.display = "none";
        resetElementStyles();

        return;
    }

    const atomicNumber = parseInt(input);

    if (!isNaN(atomicNumber) && atomicNumber > 0 && atomicNumber <= 118) {
        try {
            const apiResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/element/${atomicNumber}/JSON/`);

            if (!apiResponse.ok) {
                console.error(`API Error: ${apiResponse.status} - ${apiResponse.statusText}`);
                resultDiv.style.display = "block";
                resultDiv.innerHTML = "Error fetching element data from the API.";

                resetElementStyles();

                return;
            }

            const data = await apiResponse.json();
            const name = data.Record.RecordTitle;

            const elements = await loadData();
            const foundString = elements[name.toLowerCase()];

            if (foundString) {
                const found = foundString.split("-")[1];
                const element = foundString.split("-")[0];

                resultDiv.style.display = "block";
                resultDiv.innerHTML = `<strong>${element}:</strong> ${found}`;

                highlightElement(element);
            } else {
                resultDiv.style.display = "block";
                resultDiv.innerHTML = "Element configuration not found.";

                resetElementStyles();
            }
        } catch (error) {
            console.error("Error fetching element data:", error);
            resultDiv.style.display = "block";
            resultDiv.innerHTML = "Error fetching element data.";

            resetElementStyles();
        }
    } else {
        const elements = await loadData();
        const query = input.toLowerCase();
        const foundString = elements[query];

        if (!foundString) {
            resultDiv.style.display = "none";
            resetElementStyles();

            return;
        }

        const found = foundString.split("-")[1];
        const element = foundString.split("-")[0];

        resultDiv.style.display = "block";

        if (found) {
            resultDiv.innerHTML = `<strong>${element}:</strong> ${found}`;

            highlightElement(element);
        } else {
            resultDiv.innerHTML = "Element not found.";

            resetElementStyles();
        }
    }
}

/**
 * Highlights the specified element in the periodic table.
 * @param {string} input - The symbol or name of the element to highlight.
 */
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

/**
 * Resets the styles of all elements in the periodic table to their default state.
 */
function resetElementStyles() {
    const tds = document.querySelectorAll('td');

    tds.forEach(td => {
        td.style.transform = '';
        td.style.zIndex = '';
        td.style.boxShadow = '';
    });
}

document.querySelector(".ui-input").addEventListener("input", searchElement);

/*login*/

/**
 * Initializes the login functionality by displaying the username if logged in.
 * Hides user info if no username is found in local storage.
 */
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcome-message');
    const userInfo = document.getElementById('user-info');

    if (username) {
        welcomeMessage.textContent = `Hello, ${username}!`;
    } else {
        userInfo.style.display = 'none';
    }
});