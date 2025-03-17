// Select the elements
// select the calculator screen where the calculator display is 
let calculatorDisplay = document.querySelector("#calculator-screen");

// select the button container where all elements are loaded
let calculatorButtons = document.querySelector("#button-container");

// Store the current calculation
let currentInput = ""; // this stores what the user types 
let currentOperator = ""; // this stores the current operator like we always just update to the latest one
let previousInput = ""; // this stores what the user previously calculated

// handle button clicks using event delegation 
calculatorButtons.addEventListener("click", function(event) {
    if (event.target.tagName !== "BUTTON") return; // Ignore clicks on non-buttons

    let buttonValue = event.target.textContent; // Get button text
    let buttonType = event.target.dataset.type; // Get the data-type attribute
    console.log(buttonValue + ' was clicked! This is a ' + buttonType);
    //console.log(event.target.classList)
    //console.log(event.target.tagName)

    if (buttonType == "number") {
        currentInput += buttonValue //using += appends numbers instead of replacing them
        calculatorDisplay.textContent = currentInput // update display
    } else if (buttonType == "clear") {
        currentInput = ""; //this resets the input and now we have to update display
        calculatorDisplay.textContent ="0"; //resets the screen
    } else if (buttonType == "delete") {
        currentInput = currentInput.slice(0, -1); //removes the last character
        if (currentInput == "") {
            calculatorDisplay.textContent = "0"
        } else {
            calculatorDisplay.textContent = currentInput
        }
    } else if (buttonType == "decimal") {
        if (!currentInput.includes(".")) {
        currentInput += "."
        calculatorDisplay.textContent = currentInput // update display
        }
    } else if (buttonType == "operator") {
        if (currentInput === "") return; // Prevents error if no number was entered first
        previousInput = currentInput; // stores the number from before
        currentOperator = buttonValue; //stores the operator
        currentInput = ""; //resets the current input
        console.log("This is the current operator " + currentOperator);
        console.log("Stored " + previousInput + " as first number")
    } else if (buttonType == "percentage") {
        if (!currentInput.includes(".")) {
            currentInput += "%"
            calculatorDisplay.textContent = currentInput // update display
            }
    } else if (buttonType == "equal") {
        if (previousInput === "" || currentInput === "") return; // Prevent errors
        let num1 = parseFloat(previousInput); // Convert first input to number
        let num2 = parseFloat(currentInput);  // Convert second input to number
        let result = "";

        if (currentOperator == "+") {
            result = num1+num2
        } else if (currentOperator == "-") {
            result = num1-num2
        } else if (currentOperator == "/") {
            result = num1/num2
        } else if (currentOperator == "*") {
            result = num1*num2
        }

        calculatorDisplay.textContent = result
        currentInput = ""
        previousInput = result
        currentOperator = ""
    }
}
)