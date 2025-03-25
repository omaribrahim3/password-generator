// DOM Elements
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

// Character sets
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Event Listeners
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumbers = numbersEl.checked;
    const hasSymbols = symbolsEl.checked;
    
    resultEl.innerText = generatePassword(
        hasLower, 
        hasUpper, 
        hasNumbers, 
        hasSymbols, 
        length
    );
});

// Modern copy to clipboard function
clipboardEl.addEventListener('click', async () => {
    const password = resultEl.innerText;
    
    if(!password) {
        return;
    }
    
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(password);
            alert('Password copied to clipboard!');
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = password;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            alert('Password copied to clipboard!');
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy password to clipboard');
    }
});

// Generate Password Function
function generatePassword(lower, upper, number, symbol, length) {
    // 1. Initialize password variable
    let generatedPassword = '';
    
    // 2. Filter out unchecked types
    const typesCount = lower + upper + number + symbol;
    
    // If no types are selected, return empty string
    if(typesCount === 0) {
        return '';
    }
    
    // Create array of checked types
    const typesArr = [{lower}, {upper}, {number}, {symbol}]
        .filter(item => Object.values(item)[0]);
    
    // Create a loop to call generator function for each type
    for(let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    
    // Get the final password and trim it to the requested length
    const finalPassword = generatedPassword.slice(0, length);
    
    return finalPassword;
}

// Generator Functions
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Generate a password on page load
window.addEventListener('DOMContentLoaded', () => {
    generateEl.click();
}); 