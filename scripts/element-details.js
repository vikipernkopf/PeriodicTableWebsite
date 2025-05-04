/**
 * Initializes the page by loading and displaying element details based on the URL query parameter.
 * Fetches additional data from the PubChem API and displays it on the page.
 */
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const elementSymbol = urlParams.get('element');

    if (!elementSymbol) {
        showError('No element specified');

        return;
    }

    const elementsArray = await loadData();

    const elementData = elementsArray.find(element => element.symbol.toLowerCase() === elementSymbol.toLowerCase());

    if (!elementData) {
        showError('Element not found');

        return;
    }

    const pubchemResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/element/${elementData.atomicNumber}/JSON/`);

    if (!pubchemResponse.ok) {
        console.error(`API Error: ${pubchemResponse.status} - ${pubchemResponse.statusText}`);
    }

    const pubchemData = await pubchemResponse.json();

    displayElementInfo(elementData, pubchemData);
});

/**
 * Loads element data by first attempting to fetch it from the server.
 * If the server fetch fails, it falls back to loading from a local file.
 * @returns {Promise<Array>} A promise that resolves to the elements array.
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

            return [];
        }
    }
}

/**
 * Fetches element data from the server.
 * @returns {Promise<Array>} A promise that resolves to the elements array.
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

    return elementsArray;
}

/**
 * Fetches element data from a local file.
 * @returns {Promise<Array>} A promise that resolves to the elements array.
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

    return data.elements;
}

/**
 * Displays detailed information about an element using data from the provided element object and PubChem API response.
 * @param {Object} elementData - The element data object containing basic information (e.g., name, symbol, atomic number).
 * @param {Object} pubchemData - The PubChem API response object containing additional element details.
 */
function displayElementInfo(elementData, pubchemData) {
    document.getElementById('element-name').textContent = `${elementData.name} (${elementData.symbol})`;

    const basicInfo = document.getElementById('basic-info');

    basicInfo.innerHTML = `
        <h2>Basic Information</h2>
        <p>Atomic Number: ${elementData.atomicNumber}</p>
        <p>Atomic Mass: ${elementData.atomicMass}</p>
        <p>Phase: ${elementData.phase}</p>
        <p>Category: ${pubchemData.Record.Section[1].Section[10].Information[0].Value.StringWithMarkup[0].String}</p>
        <p>Group: ${pubchemData.Record.Section[1].Section[11].Information[0].Value.StringWithMarkup[0].String}</p>
        <p>Period: ${pubchemData.Record.Section[1].Section[12].Information[0].Value.StringWithMarkup[0].String}</p>
    `;

    const additionalInfo = document.getElementById('additional-info');

    additionalInfo.innerHTML = `
        <h2>Additional Information</h2>
        <p>Electron configuration: ${elementData.electronConfiguration}</p>
        <p>Electronegativity: ${pubchemData.Record.Section[1].Section[6].Information[0].Value.Number[0]} ${pubchemData.Record.Section[1].Section[6].Information[0].Value.Unit}</p>
        <p>Density: ${pubchemData.Record.Section[1].Section[13].Information[0].Value.StringWithMarkup[0].String}</p>
    `;

    const text = document.getElementById('text');

    text.innerHTML = `
        <h2>Description</h2>
        <p>${pubchemData.Record.Section[3].Information[0].Value.StringWithMarkup[0].String}</p>
        <p>${pubchemData.Record.Section[3].Information[0].Value.StringWithMarkup[1].String}</p>
        <p>${pubchemData.Record.Section[2].Information[0].Value.StringWithMarkup[0].String}</p>
    `;
}

/**
 * Displays an error message inside the 'element-info' element.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    document.getElementById('element-info').innerHTML = `<div class="error">${message}</div>`;
}