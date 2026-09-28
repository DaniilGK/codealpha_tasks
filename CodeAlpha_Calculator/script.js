const input = document.querySelector('.input');
const result = document.querySelector('.result');
const realTimeResult = document.querySelector('.real-time-result');

const historyNavigation = document.querySelectorAll('.history');
const historyList = document.querySelector('.history-list');

const actionBtn = document.querySelectorAll('.btn-action');
const operatorBtn = document.querySelectorAll('.btn-operator');
const numberBtn = document.querySelectorAll('.btn-number');

const operatorSymbolsList = Array.from(operatorBtn).map(btn => btn.textContent);

// hard cap; the display width stops input earlier when the line would overflow
const MAX_INPUT_LENGTH = 20;

// operator precedence for the Shunting-yard algorithm 
const precedence = {
    '+': 2,
    '-': 2,
    '*': 3,
    '÷': 3,
    '**': 4,
};

// arithmetic operations mapped to their symbols
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '÷': (a, b) => a / b,
    '**': (a, b) => a ** b,
};

// History array
let historyArray = [];

const measure = document.createElement("span");
measure.style.position = "absolute";
measure.style.visibility = "hidden";
measure.style.whiteSpace = "nowrap";
measure.style.pointerEvents = "none";
measure.style.transition = "none";
document.body.appendChild(measure);

// width of the expression in the same font as the display
function textWidth(text) {
    const style = getComputedStyle(input);
    measure.style.fontFamily = style.fontFamily;
    measure.style.fontSize = style.fontSize;
    measure.style.fontWeight = style.fontWeight;
    measure.style.letterSpacing = style.letterSpacing;
    measure.textContent = text;
    return measure.offsetWidth;
}

// adds one character only when it stays inside the display
function appendToInput(symbol) {
    const next = input.textContent + symbol;
    if (next.length > MAX_INPUT_LENGTH) return false;
    if (input.clientWidth > 0 && textWidth(next) > input.clientWidth) return false;

    input.textContent = next;
    return true;
}

// checks the last character in the input is an operator
function isLastCharOperator() {
    const text = input.textContent;
    if (text.length === 0) return false;

    const lastChar = text[text.length - 1];
    return operatorSymbolsList.includes(lastChar);
}

// checks the last number already contains a dot
function isLastSegmentHasDot() {
    const text = input.textContent;
    const separators = [...operatorSymbolsList, "("];

    let lastSeparatorIndex = -1;
    for (let i = text.length - 1; i >= 0; i--) {
        if (separators.includes(text[i])) {
            lastSeparatorIndex = i;
            break;
        }
    }

    const lastSegment = text.slice(lastSeparatorIndex + 1);
    return lastSegment.includes(".");
}

