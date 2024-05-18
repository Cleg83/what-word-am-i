// Function to set background color of welcome page & first game page.
function setBackgroundColor() {
  document.body.style.backgroundColor = "#ba4a99";
}

//Sets background color once DOMcontentLoaded
document.addEventListener("DOMContentLoaded", function () {
  setBackgroundColor();
});

//EVent listener for header home link that confirms if the user wants to return home and lose game progress
document.getElementById("WWAMI").addEventListener("click", function() {
  const returnHome = confirm("Are you sure you wish to return home?\n\nGame progress will be lost!");
  if(returnHome) {
    clearHintContainers();
    clearPlayerInfo();
    setBackgroundColor();
    displayWelcome();
    document.getElementById("total-score").textContent = "Total Score: ";
    document.getElementById("go-btn").classList.add("hide");
  } else {
  }
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

    // Place at the end of the text content for better UI
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
      userGuess += div.textContent.trim().toLowerCase(); // Concatenate the text content of all divs
    });
    correctLetterGuessed = userGuess.split('').some((char, index) => char === randomWord[index]);
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
      setTimeout(function() {
        nextLetterDiv.focus();
        placeCursorAtEnd(nextLetterDiv);
      }, 0);
    }
  } else if (key === "ArrowLeft") {
    let prevLetterDiv = getPrevNavigableLetterDiv(target);
    if (prevLetterDiv) {
      setTimeout(function() {
        prevLetterDiv.focus();
        placeCursorAtEnd(prevLetterDiv);
      }, 0);
    }
  } else if (key === "Backspace") {
    target.textContent = "";

    let prevLetterDiv = getPrevNavigableLetterDiv(target);
    if (prevLetterDiv) {
      setTimeout(function() {
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
  var userGuess = Array.from(document.querySelectorAll("#word-container .letter-div"))
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
    alert(`WWAMI\n\nYou scored ${score} point${score > 1 ? 's' : ''}!\n\n${getScoreMessage(score)}`);
    updateTotalScore(score);
    scoreCounts[score]++; 
    console.log(scoreCounts);
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
var scoreCounts = {
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

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}

function fetchSynonyms(word, callback) {
  let xhr = new XMLHttpRequest();
  let baseURL = "https://api.wordnik.com/v4/word.json/";
  let hintOne = `${word}/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=100&api_key=`; // Increase the limit to 10 for more synonyms
  let apiKey = getApiKey(); 

  xhr.open("GET", baseURL + hintOne + apiKey);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
 
        let data = JSON.parse(this.responseText);
   
        console.log("Synonyms data:", data);
       
        let synonyms = data[0].words || []; 

        synonyms = shuffleArray(synonyms);
        synonyms = synonyms.slice(0, 10);

        callback(null, synonyms);
      } else {
        callback("Error fetching synonyms: " + this.statusText, null);
      }
    }
  };
}

const hintOneContainer = document.getElementById("hint-one");

function displaySynonyms(synonyms) {
  let synonymsString = synonyms.join(", "); 
  synonymsString = synonymsString.charAt(0).toUpperCase() + synonymsString.slice(1);
  hintOneContainer.innerHTML = "<h4 class='hint-heading'>My synonyms are:</h4>" + synonymsString; // Display the synonyms as a single string
  hintOneContainer.style.display = "block";
}

function fetchDefinition(word, callback) {
  let xhr = new XMLHttpRequest();
  let baseURL = "https://api.wordnik.com/v4/word.json/";
  let hintThree = `${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=webster&useCanonical=false&includeTags=false&api_key=`; 
  let apiKey = getApiKey(); 

  xhr.open("GET", baseURL + hintThree + apiKey);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {

        let data = JSON.parse(this.responseText);
        console.log("Definition data:", data);

        let definition = data[0].text || ""; 

        callback(null, definition);
      } else {
        callback("Error fetching definition: " + this.statusText, null);
      }
    }
  };
}

const hintTwoContainer = document.getElementById("hint-two");

function displayDefinition(definition) {
  hintTwoContainer.innerHTML = "<h4 class='hint-heading'>My definition is:</h4>" + definition;
  hintTwoContainer.style.display = "block"; 
}

function fetchRhymes(word, callback) {
  console.log("Fetching rhymes for word:", word); 
  let xhr = new XMLHttpRequest();
  let baseURL = "https://api.wordnik.com/v4/word.json/";
  let hintOne = `${word}//relatedWords?useCanonical=false&relationshipTypes=rhyme&limitPerRelationshipType=100&api_key=`; // Increase the limit to 10 for more synonyms
  let apiKey = getApiKey(); 

  xhr.open("GET", baseURL + hintOne + apiKey);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log("rhymes data:", data);

        let rhymes = data[0].words || []; 
        rhymes = shuffleArray(rhymes);

        rhymes = rhymes.slice(0, 10);

        callback(null, rhymes);
      } else {
        callback("Error fetching rhymes: " + this.statusText, null);
      }
    }
  };
}

