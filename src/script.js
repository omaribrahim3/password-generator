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
    // Array of enabled generator functions
    const typesArr = [{lower}, {upper}, {number}, {symbol}]
        .filter(item => Object.values(item)[0]);

    if(typesArr.length === 0) {
        return '';
    }

    let generatedPassword = '';

    // Ensure at least one character from each selected type
    typesArr.forEach(type => {
        const funcName = Object.keys(type)[0];
        generatedPassword += randomFunc[funcName]();
    });

    // Fill the remaining length with random characters
    for(let i = generatedPassword.length; i < length; i++) {
        const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
        const funcName = Object.keys(randomType)[0];
        generatedPassword += randomFunc[funcName]();
    }

    // Shuffle the resulting password to remove any predictable order
    return shufflePassword(generatedPassword);
}

// Simple array shuffle for strings
function shufflePassword(password) {
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
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