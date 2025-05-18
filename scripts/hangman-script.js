let word = "";
let clue = "";
let guessed = [];
let attempts = 7;

async function getCompoundInfo(cid) {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const commonName = data.Record?.RecordTitle || "Unknown";

        return commonName.toLowerCase();
    } catch (error) {
        console.error("Error fetching common name:", error);
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
        updateStatus(`❌ ${attempts} attempts left ❌`);

        document.getElementById("used_letters").innerHTML = guessed
            .filter(l => !word.includes(l))
            .join(' ');
    } else {
        updateStatus("Correct ✅");
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
    const compoundName = await getCompoundInfo(cid);

    if (!compoundName) {
        updateStatus("❌ Failed to load compound.");
        return;
    }

    word = compoundName.replace(/[^a-z]/g, '');
    clue = ""; // coming in the future
    guessed = [];
    attempts = 7;

    displayWordProgress();
    createLetterButtons();
    updateStatus("Start guessing!");
    document.addEventListener("keydown", onKeyDown);
}

startHangman().then(_ => {
    console.log("Hangman game started");
}).catch(e => {
    console.error("Error starting Hangman game:", e);
    updateStatus("❌ Failed to start game.");
});
    