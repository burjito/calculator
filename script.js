let displayValue = "";
let memoryValue = 0;
let history = [];
let isScientific = false;
let isOpeningParenthesis = true;
let lastOperator = ""; // Track the last operator clicked

// Update the display with the given value
function updateDisplay(value) {
  document.getElementById("display").value = value;
  updateConversions();  // Update conversions on every display change
}

// Handle percent conversion
function handlePercent() {
  if (displayValue !== "") {
    let numericValue = parseFloat(displayValue);
    if (!isNaN(numericValue)) {
      displayValue = (numericValue / 100).toString();  // Convert to decimal
      updateDisplay(displayValue);
    }
  }
}

// Append numbers to the display
function appendNumber(number) {
  displayValue += number;
  updateDisplay(displayValue);
}

// Append operators (+, -, *, etc.) to the display
function appendOperator(operator) {
  // If the last input was an operator, replace it with the new one
  if (/[+\-*/^]/.test(displayValue.charAt(displayValue.length - 1))) {
    displayValue = displayValue.slice(0, -1);  // Remove the last operator
  }

  displayValue += operator;
  lastOperator = operator;  // Update the last operator
  updateDisplay(displayValue);
}

// Append a decimal point to the display if it doesn’t already exist
function appendDecimal() {
  if (displayValue === "" || /[+\-*/^()]/.test(displayValue.charAt(displayValue.length - 1))) {
    displayValue += "0.";  // If the display ends with an operator, add 0 and a decimal point
  } else if (!displayValue.includes(".")) {
    displayValue += ".";  // If the current number doesn't have a decimal, add one
  }

  updateDisplay(displayValue);
}

// Clear the display
function clearDisplay() {
  displayValue = "";
  updateDisplay(displayValue); 

  // Clear the conversion values (hex, oct, dec, bin)
  document.getElementById("hex-value").textContent = "";
  document.getElementById("oct-value").textContent = "";
  document.getElementById("dec-value").textContent = "";
  document.getElementById("bin-value").textContent = "";
}

// Toggle the sign of the current display value
function toggleSign() {
  displayValue = displayValue.startsWith("-") ? displayValue.slice(1) : "-" + displayValue;
  updateDisplay(displayValue);
}

// Calculate the result and display it
function calculateResult() {
  try {
    if (displayValue === "") {
      throw new Error('Empty expression');
    }

    // Handle percent conversion
    if (displayValue.includes('%')) {
      displayValue = displayValue.replace(/%/g, '');
      displayValue = (parseFloat(displayValue) / 100).toString();
    }

    // Strip out invalid characters
    displayValue = displayValue.replace(/[^0-9+\-*/().]/g, '');

    let result = parseFloat(eval(displayValue));

    if (isNaN(result)) {
      throw new Error('Invalid calculation');
    }

    // Fix result to remove trailing zeros
    // Check if it's an integer
    if (result % 1 === 0) {
      result = result.toString();  // Convert to string if it's an integer
    } else {
      // Remove trailing zeros for floating-point numbers
      result = result.toString().replace(/(\.\d*?)0+$/, '$1'); 
    }

    // Store history
    history.push({ input: displayValue, output: result });

    displayValue = result;
    updateDisplay(displayValue);
  } catch (e) {
    updateDisplay("Error");
  }
}


// Append scientific functions (sin, cos, tan, etc.)
function appendFunction(func) {
  const input = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    log: Math.log10,
    ln: Math.log,
  };

  if (func in input) {
    displayValue += func + "(";
    updateDisplay(displayValue);
  }
}

// Append constants like pi or e
function appendConstant(constant) {
  const constants = {
    pi: Math.PI,
    e: Math.E,
  };

  displayValue += constants[constant];
  updateDisplay(displayValue);
}

// Toggle between standard and scientific modes
function toggleScientificMode() {
  const calculator = document.getElementById("calculator");
  const standardButtons = document.getElementById("standard-buttons");
  const scientificButtons = document.getElementById("scientific-buttons");
  const conversionsRow = document.querySelector(".conversions-row");
  const modeToggle = document.querySelector(".mode-toggle");
  const header = document.querySelector(".header .title");

  if (isScientific) {
    isScientific = false;
    scientificButtons.classList.add("hidden");
    conversionsRow.classList.add("hidden");
    modeToggle.textContent = "⇄";
    header.textContent = "Standard";
  } else {
    isScientific = true;
    scientificButtons.classList.remove("hidden");
    conversionsRow.classList.remove("hidden");
    modeToggle.textContent = "⇄";
    header.textContent = "Scientific";
  }

  calculator.classList.toggle("expanded");
}

// Erase the last character on the display
function eraseLastCharacter() {
  displayValue = displayValue.slice(0, -1);
  updateDisplay(displayValue);
}

// Show history of calculations
function showHistory() {
  const historyContainer = document.querySelector(".history-container");
  historyContainer.classList.toggle("hidden");
  
  const historyContent = document.querySelector(".history-content");
  historyContent.innerHTML = ''; 
  
  history.forEach((entry) => {
    const entryContainer = document.createElement("div");
    entryContainer.classList.add("history-entry");

    const entryText = document.createElement("p");
    entryText.textContent = `${entry.input} = ${entry.output}`;
    entryContainer.appendChild(entryText);

    historyContent.appendChild(entryContainer);
  });
}

// Clear history
function clearHistory() {
  history = [];
  showHistory();
}

// Close history view
function closeHistory() {
  const historyContainer = document.querySelector(".history-container");
  historyContainer.classList.add("hidden");
}

// Update the conversion values (decimal, hex, oct, binary)
function updateConversions() {
  if (displayValue !== "") {
    const decimalValue = parseFloat(displayValue);
    if (!isNaN(decimalValue)) {
      document.getElementById("hex-value").textContent = decimalValue.toString(16);
      document.getElementById("oct-value").textContent = decimalValue.toString(8);
      document.getElementById("dec-value").textContent = decimalValue.toString(10);
      document.getElementById("bin-value").textContent = decimalValue.toString(2);
    }
  }
}

// Toggle between parentheses (open/close)
function toggleParentheses() {
  const display = document.getElementById("display");
  const button = document.getElementById("parentheses-btn");

  if (isOpeningParenthesis) {
    display.value += "(";
    button.textContent = ")";
  } else {
    display.value += ")";
    button.textContent = "(";
  }

  isOpeningParenthesis = !isOpeningParenthesis; 
}

// Store current display value in memory (MS)
function memoryStore() {
  memoryValue = parseFloat(displayValue);
  updateDisplay(displayValue);
}

// Recall the value from memory (MR)
function memoryRecall() {
  displayValue = memoryValue.toString();
  updateDisplay(displayValue);
}

// Clear memory (MC)
function memoryClear() {
  memoryValue = 0;
  updateDisplay(displayValue);
}

// Add current display value to memory (M+)
function memoryAdd() {
  memoryValue += parseFloat(displayValue);
  updateDisplay(displayValue);
}

// Subtract current display value from memory (M-)
function memorySubtract() {
  memoryValue -= parseFloat(displayValue);
  updateDisplay(displayValue);
}

// Ensure conversions are updated automatically on display input
document.getElementById("display").addEventListener("input", function() {
  updateConversions();
});
