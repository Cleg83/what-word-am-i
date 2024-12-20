// Welcome page------------------------------------------------------------------------------

// Function to set background color of welcome page & first game page.
function setBackgroundColor() {
  document.body.style.backgroundColor = "#e68eb6";
}

// Function to make finish button the same color as the body on page load
function setFinishButtonColor() {
  const finishButton = document.getElementById('finish-btn');
  finishButton.style.backgroundColor = "rgba(230, 142, 182, 0.7)";
}

//Sets background color once DOMcontentLoaded
document.addEventListener("DOMContentLoaded", function () {
  setBackgroundColor();
  setFinishButtonColor();
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

let playerName;
// GO! button click event to call the gameDisplay function
$("#go-btn").on("click", function () {
  console.log("Button clicked!");
  playerName = $("#player-info").val().trim();
  $("#player-name").html("<p>Playing as " + "<strong>" + playerName + "</strong>" + "</p>");
  gameDisplay();
  launchGame();
});

// Game logic--------------------------------------------------------------------

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
      Swal.fire({
        icon: "warning",
        iconColor: "#ea9d2a",
        text: "Please enter your name or initials before starting the game!",
        confirmButtonColor: "#ea9d2a",
      });
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

  // Filter the word list based on screen size
  let filteredWordList;
  if (window.innerWidth <= 310) {
    filteredWordList = wordList.filter(word => word.length <= 5);
  } else if (window.innerWidth <= 500) {
    filteredWordList = wordList.filter(word => word.length <= 6);
  } else {
    filteredWordList = wordList.slice(); // Use the original word list
  }

  // Check if there are words remaining after filtering
  if (filteredWordList.length === 0) {
    // Reset the word list if no words meet the criteria
    filteredWordList = wordList.slice();
  }

  // Selects a random index from the filtered word list
  randomIndex = Math.floor(Math.random() * filteredWordList.length);
  randomWord = filteredWordList[randomIndex].toLowerCase();

  // Remove the selected word from the word list to ensure it's not repeated
  wordList.splice(wordList.indexOf(randomWord), 1);

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
  } else if (!/[a-zA-Z]/.test(pressedKey)) {
    target.textContent = "";
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
    Swal.fire({
      title: 'WWAMI',
      text: `You scored ${score} point${score > 1 ? "s" : ""}!\n\n${getScoreMessage(score)}`,
      icon: 'success',
      iconColor: "#22d283",
      confirmButtonColor: "#22d283",
      allowEnterKey: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        title: 'logo-font',
      }
    }).then(() => {
      updateTotalScore(score);
      scoreTally[score]++;
      console.log(scoreTally);
      newRound();
    });
  } else {
    Swal.fire({
      title: 'Incorrect',
      text: 'Try again!',
      icon: 'error',
      iconColor: "#fb7474",
      confirmButtonColor: "#ea9d2a",
      allowEnterKey: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      updateIncorrectLetters(userGuess);
    });
  }
});

//Function to display correct message for the score achieved
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

//Function to update letter divs after submitting a guess
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

const gameCall = "9rncocu2rhutlrln1gv4wcpvzowa06bxz80g3t7qvbxsmwiah";

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

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const callGame = btoa(gameCall);

// Function to fetch the synonyms of the game word
function fetchSynonyms(word, callback) {
  let xhr = new XMLHttpRequest();
  let baseURL = "https://api.wordnik.com/v4/word.json/";
  let hintOne = `${word}/relatedWords?useCanonical=false&relationshipTypes=synonym&limitPerRelationshipType=100&api_key=`;
  let gameOn = atob(callGame);

  xhr.open("GET", baseURL + hintOne + gameOn);
  xhr.send();

  xhr.onreadystatechange = function () {
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
        Swal.fire({
          title: "We couldn't find the synonyms for this word, apologies.",
          text: "We can skip this round or you can guess again.\n\nPress OK to skip or Cancel to guess again.",
          icon: 'error',
          iconColor: "#fb7474",
          showCancelButton: true,
          confirmButtonText: 'Skip Round',
          confirmButtonColor: "#ea9d2a",
          cancelButtonText: 'Guess Again',
          cancelButtonColor: "#fb7474",
          allowEnterKey: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `The word was ${randomWord}.`,
              text: "Apologies if this would have been your guess.",
              confirmButtonColor: "#ea9d2a",
              confirmButtonText: "Next word"
            }).then(() => {
              newRound();
            });
          } else {
            hintButton.textContent = "Hint 1";
          }
        });
      }
    }
  };
}

