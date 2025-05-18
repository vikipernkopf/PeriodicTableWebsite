document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.querySelector('.flashcard');
    const elementSymbol = document.getElementById('element-symbol');
    const elementName = document.getElementById('element-name');
    const nextButton = document.getElementById('next-card');

    // Get elements from the JSON file
    let elements = [];
    let currentIndex = 0;

    // Load elements data
    fetch('../data/elements.json')
        .then(response => response.json())
        .then(data => {
            elements = data.elements;
            shuffleElements();
            displayCurrentElement();
        })
        .catch(error => console.error('Error loading elements:', error));

    // Flip card on click
    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });

    // Next card button
    nextButton.addEventListener('click', () => {
        flashcard.classList.remove('flipped');
        currentIndex = (currentIndex + 1) % elements.length;

        // Wait for the flip animation to complete before changing content
        setTimeout(displayCurrentElement, 300);
    });

    // Fisher-Yates shuffle algorithm
    function shuffleElements() {
        for (let i = elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
    }

    function displayCurrentElement() {
        const currentElement = elements[currentIndex];
        elementSymbol.textContent = currentElement.symbol;
        elementName.textContent = currentElement.name;
    }
});