const hintThreeContainer = document.getElementById("hint-three");

function displayRhymes(rhymes) {
  let rhymeString = rhymes.join(", "); 
  rhymeString = rhymeString.charAt(0).toUpperCase() + rhymeString.slice(1);
  hintThreeContainer.innerHTML = "<h4 class='hint-heading'>My rhyming words are:</h4>" + rhymeString; 
  hintThreeContainer.style.display = "block"; 
}

function clearHintContainers() { 
  hintOneContainer.innerHTML = ""; 
  hintOneContainer.style.display = "none";
  hintTwoContainer.innerHTML = ""; 
  hintTwoContainer.style.display = "none"; 
  hintThreeContainer.innerHTML = ""; 
  hintThreeContainer.style.display = "none"; 
}

function updateHintButton() {
  if (hintButton.textContent == "Hint 1") {
    hintButton.textContent = "Hint 2";
  } else if (hintButton.textContent == "Hint 2") {
    hintButton.textContent = "Hint 3";
  }  else {
    hintButton.textContent = "";
    hintButton.style.display = "none";
  }
}

document.getElementById("hint-btn").addEventListener("click", function () {
  console.log("Hint button clicked"); 
  if (hintButton.textContent == "Hint 1") {
    if (randomWord) {
      fetchSynonyms(randomWord, function(error, data) {
        if (error) {
          console.error(error);
        } else {
          displaySynonyms(data);
        }
      });
    } else {
      console.error("Random word is not defined");
    }
  } else if (hintButton.textContent == "Hint 2") {
    if (randomWord) {
      fetchDefinition(randomWord, function(error, definition) {
        if (error) {
          console.error(error);
        } else {
          displayDefinition(definition);
        }
      });
    } else {
      console.error("Random word is not defined");
    }
  } else if (hintButton.textContent == "Hint 3") {
    if (randomWord) {
      fetchRhymes(randomWord, function(error, data) {
        if (error) {
          console.error(error);
        } else {
          displayRhymes(data);
        }
      });
    } else {
      console.error("Random word is not defined");
    }
  }
  updateHintButton();
});

// Event listener for Pass button that checks if user wants to pass, updates score if they do and shows what the game word was
document.getElementById("pass-btn").addEventListener("click", function () {
  const passRound = confirm("Are you sure you want to pass?\n\nYou'll get 0 points");
  if (passRound) {
    alert(`Bad luck!\n\nThe word was ${randomWord}.`);
    updateTotalScore(0);
    scoreCounts[0]++;
    console.log(scoreCounts);
    newRound();
  } else {
  }
});

//Function to move to the next round / word
function newRound() {

  randomWord = "";
  guessedLetters = [];
  correctLetterGuessed = false;

  // Clear word container
  const wordContainer = document.getElementById("word-container");
  if (wordContainer) {
    wordContainer.innerHTML = "";
  }

  clearHintContainers();

  let newGameColor = getRandomColor();
  document.body.style.backgroundColor = newGameColor;

  launchGame();
}

//Background colors for each new round
const backgroundColors = ["#ba4a99", "#e14040", "#9e7f29", "#f637f6", "#8f8c06", "#544b75", "#a26ca3", "#47ad62", "#8f5656"];

let defaultColor = "#ba4a99";

// Function to generate a random color and to ensure the same color isn't repeated immediately
function getRandomColor() {
  let randomColor;
  do {
    randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
  } while (randomColor === defaultColor); 
  defaultColor = randomColor; 
  return randomColor;
}

//Clears input field on welcome page to allow new name to be input
function clearPlayerInfo() {
  let playerInfo = document.getElementById("player-info");
  playerInfo.value = "";
  console.log("Resetting player info");
}

// Event listener for finish button that ultimately resets the game state
document.getElementById("finish-btn").addEventListener("click", function() {
  const finishGame = confirm("Are you sure you wish to WWAMI no more?");
  if (finishGame) {
    alert("Thank you for playing WWAMI");
    clearHintContainers();
    clearPlayerInfo();
    setBackgroundColor();
    displayWelcome();
    document.getElementById("total-score").textContent = "Total Score: ";
    document.getElementById("go-btn").classList.add("hide");
  } else {
  }
});