const hintOneContainer = document.getElementById("hint-one");

// Function to display the synonyms of the game word
function displaySynonyms(synonyms) {
  const hintContainer = document.getElementById("hint-container")
  let synonymsString = synonyms.join(", ");
  synonymsString = synonymsString.charAt(0).toUpperCase() + synonymsString.slice(1);
  hintContainer.classList.remove('hide');
  hintContainer.classList.add('show');
  hintOneContainer.innerHTML = "<h4 class='hint-heading'>Synonyms:</h4>" + synonymsString;
  hintOneContainer.style.display = "block";
}

// Function to fetch the definition of the game word
function fetchDefinition(word, callback) {
  let xhr = new XMLHttpRequest();
  let baseURL = "https://api.wordnik.com/v4/word.json/";
  let hintTwo = `${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=webster&useCanonical=false&includeTags=false&api_key=`;
  let gameOn = atob(callGame);

  xhr.open("GET", baseURL + hintTwo + gameOn);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log("Definition data:", data);

        let definition = data[0].text || "";

        callback(null, definition);
      } else {
        callback("Error fetching definition: " + this.statusText, null);
        Swal.fire({
          title: "We couldn't find the definition for this word, apologies.",
          text: "We can skip this round or you can guess again.\n\nPress OK to skip or Cancel to guess again.",
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Skip Round',
          confirmButtonColor: "#ea9d2a",
          cancelButtonText: 'Guess Again',
          cancelButtonColor: "#fb7474",
          allowEnterKey: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `The word was ${randomWord}.`,
              text: "Apologies if this would have been your guess.",
              confirmButtonColor: "#ea9d2a",
              confirmButtonText: "Next word"
            }).then(() => {
              newRound();
            });
          } else {
            hintButton.textContent = "Hint 2";
          }
        });
      }
    }
  };
}

const hintTwoContainer = document.getElementById("hint-two");

// Function to display the definition of the game word
function displayDefinition(definition) {
  hintTwoContainer.innerHTML = "<hr></hr><h4 class='hint-heading'>Definition:</h4>" + definition;
  hintTwoContainer.style.display = "block";
}

// Function to fetch the rhyming words for the game word
function fetchRhymes(word, callback) {
  console.log("Fetching rhymes for word:", word);
  let xhr = new XMLHttpRequest();
  let baseURL = "https://api.wordnik.com/v4/word.json/";
  let hintThree = `${word}//relatedWords?useCanonical=false&relationshipTypes=rhyme&limitPerRelationshipType=100&api_key=`;
  let gameOn = atob(callGame);

  xhr.open("GET", baseURL + hintThree + gameOn);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log("Rhymes data:", data);

        let rhymes = data[0].words || [];
        rhymes = shuffleArray(rhymes);
        rhymes = rhymes.slice(0, 10);

        callback(null, rhymes);
      } else {
        callback("Error fetching rhymes: " + this.statusText, null);
        Swal.fire({
          title: "We couldn't find the rhyming words for this word, apologies.",
          text: "We can skip this round or you can guess again.\n\nPress OK to skip or Cancel to guess again.",
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'Skip Round',
          confirmButtonColor: "#ea9d2a",
          cancelButtonText: 'Guess Again',
          cancelButtonColor: "#fb7474",
          allowEnterKey: true,
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `The word was ${randomWord}.`,
              text: "Apologies if this would have been your guess.",
              confirmButtonColor: "#ea9d2a",
              confirmButtonText: "Next word"
            }).then(() => {
              newRound();
            });
          } else {
            hintButton.style.display = "block";
            hintButton.textContent = "Hint 3";
          }
        });
      }
    }
  };
}

const hintThreeContainer = document.getElementById("hint-three");

//Function to display the rhyming words for the game word
function displayRhymes(rhymes) {
  let rhymeString = rhymes.join(", ");
  rhymeString = rhymeString.charAt(0).toUpperCase() + rhymeString.slice(1);
  hintThreeContainer.innerHTML = "<hr></hr><h4 class='hint-heading'>Rhyming words:</h4>" + rhymeString;
  hintThreeContainer.style.display = "block";
}

// Pretty self-explanatory but this clears the hint containers
function clearHintContainers() {
  hintOneContainer.innerHTML = "";
  hintOneContainer.style.display = "none";
  hintTwoContainer.innerHTML = "";
  hintTwoContainer.style.display = "none";
  hintThreeContainer.innerHTML = "";
  hintThreeContainer.style.display = "none";
}

