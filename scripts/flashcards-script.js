document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.querySelector('.flashcard');
    const elementSymbol = document.getElementById('element-symbol');
    const elementName = document.getElementById('element-name');
    const nextButton = document.getElementById('next-card');
    const modeToggleButton = document.getElementById('mode-toggle');

    let symbolMode = true;
    let elements = [];
    let currentIndex = 0;
    let nextIndex = 0;
    let changingContent = false;

    async function loadData() {
        try {
            const response = await fetch("https://elements.black2.cf/elements");

            if (!response.ok) {
                console.error(`Server returned ${response.status}: ${response.statusText}`);

                return loadLocalData();
            }

            const data = await response.json();

            return !Array.isArray(data) ? (data?.elements ?? []) : data;
        } catch (error) {
            console.error("Error fetching data from server:", error);

            return loadLocalData();
        }
    }

    async function loadLocalData() {
        try {
            const response = await fetch('../data/elements.json');
            const data = await response.json();

            return data.elements;
        } catch (error) {
            console.error("Error loading local data:", error);

            return [];
        }
    }

    loadData().then(data => {
        elements = data;

        if (elements.length > 0) {
            shuffleElements();
            displayCurrentElement();
        } else {
            console.error("No elements data available");
        }
    });

    // Use opacity to hide content during transitions
    function hideContent() {
        elementSymbol.style.opacity = '0';
        elementName.style.opacity = '0';
    }

    function showContent() {
        elementSymbol.style.opacity = '1';
        elementName.style.opacity = '1';
    }

    // Start with visible content
    showContent();

    // Add transition for opacity
    elementSymbol.style.transition = 'opacity 0.2s';
    elementName.style.transition = 'opacity 0.2s';

    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });

    nextButton.addEventListener('click', () => {
        if (changingContent) {
            return;
        }

        changingContent = true;
        hideContent();

        // Wait for content to fade out before flipping
        setTimeout(() => {
            flashcard.classList.remove('flipped');
            nextIndex = (currentIndex + 1) % elements.length;

            // Update content halfway through the flip
            setTimeout(() => {
                currentIndex = nextIndex;
                displayCurrentElement();
                showContent();
                changingContent = false;
            }, 300);
        }, 200);
    });

    modeToggleButton.addEventListener('click', () => {
        if (changingContent) {
            return;
        }

        symbolMode = !symbolMode;
        modeToggleButton.textContent = symbolMode ? 'Switch to Atomic Number Mode' : 'Switch to Symbol Mode';

        if (flashcard.classList.contains('flipped')) {
            changingContent = true;
            hideContent();

            setTimeout(() => {
                flashcard.classList.remove('flipped');

                setTimeout(() => {
                    displayCurrentElement();
                    showContent();
                    changingContent = false;
                }, 300);
            }, 200);
        } else {
            hideContent();

            setTimeout(() => {
                displayCurrentElement();
                showContent();
            }, 200);
        }
    });

    function shuffleElements() {
        for (let i = elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
    }

    function displayCurrentElement() {
        const currentElement = elements[currentIndex];

        if (symbolMode) {
            elementSymbol.textContent = currentElement.symbol;
        } else {
            elementSymbol.textContent = currentElement.atomicNumber;
        }

        elementName.textContent = currentElement.name;
    }
});