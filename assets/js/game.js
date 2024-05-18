// Function to set background color of welcome page & first game page.
function setBackgroundColor() {
  document.body.style.backgroundColor = "#e68eb6";
}

//Sets background color once DOMcontentLoaded
document.addEventListener("DOMContentLoaded", function () {
  setBackgroundColor();
});


// Function to display welcome container
function displayWelcome() {
  $("#welcome-container").removeClass("hide");
  $("#game-container").addClass("hide");
  $("#player-info").focus();
}

// Call to display the above function
$(document).ready(function () {
  displayWelcome();
});

// Event listener to display GO! button when user starts typing in the input field
document.getElementById("player-info").addEventListener("input", function (event) {
  if (event.type === "input") {
    if (this.value.trim() === "") {
      document.getElementById("go-btn").classList.add("hide");
    } else {
      document.getElementById("go-btn").classList.remove("hide");
    }
  }
});

// GO! button click event to call the gameDisplay function
$("#go-btn").on("click", function () {
  console.log("Button clicked!");
  let playerName = $("#player-info").val().trim();
  $("#player-name").text("Playing as " + playerName);
  gameDisplay();
  launchGame();
});

//Function to display the game page
function gameDisplay() {
  $("#welcome-container").addClass("hide");
  $("#game-container").removeClass("hide");
}

// Event listener to allow the enter key to function as the click to load game
document.getElementById("player-info").addEventListener("keypress", function (event) {
  if (event.type === "keypress" && event.key === "Enter") {
    event.preventDefault();
    if (this.value.trim() !== "") {
      document.getElementById("go-btn").click();
    } else {
      alert("Please enter your name or initials before starting the game!");
    }
  }
});

// Import the game word list from word-list.js
import wordList from "./word-list.js";

// Variables to store the game word, index (because the game word is a random index of the word-list array) and guessed letters array
let randomWord;
let randomIndex;
let guessedLetters = [];

// Flag to indicate if at least one correct letter has been guessed
let correctLetterGuessed = false;

const hintButton = document.getElementById("hint-btn");

function launchGame() {
  hintButton.style.display = "block";
  hintButton.textContent = "Hint 1";
  hintButton.style.width = "100px";

  // Check if there are available words
  if (wordList.length === 0) {
    return;
  }

  // Selects a random index from wordList array (that hasn't been used before)
  randomIndex = Math.floor(Math.random() * wordList.length);
  randomWord = wordList[randomIndex].toLowerCase();

  // Remove the selected word from wordList to ensure it's not repeated
  wordList.splice(randomIndex, 1);

  displayWord(randomWord.length);

  // Set contentEditable for the first letter div
  let firstLetterDiv = document.querySelector(".letter-div");
  if (firstLetterDiv) {
    firstLetterDiv.contentEditable = true;
    firstLetterDiv.focus();
  }
}

// Function to display blank letter divs for the game word
function displayWord(wordLength) {
  let wordContainer = document.getElementById("word-container");
  if (!wordContainer) {
    console.error("Word container not found!");
    return;
  }
  wordContainer.innerHTML = "";
  guessedLetters = [];

  for (let i = 0; i < wordLength; i++) {
    let letterDiv = document.createElement("div");
    letterDiv.classList.add("letter-div");
    letterDiv.contentEditable = true;
    letterDiv.dataset.index = i;
    wordContainer.appendChild(letterDiv);
  }
}

// Function to check if a letter div is editable
function isEditable(letterDiv) {
  return letterDiv.textContent.trim() === "" || (letterDiv.textContent.trim() !== "" && !guessedLetters[letterDiv.dataset.index]);
}

// Event listener for input on letter divs
document.getElementById("word-container").addEventListener("input", function (event) {
  let target = event.target;
  let nextLetterDiv = target.nextElementSibling;
  let pressedKey = event.data;

  // Only allow letters to be input into the letter divs
  if (/[a-zA-Z]/.test(pressedKey)) {
    // Always replace the content of the div with the pressed key
    target.textContent = pressedKey;

    // Place cursor at the end of the text content for better UI
    placeCursorAtEnd(target);

    // Move focus to the next letter div
    if (nextLetterDiv && isEditable(nextLetterDiv)) {
      nextLetterDiv.contentEditable = true;
      nextLetterDiv.focus();
      placeCursorAtEnd(nextLetterDiv);
    }
  }

  // Check if at least one correct letter has been guessed
  if (!correctLetterGuessed) {
    let userGuess = "";
    let letterDivs = document.querySelectorAll("#word-container .letter-div");
    letterDivs.forEach(function (div, index) {
      userGuess += div.textContent.trim().toLowerCase();
    });
    correctLetterGuessed = userGuess.split("").some((char, index) => char === randomWord[index]);
    if (correctLetterGuessed) {
      letterDivs.forEach(function (div) {
        guessedLetters[div.dataset.index] = true;
      });
    }
  }
});

