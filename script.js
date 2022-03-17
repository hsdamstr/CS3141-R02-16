import Deck from "./deck.js"

const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
  }

//DRAW?

const computerCardSlot =document.querySelector('.computer-card-slot')
const playerCardSlot =document.querySelector('.player-card-slot')
const computerDeckElement=document.querySelector('.computer-deck')
const playerDeckElement =document.querySelector('.player-deck')
const text = document.querySelector('.text')

let playerDeck, computerDeck, inRound, stop

document.addEventListener("click", ()=>{
    if(stop){
        startGame()
        return
    }
    if(inRound){
        clearRound()
    }
    else{
        flipCard()
    }
})

startGame()
function startGame(){
const deck = new Deck()
deck.shuffle()

const halfDeck = Math.ceil(deck.numberOfCards/2)        //split deck for player and AI
playerDeck = new Deck(deck.cards.slice(0, halfDeck))
computerDeck = new Deck (deck.cards.slice(halfDeck, deck.numberOfCards))
inRound=false
stop=false

clearRound()
}

function clearRound(){  //clear the card for new round
    inRound=false
    computerCardSlot.innerHTML=''
    playerCardSlot.innerHTML=''
    text.innerHTML=''

    updateDeckCount()
}


function updateDeckCount(){
    computerDeckElement.innerText= computerDeck.numberOfCards
    playerDeckElement.innerText= playerDeck.numberOfCards
}

function flipCard(){
    inRound=true

    const playerCard= playerDeck.pop()
    const computerCard=computerDeck.pop()

    playerCardSlot.appendChild(playerCard.getHTML())
    computerCardSlot.appendChild(computerCard.getHTML())

    updateDeckCount()

    if(playerCard===computerCard){
        draw()
    }
    if(roundWinner(playerCard,computerCard)){
        //player won first
        text.innerText="Win"
        playerDeck.push(playerCard)
        playerDeck.push(computerCard)
    }
    else if(roundWinner(computerCard,playerCard)){
        text.innerText="Lose"
        computerDeck.push(playerCard)
        computerDeck.push(computerCard)
    }
   
   /* else{
        text.innerText="Draw"
        playerDeck.push(playerCard)
        computerDeck.push(computerCard)
    } */

    if (gameOver(playerDeck)){
        text.innerText= 'Loser!'
        stop=true
    }
    else if(gameOver(computerDeck)){
        text.innerText= 'Winner!'
        stop=true
    }
}

function roundWinner(card1,card2){
    return CARD_VALUE_MAP[card1.value] > CARD_VALUE_MAP[card2.value]
    //compare the values using cardmap
    //return t/f
}

function gameOver(deck){
    return deck.numberOfCards===0
    //return t/f
}


function draw(){
    flipCard()
}
