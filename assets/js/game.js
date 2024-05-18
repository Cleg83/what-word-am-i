// Function to set background color of welcome page & first game page.
function setBackgroundColor() {
  document.body.style.backgroundColor = "#ba4a99";
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
import wordList from './word-list.js';

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