// shunting-yard algorithm https://habr.com/ru/articles/489744/
// converts infix notation to postfix (RPN), then evaluates it
function evaluateExpression(text) {
    const expression = text.match(/\d+\.?\d*|\*\*|[\+\-\*÷]|[\(\)]/g) || [];
    let operatorStack = [];
    let outputQueue = [];

    // infix to postfix
    for (const token of expression) {
        if (!isNaN(token) && token.trim() !== "") {
            outputQueue.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // pop the "("
        } else if (precedence[token]) {
            while (
                operatorStack.length > 0 &&
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] &&
                operatorStack[operatorStack.length - 1] !== "("
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    // evaluate postfix (RPN)
    let calcStack = [];

    for (const token of outputQueue) {
        if (!isNaN(token)) {
            calcStack.push(token);
        } else if (precedence[token]) {
            const currentNumber = calcStack.pop();
            const prevNumber = calcStack.pop();

            const operation = operations[token];
            if (operation) {
                calcStack.push(operation(Number(prevNumber), Number(currentNumber)));
            }
        }
    }

    return calcStack[0]; // final result, does not touch the DOM
}

// live preview of the result while typing 
function updateRealTimeResult() {
    const text = input.textContent;
    const lastChar = text[text.length - 1];

    if (text.length === 0 || isLastCharOperator() || lastChar === "(") {
        realTimeResult.textContent = "";
        return;
    }

    const value = evaluateExpression(text);

    if (value === undefined || isNaN(value)) {
        realTimeResult.textContent = "";
    } else {
        realTimeResult.textContent = "= " + value;
    }
}

// calculation when "=" is pressed
function calculateResult() {
    const text = input.textContent;
    const lastChar = text[text.length - 1];

    if (text.length === 0 || lastChar === "." || isLastCharOperator()) {
        return;
    }

    const value = evaluateExpression(text);
    if (value === undefined || isNaN(value)) return;

    addToHistory(text, value);

    result.textContent = text + "= " + value.toString(); // freeze the past expression above
    input.textContent = value.toString(); // result becomes the new working line
    realTimeResult.textContent = "";
}

function clearAll() {
    input.textContent = "";
    realTimeResult.textContent = "";
}

function deleteLastChar() {
    input.textContent = input.textContent.slice(0, -1);
    updateRealTimeResult();
}

// adds an opening or closing parenthesis
function toggleParenthesis() {
    const text = input.textContent;
    const lastChar = text[text.length - 1];
    const openCount = text.split("(").length - 1;
    const closeCount = text.split(")").length - 1;

    if (openCount > closeCount) {
        if (lastChar === "." || isLastCharOperator()) return;
        if (!appendToInput(")")) return;
    } else if (!appendToInput("(")) {
        return;
    }
    updateRealTimeResult();
}

function addToHistory(expression, value) {
    historyArray.push(`${expression} = ${value}`);
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    historyArray.forEach(entry => {
        const p = document.createElement("p");
        p.textContent = entry;
        historyList.appendChild(p);
    });
}

function clearHistory() {
    historyArray = [];
    renderHistory();
}

// handle operator input
function handleOperatorInput(symbol) {
    const text = input.textContent;
    const isEmpty = text.length === 0;
    const lastChar = text[text.length - 1];
    const lastTwoChars = text.slice(-2);

    // block operators at the start of the expression or right after a dot
    if (isEmpty || lastChar === ".") return;

    // turn "*" into "**", but never allow "***"
    if (symbol === "*" && lastChar === "*") {
        if (lastTwoChars === "**") return;
        appendToInput(symbol);
        return;
    }

    // block two operators in a row
    if (!isLastCharOperator()) {
        if (!appendToInput(symbol)) return;
    }
    updateRealTimeResult();
}

// handle number input
function handleNumberInput(symbol) {
    if (symbol === ".") {
        const text = input.textContent;
        const isEmpty = text.length === 0;
        const lastChar = text[text.length - 1];

        // block a dot at the start, after an operator, or right after "(" or ")"
        if (isEmpty || isLastCharOperator() || lastChar === "(" || lastChar === ")") return;

        // block a second dot within the current number
        if (isLastSegmentHasDot()) return;
    }

    if (!appendToInput(symbol)) return;
    updateRealTimeResult();
}

historyNavigation.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.dataset.action === "btn-history") {
            historyList.classList.toggle("open");
        } else if (btn.dataset.action === "btn-history-clear") {
            clearHistory();
        }
    });
});

actionBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.dataset.action === "clear") {
            clearAll();
        } else if (btn.dataset.action === "parenthesis") {
            toggleParenthesis();
        } else if (btn.dataset.action === "del") {
            deleteLastChar();
        } else if (btn.dataset.action === "equal") {
            calculateResult();
        }
    });
});

// handle operator input
operatorBtn.forEach(btn => {
    btn.addEventListener("click", () => handleOperatorInput(btn.textContent));
});

// handle number input
numberBtn.forEach(btn => {
    btn.addEventListener("click", () => handleNumberInput(btn.textContent));
});

// Keyboard input
document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (key >= "0" && key <= "9") {
        handleNumberInput(key);
    } else if (key === ".") {
        handleNumberInput(".");
    } else if (key === "+") {
        handleOperatorInput("+");
    } else if (key === "-") {
        handleOperatorInput("-");
    } else if (key === "*") {
        handleOperatorInput("*");
    } else if (key === "/") {
        e.preventDefault(); // stops Firefox's quick-find feature
        handleOperatorInput("÷");
    } else if (key === "(" || key === ")") {
        toggleParenthesis();
    } else if (key === "Enter" || key === "=") {
        calculateResult();
    } else if (key === "Backspace") {
        deleteLastChar();
    } else if (key === "Escape") {
        clearAll();
    }
});