// Function to update hint button text content
function updateHintButton() {
  if (hintButton.textContent == "Hint 1") {
    hintButton.textContent = "Hint 2";
  } else if (hintButton.textContent == "Hint 2") {
    hintButton.textContent = "Hint 3";
  } else {
    hintButton.textContent = "";
    hintButton.style.display = "none";
  }
}

// Event listener for hint button to display the correct hint based on the hint button text content
document.getElementById("hint-btn").addEventListener("click", function () {
  console.log("Hint button clicked");
  if (hintButton.textContent == "Hint 1") {
    if (randomWord) {
      fetchSynonyms(randomWord, function (error, data) {
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
      fetchDefinition(randomWord, function (error, definition) {
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
      fetchRhymes(randomWord, function (error, data) {
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

function hexToRgba(hex, opacity) {
  // Remove the hash (#) if it exists
  let cleanHex = hex.replace('#', '');

  // If shorthand hex (like #abc), convert to full form (#aabbcc)
  if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(function (hexChar) {
          return hexChar + hexChar;
      }).join('');
  }

  // Parse the r, g, b values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Return the rgba string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

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

  const finishButton = document.getElementById('finish-btn');
  const opacity = 0.7; // Set the desired opacity (0 to 1)
  finishButton.style.backgroundColor = hexToRgba(newGameColor, opacity);

  const hintContainer = document.getElementById("hint-container")
  hintContainer.classList.remove('show');
  hintContainer.classList.add('hide');


  launchGame();
}

//Background colors for each new round
const backgroundColors = ["#e68eb6", "#E1A8EE", "#97466E", "#C67199", "#B6A999", "#BCA5AE", "#9572A1", "#FF96A6", "#FFA691"];

let defaultColor = "#e68eb6";

// Function to generate a random color and to ensure the same color isn't repeated immediately
function getRandomColor() {
  let randomColor;
  do {
    randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
  } while (randomColor === defaultColor);
  defaultColor = randomColor;
  return randomColor;
}

document.getElementById("pass-btn").addEventListener("click", function () {
  Swal.fire({
    title: 'Are you sure you want to pass?',
    text: "You'll get 0 points",
    icon: 'warning',
    iconColor: '#ea9d2a',
    showCancelButton: true,
    confirmButtonColor: '#ea9d2a',
    cancelButtonColor: '#fb7474',
    confirmButtonText: 'Yes, pass it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Bad luck!',
        text: `The word was ${randomWord}.`,
        icon: 'info',
        iconColor: '#fb7474',
        confirmButtonText: "Next word",
        confirmButtonColor: '#ea9d2a',
        allowEscapeKey: false,
        allowEnterKey: true,
        allowOutsideClick: false
      }).then(() => {
        updateTotalScore(0);
        scoreTally[0]++;
        console.log(scoreTally);
        newRound();
      });
    }
  });
});

// Replaced confirms and Swal.fires with modals for much better UI

// Event listener for finish button
document.getElementById("finish-btn").addEventListener("click", function () {
  showConfirmModal();
});

// First modal to check if the player wants to finish the game
function showConfirmModal() {
  let modal = document.getElementById("confirm-modal");
  let closeBtn = document.getElementById("confirm-close");

  modal.style.display = "block";

  // Ensure close button functions correctly
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  // Close the modal when the user clicks anywhere outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

document.getElementById("confirm-finish").addEventListener("click", function () {
  let confirmModal = document.getElementById("confirm-modal");
  confirmModal.style.display = "none";

  // Show the thank you modal if the player wishes to finish their game
  showThankYouModal();
});

// CLose modal if they wish to continue
document.getElementById("cancel-finish").addEventListener("click", function () {
  let modal = document.getElementById("confirm-modal");
  modal.style.display = "none";
});

// Second modal after finishing game thanking player and asking if they wish for the results to be emailed to them
function showThankYouModal() {
  let modal = document.getElementById("thankyou-modal");
  let closeBtn = document.getElementById("thankyou-close");

  modal.style.display = "block";

  // Close the modal when the user clicks on the close button
  closeBtn.onclick = function () {
    modal.style.display = "none";
    resetGame();
  };

  // Prevent closing the modal when the user clicks anywhere outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      event.stopPropagation();
    }
  };
}

// Event listener for send email button and template parameters for the email
document.getElementById("email-form").addEventListener("submit", function (event) {
  event.preventDefault();

  let userEmail = document.getElementById("email").value;

  const templateParams = {
    to_email: userEmail,
    player_name: playerName,
    total_score: totalScore,
    score_5: scoreTally[5],
    score_3: scoreTally[3],
    score_2: scoreTally[2],
    score_1: scoreTally[1],
    score_0: scoreTally[0]
  };

  sendEmail(templateParams);

  // Close the modal and reset game state after submitting
  document.getElementById("thankyou-modal").style.display = "none";
  resetGame();
});

// Function to send email
function sendEmail(templateParams) {
  emailjs.send("gmail", "WWAMI-scores", templateParams)
    .then(function (response) {
      console.log("Email sent successfully:", response);
      Swal.fire({
        icon: "success",
        iconColor: "#22d283",
        title: "Results sent successfully!",
        confirmButtonColor: "#22d283",
      });
    }, function (error) {
      console.error("Email sending failed:", error);
      Swal.fire({
        icon: "warning",
        iconColor: "#fb7474", 
        title: "Failed to send results. Please try again later.",
        confirmButtonColor: "#fb7474",
      });
    });
}

//Clears input field on welcome page to allow new name to be input
function clearPlayerInfo() {
  let playerInfo = document.getElementById("player-info");
  playerInfo.value = "";
  console.log("Resetting player info");
}

// Function to reset game state
function resetGame() {
  clearHintContainers();
  clearPlayerInfo();
  setBackgroundColor();
  displayWelcome();
  document.getElementById("total-score").textContent = "Total Score: ";
  document.getElementById("go-btn").classList.add("hide");
}


// Header functionality----------------------------------------------------------------- 

document.addEventListener("DOMContentLoaded", function () {
  // Home / WWAMI Modal
  let homeModal = document.getElementById("home-modal");
  let homeLink = document.getElementById("WWAMI");
  let homeCloseBtn = document.getElementById("home-close");
  let confirmHomeBtn = document.getElementById("confirm-home");
  let cancelHomeBtn = document.getElementById("cancel-home");

  homeLink.addEventListener("click", function (event) {
    event.preventDefault();
    homeModal.style.display = "block";
  });

  confirmHomeBtn.addEventListener("click", function () {
    homeModal.style.display = "none";
    resetGame();
  });

  cancelHomeBtn.addEventListener("click", function () {
    homeModal.style.display = "none";
  });

  homeCloseBtn.onclick = function () {
    homeModal.style.display = "none";
  };

let instructionsModal = document.getElementById("instructions-modal");
let instructionsLink = document.getElementById("how-to-play-link");
let instructionsCloseBtn = document.getElementById("instructions-close");
// let instructionsContent = document.getElementById("instructions-container").innerHTML;

instructionsLink.addEventListener("click", function (event) {
  event.preventDefault();
  // document.getElementById("instructions-content").innerHTML = instructionsContent;
  
  instructionsModal.style.display = "block";
  
  // Call the toggleModalImage function here to update image visibility
  toggleModalImage();
});

instructionsCloseBtn.onclick = function () {
  instructionsModal.style.display = "none";
};

// Function to toggle whether the game area preview is shown in the instructions modal
function toggleModalImage() {
  const modalImage = document.getElementById("instruction-image");

  // Check if the user is in the welcome-section or game-area based on class
  const isWelcomeSection = !$("#welcome-container").hasClass("hide");
  const isGameArea = !$("#game-container").hasClass("hide");

  if (isGameArea) {
    // Hide the image if in game-area section
    modalImage.style.display = "none";
  } else if (isWelcomeSection) {
    // Show the image if in welcome-section
    modalImage.style.display = "block";
  }
}

  // About Modal
  let aboutModal = document.getElementById("about-modal");
  let aboutLink = document.getElementById("about-link");
  let aboutCloseBtn = document.getElementById("about-close");

  aboutLink.addEventListener("click", function (event) {
    event.preventDefault();
    aboutModal.style.display = "block";
  });

  aboutCloseBtn.onclick = function () {
    aboutModal.style.display = "none";
  };


  window.onclick = function (event) {
    if (event.target == homeModal) {
      homeModal.style.display = "none";
    }
    if (event.target == instructionsModal) {
      instructionsModal.style.display = "none";
    }
    if (event.target == aboutModal) {
      aboutModal.style.display = "none";
    }
  };
});
