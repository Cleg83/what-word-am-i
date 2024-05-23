Thorough testing for WWAMI.

Visit the deployed site [here](https://cleg83.github.io/what-word-am-i/)

* [Manual Testing](#manual-testing)

* [Automated Testing](#automated-testing)
  * [W3C](#w3c)
  * [JS Lint](#js-lint)
  * [Lighthouse](#lighthouse)
  * [Jest](#jest)

# Manual Testing

## Header

Feature | Expected Outcome	| Testing Performed |	Result	| Pass/Fail |
| --- | --- | --- | --- | --- |
| Home Link / WWAMI | Modal displays asking the player if they wish to return home | Clicked Home Link | Modal displayed confirming if player wants to return home | Pass |
Home Link modal confirmation | Game resets and welcome page loads / refreshes if user clicks "yes" | Clicked "yes" | Welcome page loads / refreshes | Pass |
Home Link modal confirmation | Modal closes and play resumes if player clicks "no" | Clicked "no" | Modal closes and game continues | Pass |
Home Link modal confirmation | Modal closes and play resumes if player clicks anywhere outside of the modal | Clicked outside of the modal | Modal closes and game continues | Pass |
How To Play Link | How To Play modal displays | Clicked How To Play link | How To Play modal displays | Pass |
How To Play Modal | Modal closes when player clicks the close button | Clicked close button | Modal closed | Pass |
How To Play Modal | Modal closes when player clicks anywhere outside of the modal | Clicked outside of the modal | Modal closed | Pass |
About Link | About modal displays | Clicked About link | About modal displays | Pass |
About Modal | Modal closes when player clicks the close button | Clicked close button | Modal closed | Pass |
About Modal | Modal closes when player clicks anywhere outside of the modal | Clicked outside of the modal | Modal closed | Pass |
Header links:hover | Text underlines when links are hovered | Hovered over each header link | Text underlined | Pass |

## Welcome Page 

Feature | Expected Outcome	| Testing Performed |	Result	| Pass/Fail |
| --- | --- | --- | --- | --- |
| Name / initial input field | Displays "Go!" button on text input | Text typed into input field | "GO!" button displayed on text input | Pass |
| Name / initial input field | Hides "Go!" button when field is emptied | Text removed from input field | "GO!" button hidden on emptying input field | Pass |
| Enter pressed with input field empty | Alert displays stating the field needs to be completed | Pressed enter with input field empty | Alert displayed | Pass |
| "GO!" Button | Launches game on click / enter press | Clicked "GO!" button | Game launched | Pass | 

## Game Page 

Feature | Expected Outcome	| Testing Performed |	Result	| Pass/Fail |
| --- | --- | --- | --- | --- |
Letter tiles | Letter displays in first tile on text input & focus moves to next tile | Typed letter into tile | Letter displays & focus moves to next tile | Pass | 
Letter tiles | Will only allow characters a-z / A-Z | Typed numbers and special characters into tile | Tile remained empty | Pass |
Submit button | Displays "incorrect" alert if player guess is incorrect | Guessed incorrectly | "Incorrect" alert displayed | Pass |
Right arrow key | Focus moves to the next free tile | Pressed right arrow key | Focus moved to next free tile | Pass |
Left arrow key | Focus moves to the previous free tile | Pressed left arrow key | Focus moved to previous free tile | Pass |
Backspace key | Deletes content of tiles & focus moves to the previous free tile | Pressed backspace key | Focus moved to previous free tile | Pass |
Delete key | Deletes content of tiles & focus moves to the previous free tile | Pressed delete key | Focus moved to previous free tile | Pass |
Enter Key | Functions as submit button if the focus is on a letter tile or the submit button | Pressed enter | Alert displayed that states the guess is either incorrect or correct | Pass |
Enter key | Functions as hint button click if focus is on hint button | Clicked enter while focus was on hint button | Behaved as the hint button does | Pass | 
Enter key | Functions as pass button click if focus is on pass button | Clicked enter while focus was on pass button | Behaved as the pass button does | Pass | 
Enter key | Functions as finish game button click if focus is on finish game button | Clicked enter while focus was on finish game button | Behaved as the finish game button does | Pass | 
"Incorrect" alert | Resumes game and updates letter tiles with any correctly guessed letters | Clicked "OK" on alert | Game resumes and correctly guessed tiles updated " | Pass |
Submit button | Displays "5 point" alert if player guess is correct and "Hint" button text content = "Hint 1" | Submitted correct guess | "5 point" alert displayed | Pass | 
"5 point" alert | Loads new round and updates total score by 5 points | Clicked "OK" on alert | New round loaded and total score updated by 5 points | Pass |
Submit button | Displays "3 point" alert if player guess is correct and "Hint" button text content = "Hint 2" | Submitted correct guess | "3 point" alert displayed | Pass | 
"3 point" alert | Loads new round and updates total score by 3 points | Clicked "OK" on alert | New round loaded and total score updated by 3 points | Pass |
Submit button | Displays "2 point" alert if player guess is correct and "Hint" button text content = "Hint 3" | Submitted correct guess | "2 point" alert displayed | Pass | 
"2 point" alert | Loads new round and updates total score by 2 points | Clicked "OK" on alert | New round loaded and total score updated by 2 points | Pass |
Submit button | Displays "1 point" alert if player guess is correct and "Hint" button is hidden | Submitted correct guess | "1 point" alert displayed | Pass | 
"1 point" alert | Loads new round and updates total score by 1 point | Clicked "OK" on alert | New round loaded and total score updated by 1 point | Pass |
"Hint" button | Displays synonyms if clicked when text content = "Hint 1" | Clicked "Hint" button | Synonyms displayed | Pass | 
"Hint" button | Displays synonym error alert if API can't fetch synonyms & clicked when text content = "Hint 1" | Clicked "Hint" button | Synonyms error alert displayed | Pass | 
"Hint" button | Text content updates to hint 2 if no error fetching synonyms | Clicked "Hint" button with no error fetching synonyms | Text content updated correctly | Pass | 
"Hint" button | Displays definition if clicked when text content = "Hint 2" | Clicked "Hint" button | Definition displayed | Pass | 
"Hint" button | Displays synonym error alert if API can't fetch definition & clicked when text content = "Hint 2" | Clicked "Hint" button | Definition error alert displayed | Pass | 
"Hint" button | Text content updates to hint 3 if no error fetching definition | Clicked "Hint" button with no error fetching definition | Text content updated correctly | Pass | 
"Hint" button | Displays definition if clicked when text content = "Hint 3" | Clicked "Hint" button | Rhymes displayed | Pass | 
"Hint" button | Displays rhyme error alert if API can't fetch rhyme & clicked when text content = "Hint 3" | Clicked "Hint" button | Rhyme error alert displayed | Pass | 
"Hint" button | "Hint" button becomes hidden if no error fetching rhymes | Clicked "Hint" button with no error fetching definition | "Hint" button hidden from display | Pass | 
"Pass" button | Display alert asking if player wants to pass and score 0 points | Clicked "Pass" button | Alert displayed | Pass |
"Pass" alert | Game resumes if player clicks "cancel" | Clicked "cancel" | Game resumed | Pass |
"Pass" alert | Show 2nd alert if player passes showing the game word | Clicked "OK" to pass round | 2nd alert displayed showing game word | Pass |
2nd "Pass" alert | Updates score by 0 and loads new round when player clicks "OK" | Clicked "OK" | Score updated by 0 and new round loaded | Pass |
"Finish Game" button | Displays finish game modal when button is clicked | Clicked "Finish Game" button | Finish game modal displayed | Pass |
Finish game modal | Resumes game if player clicks "No" | Clicked "No" in finish game modal | Game resumes | Pass |
Finish game modal | Displays 2nd modal thanking player for playing if player clicks "Yes" | Clicked "Yes" in modal | 2nd modal displayed | Pass |
2nd finish game modal | Modal does not close if user clicks anywhere outside of modal | Clicked outside of modal | Modal remained displayed | Pass |
2nd finish game modal - close button | Modal closes if user clicks close button | Clicked close button | Modal closed | Pass |
2nd finish game modal - Email results | Requires player to enter valid email address in order to send email | Input valid email address & clicked "send" | Email sent successfully |
2nd finish game modal - Email results | Requires player to enter valid email address in order to send email | Input invalid email address | Prompted to enter a valid email address | Pass |
| Email sent to player | Email shows the player name, total score & breakdown of scores | Sent email after finishing game | Email contained correct information | Pass | 
| New Round | Background color changes when new round is loaded | Loaded new round | Background color changed | Pass |










