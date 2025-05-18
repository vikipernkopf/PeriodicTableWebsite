let word = "";
let clue = "";
let guessed = [];
let attempts = 7;

async function getCompoundInfo(cid) {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/IUPACName,MolecularFormula/JSON`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const compound = data.PropertyTable.Properties[0];
        return {
            name: compound.IUPACName.toLowerCase(),
            formula: compound.MolecularFormula
        };
    } catch (error) {
        console.error("Error fetching compound:", error);
        return null;
    }
}

function displayWordProgress() {
    const display = word
        .split('')
        .map(char => (guessed.includes(char) ? char : '_'))
        .join(' ');
    document.getElementById("word").textContent = display;
    return display;
}

function updateStatus(msg) {
    document.getElementById("status").textContent = msg;
}

function endGame(message) {
    updateStatus(message);
    document.getElementById("letters").innerHTML = ""; // disable buttons
    document.removeEventListener("keydown", onKeyDown);
}

function handleGuess(letter) {
    if (!letter.match(/^[a-z]$/) || guessed.includes(letter) || attempts <= 0) return;

    guessed.push(letter);
    if (!word.includes(letter)) {
        attempts--;
        updateStatus(`❌ Wrong! Attempts left: ${attempts}`);
    } else {
        updateStatus("✅ Correct!");
    }

    const currentDisplay = displayWordProgress();
    if (!currentDisplay.includes('_')) {
        endGame(`🎉 You win! The word was: ${word}`);
    } else if (attempts === 0) {
        endGame(`💀 Game over. The word was: ${word}`);
    }
}

function createLetterButtons() {
    const container = document.getElementById("letters");
    container.innerHTML = "";
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        const btn = document.createElement("button");
        btn.textContent = letter;
        btn.onclick = () => handleGuess(letter);
        container.appendChild(btn);
    }
}

function onKeyDown(e) {
    const letter = e.key.toLowerCase();
    handleGuess(letter);
}

async function startHangman() {
    const cid = Math.floor(Math.random() * 100) + 1;
    const compound = await getCompoundInfo(cid);

    if (!compound) {
        updateStatus("❌ Failed to load compound.");
        return;
    }

    word = compound.name.replace(/[^a-z]/g, '');
    clue = compound.formula;
    guessed = [];
    attempts = 7;

    document.getElementById("clue").textContent = `Clue: Molecular formula is ${clue}`;
    displayWordProgress();
    createLetterButtons();
    updateStatus("Start guessing!");
    document.addEventListener("keydown", onKeyDown);
}

startHangman();
    