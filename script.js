// Select the elements
// select the calculator screen where the calculator display is 
let calculatorInput = document.querySelector("#input-display");
let calculatorFormula = document.querySelector("#formula-display") // this stores the formula after user clicks equal

// select the button container where all elements are loaded
let calculatorButtons = document.querySelector("#button-container");

// Store the current calculation
let currentInput = ""; // this stores what the user types 
//let currentOperator = ""; // this stores the current operator like we always just update to the latest one
//let previousInput = ""; // this stores what the user previously calculated
let answer = ""; // this stores the answer
let latestItem = ""; // this is the last number or operator that was selected

// handle button clicks using event delegation 
calculatorButtons.addEventListener("click", function(event) {
    if (event.target.tagName !== "BUTTON") return; // Ignore clicks on non-buttons

    let buttonValue = event.target.textContent; // Get button text
    let buttonType = event.target.dataset.type; // Get the data-type attribute
    console.log(buttonValue + ' was clicked! This is a ' + buttonType);
    //console.log(event.target.classList)
    //console.log(event.target.tagName)

    function tokenize(expression) {
        return expression.match((/(\d+(\.\d+)?%?|\+|\-|\*|\/)/g)); //using regex
    }
    // \d+ → Matches integer numbers (894, 840).
    // (\.\d+)? → Matches optional decimal numbers (.32 in 840.32).
    // %? → Matches optional percentage signs (894%).
    // \+|\-|\*|\/ → Matches mathematical operators (+, -, *, /).

    if (buttonType == "number") {
        // this event occurs after we click "="
        if (calculatorInput.textContent == answer) {
            currentInput = ""; // let's reset the currentInput!
            calculatorInput.textContent = "0";
        }
        
        // FOR THE CASE when 0 is the first digit because its useless we ignore
        // we don't want 0000 or 0234 etc. 
        if ((calculatorInput.textContent == "0") && (buttonValue == "0")) return;

        //  this is for %
        if (currentInput.endsWith("%")) {
            currentInput += "*" // adds operator between so % always at end of number
        }
        currentInput += buttonValue //using += appends numbers instead of replacing them
        calculatorInput.textContent = currentInput // update display
        
        tokens = tokenize(currentInput)
        latestItem = tokens.pop(); // returns last element of the array

        //console.log("This is the current formula " + currentInput)
        //console.log("Current item: " + latestItem)

    } else if (buttonType == "clear") {
        currentInput = ""; //this resets the input and now we have to update display
        calculatorInput.textContent ="0"; //resets the screen

        calculatorFormula.textContent ="-"

        latestItem = "" //should be reset
    } else if (buttonType == "delete") {
        // this event occurs after we click "="
        if (calculatorInput.textContent == answer) {
            currentInput = answer.toString(); // let's reset the currentInput to equal answer so the operator can continue
        } // ALSO YOU HAVE TO FORCE IT BACK TO A STRING SO YOU CAN SLICE!!!!

        currentInput = currentInput.slice(0, -1); //removes the last character

        tokens = tokenize(currentInput) || []; // Ensure it's always an array
        if (tokens.length > 0) {
            latestItem = tokens.pop(); // returns last element of the array
        } else {
            latestItem = ""
        }
        console.log("Current item: " + latestItem)

        if (currentInput == "") {
            calculatorInput.textContent = "0"
        } else {
            calculatorInput.textContent = currentInput
        }
    } else if (buttonType == "decimal") {
        // decimal can only occur once per number!!!

        // if there is nothing and you need to add a decimal -> adds 0 infront
        if (calculatorInput.textContent == "0") {
            currentInput += "0.";
            calculatorInput.textContent = currentInput // update display
            latestItem += "0.";
        }

        if (!latestItem.includes(".")) {
        currentInput += "."
        calculatorInput.textContent = currentInput // update display
        latestItem += "." //need to add it on
        }
        
        console.log("current input" + currentInput)
        //console.log(calculatorFormula.textContent)
        //console.log(answer)
        console.log("what is displayed html" + calculatorInput.textContent)
        console.log("should be latest item" + latestItem)

    } else if (buttonType == "operator") {
        // this event occurs after we click "="
        if (calculatorInput.textContent == answer) {
            currentInput = answer // let's reset the currentInput to equal answer so the operator can continue
        }

        //if (!(buttonValue === "-") && currentInput === "") return; // Prevents error if no number was entered first but you can allow -
        //---------------let's explore negatives later
        
        if (currentInput === "") return; //prevents error

        if (["+","-","*","/"].includes(latestItem)) {
            currentInput = currentInput.slice(0,-1) + buttonValue
        } else {
            currentInput += buttonValue
        }
        calculatorInput.textContent = currentInput // update display

        latestItem = buttonValue
        console.log("Current item: " + latestItem)

        //console.log("This is the current formula " + currentInput)

        //previousInput = currentInput; // stores the number from before
        //currentOperator = buttonValue; //stores the operator
        //currentInput = ""; //resets the current input
        //console.log("This is the current operator " + currentOperator);
        //console.log("Stored " + previousInput + " as first number")
    } else if (buttonType == "percentage") {
        if (currentInput === "") return; // Prevents error if no number was entered first

        if (["+","-","/","%"].includes(latestItem)) return; //prevents % immediately after operator

        // percentage can only occur once per number!!! and only at the end no more numbers after it

        if (!latestItem.includes("%")) {
            currentInput += "%"
            calculatorInput.textContent = currentInput // update display
            }
        
        latestItem += "%"
        console.log("Current item: " + latestItem)
    } else if (buttonType == "equal") {
        if (calculatorInput.textContent == "0") return;

        calculatorFormula.textContent = currentInput // this updates the previous formula 

        tokens = tokenize(currentInput); // example: tokens = ["65.2", "*", "98", "/", "9%", "*", "854"]

        function doTheMaths(tokens) {
            // STEP 1: Let's convert our % to decimals + convert our numbers from strings to floats
            let processed_tokens = [];
            for (let token of tokens) { // This is a for loop
                if (token.endsWith("%")) { // if ends with %
                    let number = parseFloat(token) / 100; // this changes "99%" -> 0.99
                    processed_tokens.push(number); // This adds the decimal to the list 
                } else if (isNaN(token)) { //checks if its is NOT a number 
                    processed_tokens.push(token);
                } else {
                    let number = parseFloat(token);
                    processed_tokens.push(number);
                }
            }
            console.log(processed_tokens);
            console.log(processed_tokens.length);
            // NOW LET'S PROCESS MULTIPLICATION AND DIVISION: So we should identify whereever there is a * or %
            // We will multiply or divide the previous and next number

            let i = 0;
            let result = [];
            while (i<(processed_tokens.length)) {
                if ((processed_tokens[i] === "*") || (processed_tokens[i] === "%")) {
                    previous_num = processed_tokens[i-1];
                    after_num = processed_tokens [i+1];
                    if (processed_tokens[i] === "*") {
                        calculation = previous_num * after_num
                    } else {
                        calculation = previous_num / after_num
                    }
                    result.pop(); // removes the previous num before it 
                    result.push(calculation); // addeds the result of the multiplication or division
                    i += 2; // now we want to skip to the next operator 
                } else {
                    result.push(processed_tokens[i]); // adds new element to the array 
                    i += 1; //we just want to check out the next number
                }
            }
            console.log(result)
            // YAY! Now let's do addition and subtraction
            answer = result[0]; // this is also good if there are no addition or subtraction 
            j = 1
            while(j < result.length) {
                if ((result[j] === "+") || (result[j] === "-")) {
                    after_num = result[j+1];
                    if (result[j] === "+") {
                        answer += after_num
                    } else {
                        answer -= after_num
                    }
                    j += 2; // now we want to skip to the next operator 
                } else {
                    j += 1; // safety net incase something screws up! e.g. 2+-3
                }
            }
            return answer;
        
        }
        calculatorInput.textContent = doTheMaths(tokens) // update display

        console.log(currentInput)
        console.log(calculatorFormula.textContent)
        console.log(answer)
        console.log(calculatorInput.textContent)

        // now we have to change it so if we click a number now the currentInput would reset to 0 
        // however if we click an operator the currentInput would reset to = the answer


        // ------------------ OLD CODE WHEN I HAD NO CALCULATOR DISPLAY OR BODMAS

        //if (previousInput === "" || currentInput === "") return; // Prevent errors


        //let num1 = parseFloat(previousInput); // Convert first input to number
        //let num2 = parseFloat(currentInput);  // Convert second input to number
        //let result = "";

        //if (currentOperator == "+") {
        //    result = num1+num2
        //} else if (currentOperator == "-") {
        //    result = num1-num2
        //} else if (currentOperator == "/") {
        //    result = num1/num2
        //} else if (currentOperator == "*") {
        //    result = num1*num2
        //}

        //calculatorInput.textContent = result
        //currentInput = ""
        //previousInput = result
        //currentOperator = ""
    }
}
)