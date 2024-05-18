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

# WWAMI (What Word Am I?) 
 
### WWAMI is an exciting new word game where the player has to guess a random word to score points. 

Visit the deployed site [here]()
 
---

## Rationale

### Project introduction

Word games have always been a popular pastime for the linguistically minded and I wanted to create a game that brings something new and exciting to that field.

### Motivation / Inspiration

I would be lying if I said the main inspiration for WWAMI wasn't an incredibly popular daily word game (that may or may not rhyme with curdle), in that the player has to guess a random word and the correctly guessed letters remain displayed once a guess has been submitted. 

### Background Information

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

The game page displays blank letter divs as tiles that the player can type letters in. The word the player has to guess is generated randomly from an array of words.

I wanted the focus to be on the first blank tile when the game loads so that the player can immediately start playing.

Once the player has typed a letter, the focus moves to the next blank tile but the player is able to navigate freely between the tiles with arrow keys or by touching a blank tile on a touch screen device. 

The backspace key also acts as a secondary navigational tool by clearing the letter in the selected tile and then moving focus to the previous tile.

When the focus is on either a tile or the submit button, the enter key will allow the player to submit a guess.

The game page also allows the player to generate up to three hints (more on that functionality can be found in the next few sections). With each hint shown, the score the player can achieve is reduced. 

The player can choose to pass the round and score 0 points and they can also choose to finish the game at any time.

### Generating a random word

The word the player has to guess is a random word generated from an array stored in a separate .js file. 

The random word is stored so that it won't be repeated during the game.







