var csvData = "";
var flashcards = "";

var currentIndex = 0;
var correctAnswers = [];

const cardContainer = document.getElementById('flashcards');
const answerInput = document.getElementById('answerInput');

const selectContainer = document.getElementById("select-container");
const progressContainer = document.getElementById("progress-container");

const fileSelector = document.getElementById("file-selector");
const progressBar = document.getElementById("loading-deck");



function startLoad() {
    progressContainer.classList.toggle("hidden", true);
}

function loadDeck() {
    selectContainer.classList.toggle("hidden", true);
    progressContainer.classList.toggle("hidden", false);

    progressBar.value = 0;

    const file = fileSelector.files[0];

    const reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
          csvData = reader.result;
        },
        false,
    );

    

    if (file) {
        reader.addEventListener(
            "loadend",
            () => {
                doneReading();
            },
            false,
        );

        reader.readAsText(file);
    }

}

function doneReading() {
    correctAnswers = Array(flashcards.length).fill(false);

    let trimmedCards = csvData.trim();
    let completeCards = trimmedCards.split('\n');
    flashcards = completeCards.map(line => line.split(','));

    renderCards();

    progressContainer.classList.toggle("hidden", true);
}

function renderCards() {
    cardContainer.innerHTML = '';
    flashcards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        // Add correct class if the answer was correct previously
        if (correctAnswers[index]) {
            cardElement.classList.add('card-flip');
        }

        cardElement.innerHTML = `
            <div class="card-front">${card[0]}</div>
            <div class="card-back">${card[1]}</div>
        `;
        cardContainer.appendChild(cardElement);
    });

    centerCurrentCard();
}

function centerCurrentCard() {
    const cards = cardContainer.children;
    // 240 = 220 (width) + 2 * 10 (margin)
    const offset = (cards.length / 2 - 0.5) * 240;
    const position = offset - currentIndex * 240; 
    cardContainer.style.transform = `translateX(${position}px)`;
}

function checkAnswer() {
    if (currentIndex === flashcards.length) {
        return;
    }

    const currentCard = flashcards[currentIndex][1];
    const userAnswer = answerInput.value.trim();
    
    const currentCardElement = cardContainer.children[currentIndex];

    if (userAnswer.toLowerCase() === currentCard.toLowerCase()) {
        correctAnswers[currentIndex] = true;
        currentCardElement.classList.add('card-flip');
        currentCardElement.classList.add('correct');

        answerInput.value = '';

        setTimeout(() => {
            currentIndex++;
            centerCurrentCard();
        }, 1000);
    } else {
        currentCardElement.classList.add('incorrect');
        answerInput.classList.add('shake');

        setTimeout(() => {
            currentCardElement.classList.remove('incorrect');
            answerInput.classList.remove('shake');
        }, 500);
    }
}

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// load deck and perform initial render
startLoad();