// Event listener for keydown on letter divs for navigation
document.getElementById("word-container").addEventListener("keydown", function (event) {
  let target = event.target;
  let key = event.key;

  // Due to the placing the cursor at the end of the character, the below makes the delete key function as a backspace
  if (key === "Delete") {
    event.preventDefault();
    target.textContent = "";

    let prevLetterDiv = getPrevNavigableLetterDiv(target);
    if (prevLetterDiv) {
      prevLetterDiv.focus();
      placeCursorAtEnd(prevLetterDiv);
    }
  } else if (key === "ArrowRight") {
    let nextLetterDiv = getNextNavigableLetterDiv(target);
    if (nextLetterDiv) {
      setTimeout(function () {
        nextLetterDiv.focus();
        placeCursorAtEnd(nextLetterDiv);
      }, 0);
    }
  } else if (key === "ArrowLeft") {
    let prevLetterDiv = getPrevNavigableLetterDiv(target);
    if (prevLetterDiv) {
      setTimeout(function () {
        prevLetterDiv.focus();
        placeCursorAtEnd(prevLetterDiv);
      }, 0);
    }
  } else if (key === "Backspace") {
    target.textContent = "";

    let prevLetterDiv = getPrevNavigableLetterDiv(target);
    if (prevLetterDiv) {
      setTimeout(function () {
        prevLetterDiv.focus();
        placeCursorAtEnd(prevLetterDiv);
      }, 0);
    }
  }

  // Prevent default Enter key behavior
  if (key === "Enter") {
    event.preventDefault();
    document.getElementById("submit-btn").click();
  }
});

// Function to get the next navigable letter div
function getNextNavigableLetterDiv(letterDiv) {
  let nextLetterDiv = letterDiv.nextElementSibling;
  while (nextLetterDiv && !isNavigable(nextLetterDiv)) {
    nextLetterDiv = nextLetterDiv.nextElementSibling;
  }
  return nextLetterDiv;
}

// Function to get the previous navigable letter div
function getPrevNavigableLetterDiv(letterDiv) {
  let prevLetterDiv = letterDiv.previousElementSibling;
  while (prevLetterDiv && !isNavigable(prevLetterDiv)) {
    prevLetterDiv = prevLetterDiv.previousElementSibling;
  }
  return prevLetterDiv;
}

// Function to check if a letter div is navigable
function isNavigable(letterDiv) {
  return letterDiv.textContent.trim() === "" || letterDiv.contentEditable === "true";
}

// Function to focus the first blank letter div
function focusFirstBlankLetterDiv() {
  let letterDivs = document.querySelectorAll("#word-container .letter-div");
  for (let i = 0; i < letterDivs.length; i++) {
    if (letterDivs[i].textContent.trim() === "") {
      letterDivs[i].focus();
      break;
    }
  }
}

// Function to place the cursor at the end of the content in a contentEditable div
function placeCursorAtEnd(el) {
  let range = document.createRange();
  let sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Submit button event listener that handles updating correct letter, user score, updating score and showing score message
document.getElementById("submit-btn").addEventListener("click", function () {
  let userGuess = Array.from(document.querySelectorAll("#word-container .letter-div"))
    .map(div => div.textContent.trim().toLowerCase())
    .join("");

  if (userGuess === randomWord) {
    var score = 0;
    switch (hintButton.textContent) {
      case "Hint 1":
        score = 5;
        break;
      case "Hint 2":
        score = 3;
        break;
      case "Hint 3":
        score = 2;
        break;
      default:
        score = 1;
        break;
    }
    alert(`WWAMI\n\nYou scored ${score} point${score > 1 ? "s" : ""}!\n\n${getScoreMessage(score)}`);
    updateTotalScore(score);
    scoreTally[score]++;
    console.log(scoreTally);
    newRound();
  } else {
    alert("Incorrect. Try again!");
    updateIncorrectLetters(userGuess);
  }
});

function getScoreMessage(score) {
  switch (score) {
    case 5:
      return "Perfect!";
    case 3:
      return "Great work!";
    case 2:
      return "Pretty, pretty, pretty good!";
    case 1:
      return "1 point is better than 0 points, nicely done!";
    default:
      return "";
  }
}

function updateIncorrectLetters(userGuess) {
  let letterDivs = document.querySelectorAll("#word-container .letter-div");
  let hasCorrectGuess = false;
  letterDivs.forEach(function (div, index) {
    if (userGuess[index] !== randomWord[index]) {
      div.textContent = "";
    } else {
      hasCorrectGuess = true;
      div.contentEditable = false;
    }
  });
  if (hasCorrectGuess) {
    focusFirstBlankLetterDiv();
  } else {
    letterDivs[0].focus();
  }
}

//Variable to tally how many of each score the user obtains
let scoreTally = {
  5: 0,
  3: 0,
  2: 0,
  1: 0,
  0: 0
};

// Variable to store the total score
let totalScore = 0;

// Function to update and then display the total score
function updateTotalScore(score) {
  totalScore += score;
  document.getElementById("total-score").textContent = "Total Score: " + totalScore;
}
