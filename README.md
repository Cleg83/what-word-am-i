## CONTENTS

* [WWAMI](#WWAMI)

* [Rationale](#rationale)
  * [Project Introduction](#project-introduction)
  * [Motivation / Inspiration](#motivation-/-inspiration)
  * [Background Information](#background-information)
  * [Project Scope](#project-scope)
  * [Future Versions](#future-versions)
  * [Summary](#summary)

* [User Stories](#user-stories)

* [Design](#design)
  * [Colour Scheme](#colour-scheme)
  * [Typography](#typography)
  * [Wireframes](#wireframes)

* [Features](#features)
  * [The Navbar](#the-navbar)
  * [The Welcome Page](#the-welcome-page)
  * [The Game Page](#the-game-page)
  * [Generating a random word](#generating-a-random-word)
  * [Generating Hints](#generating-hints)
    * [Fetching Synonyms](#fetching-synonyms)
    * [Fetching Definition](#fetching-definition)
    * [Fetching Rhymes](#fetching-rhymes)
    * [Hint Error Handling](#hint-error-handling)
  * [The Hint Button](#the-hint-button)
  * [The Submit Button](#the-submit-button)
  * [The Pass Button](#the-pass-button)
* [Accessibility](#accessibility)

* [Technologies](#technologies)
  * [Languages](#languages)
  * [Frameworks, Libraries & Programs](#frameworks-libraries--programs)

* [Deployment & Development](#deployment--development)
  * [Deployment](#deployment)
  * [Local Development](#local-development)
    * [Extensions required](#extensions-required)
    * [How to Fork](#how-to-fork)
    * [How to Clone](#how-to-clone)

* [Testing](#testing)
  * [W3C](#W3C)
  * [Lighthouse](#Lighthouse)
  * [Jest](#jest)
  * [JS-Lint](#js-lint)
  
* [Credits](#credits)
  * [External code](#external-code)
  * [Media](#media)

# WWAMI 

### WWAMI (What Word Am I?) is an exciting new word game where the player has to guess a random word to score points. 

Visit the deployed site [here](https://cleg83.github.io/what-word-am-i/)
 
---

## Rationale

### Project introduction

Word games have always been a popular pastime for the linguistically minded and I wanted to create a game that brings something new and exciting to the field of browser based word games with WWAMI.

The primary of objective of this project was to create an interactive, easily-navigable word guessing game using HTML, CSS & JavaScript.

### Motivation / Inspiration

I would be lying if I said the main inspiration for WWAMI wasn't an incredibly popular daily word game (that may or may not rhyme with curdle).

The motivation was to create a word guessing game that provides a new, enjoyable but challenging interactive game that offers features other word guessing games do not (mainly the ability to show hints for the word if needed).

### Background Information

WWAMI took around 6 weeks to build and the bulk of the time was spent on navigation and letter input. Due to the game layout being simple and text input based, I wanted the player to not have to think about navigating between tiles.

What I thought would be a simple project to build ended up presenting me with problems I'd not yet considered and the solutions to these problems were (largely) new territories for me.

Thankfully (at its best), the internet is a wonderfully helpful place and


N.B. The commit history for this project belies the amount of time I actually spent working on it. I would say it's about 6 weeks of work that was committed regularly to a gitHub repo but due to exposing the API key (which I have since discovered is somewhat impossible without any server-side programming), I panicked and deleted that repo. Then in a rather rushed manner, I committed everything to the new repo but was careful to still (try) and give a fairly accurate snapshot of the order in which the project was built. 

### Project Scope

### Future Versions

Ideally, I would like to offer WWAMI in as many spoken languages as possible.

### Summary

## User Stories

#### User Story 1: 

As a first time visitor, I want to quickly be able to understand the game objective and understand how to play the game, so I can decide whether or not I wish to play.

#### User Story 2: 

As a first time player, I want to easily identify and navigate between the game components, so that I can enjoy playing the game without being hindered.

#### User Story 3: 

As a language aficionado, I want to be able to guess the word without hints, so that I can score the maximum amount of points. 

#### User Story 4: 

As a casual player, I want to be able to use hints when needed, so that I can enjoy playing the game with the goal not being to achieve maximum points. 

#### User Story 5:

As a returning player, I want to be able to beat my previous score, so that I can challenge myself.

## Features

### The Navbar

The navbar is pretty straightforward as the game page itself takes care of a lot of the navigation. 

The navbar contains:
  * WWAMI - Which is link to the welcome page (confirming if the user wants to return home and lose game progress). 
  * How To Play - Which is a link to display the game instructions.
  * About - Which displays information about the game and the technologies used to build it.

### The Welcome Page

I wanted the landing page for WWAMI to provide the player with clear instructions about how to play and how the point scoring system works. As you can see below, the layout is uncluttered and the instructions are clear.

The input field for the player to input their name or initials is in focus when the page loads so the player is able to input their information without having to click anywhere first.

When the player starts typing, the GO! button appears and on click (or by pressing enter) the game page is launched.

### The Game Page

The game page displays blank letter divs as tiles that the player types letters in. The word the player has to guess is generated randomly from an array of words.

I wanted the focus to be on the first blank tile when the game loads so that the player can immediately start playing.

Once the player has typed a letter, the focus moves to the next blank tile but the player is able to navigate freely between the tiles with arrow keys or by touching a blank tile on a touch screen device. 

The backspace key also acts as a secondary navigational tool by clearing the letter in the selected tile and then moving focus to the previous tile.

When the focus is on either a tile or the submit button, the enter key will allow the player to submit a guess.

The game page also allows the player to generate up to three hints (more on that functionality can be found in the next few sections). With each hint shown, the score the player can achieve is reduced. 

The player can choose to pass the round and score 0 points and they can also choose to finish the game at any time.

### Generating a random word

The word the player has to guess is a random word generated from an array of around 1800 words stored in the [word-list.js](#assets/js/word-list.js) file.

This is achieved through selecting a random index from the array in the launchGame function.

The correct number of blank tiles (letter divs) are then generated and displayed based on the number of letters in the word.

## Generating Hints

All hints are generated by API calls to [Wordnik API](https://developer.wordnik.com/). 

[Wordnik API](https://developer.wordnik.com/) is a fantastic resource for obtaining data for a specified word.

For WWAMI, I needed to fetch the synonyms, the definition and rhyming words for the game word the player has to guess.

The synonyms and rhymes are returned as an array of up to 100 words so I had to shuffle these and then select 10 words from the array. I found the Fisher-Yates algorithm (see below) to shuffle arrays and this did exactly what I needed it to (and probably saved me hours of bashing my head against a wall).

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

 I could then slice the first 10 words from the array with relative ease.

### Fetching synonyms

The first hint the player can choose to display are the synonyms of the game word.

Wordnik API returns the data in the below format when making the call:

    [
      {
        "relationshipType": "synonym",
        "words": [ ]
      }
    ]

From this I had to extract the "words" array so I could manipulate the data with the method outlined above.

### Hint Error handling

Due to relying on API calls to fetch the hints, I wanted to incorporate error handling into the game play: Rather than only logging errors to the console and alerting the player that there is an error, I have added a confirm element to each of the fetch hint functions that alerts the player of the error and asks if they want to skip the round or guess again.

If they skip, the newRound function is called and a new word is generated and the score and score tally remain unchanged (see below example for the fetchRhymes function).

    else {
        callback("Error fetching rhymes: " + this.statusText, null);
        const skipRoundNoRhymes = confirm("We couldn't find the rhyming words for this word, apologies.\n\nWe can skip this round or you guess again.\n\nPress OK to skip or cancel to guess again");
        if (skipRoundNoRhymes) {
          alert(`The word was ${randomWord}.\n\nApologies if this would have been your guess.`);
          newRound();
        } else {
          hintButton.style.display = "block";
          hintButton.textContent = "Hint 3";
        }
    
If they choose to guess again, the hint button text reverts to it’s pre-clicked text and the player can guess again.

The player can still click the hint button and it will either display the same alert or, in the case that the reason the hint was not found was due to “too many requests”, the hint will be displayed if enough time has elapsed since they last clicked the button.










