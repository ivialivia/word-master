
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const CHECK_URL = "https://words.dev-apis.com/validate-word";
const result = document.getElementById("result-text");

let wordOTD = "";
let inputElement = [];
let currInput = 0;

const guessedWord = { word: ""};

async function getWordOTD() {
    const wordOTDPromise = await fetch(WORD_URL);
    const wordOTDObj = await wordOTDPromise.json();
    wordOTD = wordOTDObj.word.toUpperCase();

}

async function validateWord(guess,curr) {
    const promise = await fetch(CHECK_URL,{
        method : 'POST',
        body : JSON.stringify(guess)
    });
    const processedResponse = await promise.json();

    next = curr+5;

    if(processedResponse.validWord)
        {
            guess.word = guess.word.toUpperCase();
            checkWord(guess.word, curr);
        }
    else {
        console.log(guess);
        for(x = 0; x < 5; x++){
            elm = document.getElementById(""+inputElement[x+curr]);
            elm.setAttribute('class', elm.getAttribute('class')+" invalid");
            elm.readOnly = true;
        }
    }
    console.log(next);
    resetGuessedWord();
    if(e =  document.getElementById(inputElement[next])) {
        for(x = 0; x < 5; x++){
            elm = document.getElementById(""+inputElement[x+next]);
            elm.disabled = !elm.disabled;
        }
        e.focus();
        currInput = next;
    }
    else {
        result.textContent = "You lose! Correct word is "+wordOTD;
    }
}


function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

function readRow(curr) {
    for(x = 0; x < 5; x++){
        elm = document.getElementById(""+inputElement[x+curr]);
        guessedWord.word = guessedWord.word+elm.value;
    }
}

function resetGuessedWord() {
    guessedWord.word = "";
}

function checkWord(guess, curr) {
    for(x = 0; x < 5; x++){
        elm = document.getElementById(""+inputElement[x+curr]);
        if(guess.charAt(x)==wordOTD.charAt(x)) {
            elm.setAttribute('class', elm.getAttribute('class')+" correct");
        }
        else if(wordOTD.includes(guess.charAt(x))){
            elm.setAttribute('class', elm.getAttribute('class')+" misplace");
        }
        else {
            elm.setAttribute('class', elm.getAttribute('class')+" incorrect");
        }
        elm.readOnly = true;
    }
    if(guess==wordOTD) {
        result.textContent = "Great! Correct word is "+wordOTD;
    }
    
}

function init() {
    let inputLetters = document.querySelectorAll(".input-letter");
    inputLetters.forEach((inputLetter) => {
        inputLetter.addEventListener('beforeinput', (e) => {
            if(e.data && !isLetter(e.data))
                e.preventDefault();
            else if(e.data && isLetter(e.data))
                e.data = e.data.toUpperCase();
          });
        inputLetter.addEventListener('input', (e) => {
          if(e.data && isLetter(e.data)&& inputLetter.nextElementSibling){
                inputLetter.nextElementSibling.focus();
            }
        });
        inputElement.push(inputLetter.id);
    });

    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            readRow(currInput);
            validateWord(guessedWord,currInput);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            elm = document.activeElement;
            if(!elm.value) {
                prevElm = elm.previousElementSibling;
                prevElm.focus();
            }

        }
    });

    getWordOTD();
      
  }

init();