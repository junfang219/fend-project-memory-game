/*
 * Create a list that holds all of your cards
 */
var cards = document.querySelectorAll('.card');
// it returns a nodeList

// Convert Nodelist to an Array
var cardsArray = Array.from(cards);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var shuffledCards = shuffle(cardsArray);

// Remove previous cards and add new shuffed cards
var deck = document.querySelector('.deck');

for (let i = 0; i < cardsArray.length; i++) {
	cardsArray[i].remove();
}	

for (let i = 0; i < shuffledCards.length; i++) {
	deck.appendChild(shuffledCards[i]);
}


// Add event listener to the restart button


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


//Create array to record opened cards
let openedCards = [];

let moves = document.querySelector('.moves');

let counter = 0;

let lockDown = false;

let flipOpen = ['open', 'show', 'animated', 'flipInY'];

let stars = document.querySelector('.stars');

let timer = document.querySelector('.time');

let startTime;

let gameStarted = false;

let reportEverySec;

let restart= document.querySelector('.restart');

function FlipCard(elem) {
	// Add class and then remove the class for the purpose of animation
	elem.classList.add(...flipOpen);
	setTimeout(function() {
	 elem.classList.remove('ainmated', 'flipInY');
	}, 200);
}

function ChangeBack(elem) {
	elem.className = 'card';
}

function gameOver() {
	return openedCards.length == 16;
}

function restartGame() {
	window.location.reload();
}

restart.addEventListener('click',restartGame);

// Track time
function reportTime() {
	let currTime = new Date().getTime() / 1000;
	let totalTime = Math.floor(currTime - startTime);
	timer.textContent = totalTime;
	// modal report
	document.getElementById('finaltime').textContent = totalTime;
}


function clickOpen(elem) {
	for (let i = 0; i < elem.length; i++) {	
		elem[i].addEventListener('click', async function(){
			//if the card is already opened, exit the function
			if (lockDown || elem[i].classList.contains('open')) {
				return;
			}

			FlipCard(elem[i]);

			openedCards.push(elem[i]);

			// first time click a card, set gameStarted from F to T. Record the game start time
			//and report ongoing time every 1 second.
			if (!gameStarted) {
				gameStarted = true;
				startTime = new Date().getTime() / 1000;
				reportEverySec = setInterval(reportTime, 1000);
			}

			//Compare two opened cards
			let currTotal = openedCards.length;
			if (currTotal % 2 == 0) {
				//if openedCards array hold 2 cards then increment count and compare
				counter += 1;

				let last = openedCards[currTotal - 1];
				let secondToLast = openedCards[currTotal - 2];
				if (last.firstElementChild.className != secondToLast.firstElementChild.className) {
					// if not match, shake and change the color of cards
					last.classList.add('animated', 'shake', 'unmatch');
					secondToLast.classList.add('animated', 'shake','unmatch');

					// Delay 0.8s, during the time no cards can open			
					let delay = new Promise(resolve => setTimeout(resolve, 800));
					lockDown = true;
					await delay;
					lockDown = false;
					
					// Remove all classes
					ChangeBack(last);
					ChangeBack(secondToLast);
					// Remove opened cards since they aren't matched and closed
					openedCards.pop();
					openedCards.pop();
				} else {
					last.classList.add('animated', 'jello','match');
					// To sync time with previous setTimeout
					setTimeout(function(){
						secondToLast.classList.add('animated', 'jello','match');
					}, 200);
				}
			}
			// update moves
			moves.textContent = counter;
			document.getElementById('finalmove').textContent = counter;

			// update score panel
			switch (counter) {
				case 9:
					stars.lastElementChild.lastElementChild.className = 'fa fa-star-o';
					break;
				case 16:
					stars.lastElementChild.previousElementSibling.firstElementChild.className = 'fa fa-star-o';
					break;
				case 28:
					stars.firstElementChild.firstElementChild.className = 'fa fa-star-o';
			}


			// Congrats modal
			let modal = document.getElementById('myModal');
			// Get close buttom
			let span = document.getElementsByClassName('close')[0];
			
			if (gameOver()) {
				gameStarted = false;
				clearInterval(reportEverySec);
				modal.style.display = 'block';
				// get restart button and add event listener
				let restart_2 = document.querySelector('.modalRestart');
				restart_2.addEventListener('click', restartGame)
			}

			//When the user clicks on (x), close the modal
			span.onclick = function() {
				modal.style.display = 'none';
			}

		});
	}
}



clickOpen(shuffledCards);
