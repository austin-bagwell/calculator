"use strict";
// clone of iPhone SE calculator (basic operations only)
// TODO = flagged to fix, lower priority

// FIXME Need to add another operand to account for order of operations

// Solving JS floating point math issues .1 +.2 = .300000000000004
// To solve the problem above, it helps to multiply and divide:
// let x = (0.2 * 10 + 0.1 * 10) / 10;
// how/when to implement that?

// Clear/All Clear button needs fine tuning

// HTML/CSS needs a major revamp
// add handling for keyboard entry ?(if(keypress is in [keyboard, events, in, array] do the operation at the index that matches the key event...something like that)
// refactor as needed

let display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");
const clearBtn = document.querySelector("#clear");

const calc = {
  // STATE
  memory: [],
  displayVal: "",
  operator1: false,
  operator2: false,
  storedVal: "",
  decimal: false,
  // currently not using this as a state anywhere
  // orderOperations: false,
  repeatedEqualPress: false,

  // METHODS
  add: (val1, val2) => {
    return (Number(val1) + Number(val2)).toString();
  },
  subtract: (val1, val2) => {
    return (Number(val1) - Number(val2)).toString();
  },
  multiply: (val1, val2) => {
    return (Number(val1) * Number(val2)).toString();
  },
  divide: (val1, val2) => {
    return (Number(val1) / Number(val2)).toString();
  },

  clear() {
    this.decimal = false;
    this.operator1 = false;
    this.operator2 = false;
    this.displayVal = "";
    display.innerText = "0";
  },

  allClear() {
    this.memory = [];
    this.decimal = false;
    this.operator1 = false;
    this.operator2 = false;
    this.orderOperations = false;
    this.repeatedEqualPress = false;
    display.innerText = "0";
  },

  sign() {
    // not quite matching iPhone functionality here -- I want sign() > -0 > -x
    // this.displayVal != 0
    //   ? (this.displayVal = -this.displayVal)
    //   : (this.displayVal = String("-0"));
    this.displayVal = -Number(this.displayVal);
    this.displayVal = String(this.displayVal);
    display.innerText = this.displayVal;
  },
  // need to do some rounding to account for weird JS number issues
  percentage() {
    this.displayVal = (Number(this.displayVal) / 100).toString();
    // this.displayVal = String(this.displayVal);
  },
};

const initialEval = function (operator) {
  calc.displayVal = display.innerText;

  if (operator === "add") {
    calc.displayVal = calc.add(calc.memory[0], calc.displayVal);
  } else if (operator === "subtract") {
    calc.displayVal = calc.subtract(calc.memory[0], calc.displayVal);
    calc.memory[0] = calc.displayVal;
  } else if (operator === "multiply") {
    calc.displayVal = calc.multiply(calc.memory[0], calc.displayVal);
  } else if (operator === "divide") {
    calc.displayVal = calc.divide(calc.memory[0], calc.displayVal);
    calc.memory[0] = calc.displayVal;
  }

  calc.repeatedEqualPress = true;
  display.innerText = calc.displayVal;
};

const repeatedEval = function (operator) {
  if (operator === "add") {
    calc.displayVal = calc.add(calc.storedVal, calc.displayVal);
  } else if (operator === "subtract") {
    calc.displayVal = calc.subtract(calc.displayVal, calc.storedVal);
  } else if (operator === "multiply") {
    calc.displayVal = calc.multiply(calc.storedVal, calc.displayVal);
  } else if (operator === "divide") {
    calc.displayVal = calc.divide(calc.displayVal, calc.storedVal);
  }
  display.innerText = calc.displayVal;
};

const evalOrderOperations = function () {
  let orderOpsVal, newVal;
  orderOpsVal =
    calc.operator2 === "multiply"
      ? calc.multiply(calc.memory[1], calc.memory[2])
      : calc.divide(calc.memory[1], calc.memory[2]);
  console.log(`orderOpsVal: ${orderOpsVal}`);
  newVal =
    calc.operator1 === "add"
      ? calc.add(calc.memory[0], orderOpsVal)
      : calc.subtract(calc.memory[0], orderOpsVal);
  console.log(`newVal: ${newVal}`);

  return newVal;
  // calc.memory.push(newVal);
  // calc.memory.shift();
  // calc.memory.shift();
  // calc.operator1 = calc.operator2;
  // calc.operator2 = false;
  // calc.displayVal = newVal;
  // display.innerText = calc.displayVal;
};

// EVENT LISTENERS
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const btnValue = button.value;
    const btnClass = button.className;

    // INPUT NUMBER VALUES AS STRINGS
    if (btnClass === "number-btn") {
      if (!calc.decimal) {
        calc.displayVal = calc.displayVal.concat(btnValue);
        display.innerText = calc.displayVal;
        // calc.displayVal = Number(calc.displayVal);
      } else {
        calc.displayVal = calc.displayVal.concat(btnValue);
        display.innerText = calc.displayVal;
      }
    }
    // OPERATIONS
    if (btnClass === "function-btn") {
      const highOrderOperations = ["multiply", "divide"];
      const isHighOrderOperation = (op) =>
        highOrderOperations.includes(op) ? true : false;

      // this block handles operations chained after hitting "=" one or more times
      // EX: 1 + 3 = 4 = 7 + 3 = 10
      // EX: 5 * 5 = 25 = 125 / 100 = 1.25
      if (!calc.operator1 && !calc.repeatedEqualPress) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
      } else if (!calc.operator1 && calc.repeatedEqualPress) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
        calc.repeatedEqualPress = false;
        calc.operator2 = false;
        calc.storedVal = "";
      }
      // Handles what happens after a chaining * or / operators then hitting =
      // EX 2 * 6 * 12 = 144 = 1728 / 100 = 17.28
      else if (calc.repeatedEqualPress) {
        calc.operator1 = btnValue;
        calc.memory[0] = display.innerText;
        calc.repeatedEqualPress = false;
        calc.operator2 = false;
        calc.storedVal = "";
      }
      // This block handles chained operations starting with * or /
      // EX 2 * 6 * 12 / 2 * 4 = 288
      else if (isHighOrderOperation(calc.operator1)) {
        calc.memory[0] = calc[`${calc.operator1}`](
          calc.memory[0],
          calc.displayVal
        );
        calc.operator1 = btnValue;
        display.innerText = calc.memory[0];
      }

      // This block handles chained operator input for + and -
      // EX: 1 + 1 + 1 + 1 = 4 = 5 = 6 etc.
      // EX: 100 - 5 - 20 + 25 = 100 = 125 = 150 etc
      else if (
        !isHighOrderOperation(calc.operator1) &&
        !isHighOrderOperation(btnValue)
      ) {
        calc.memory[0] = calc[`${calc.operator1}`](
          calc.memory[0],
          calc.displayVal
        );
        calc.operator1 = btnValue;
        display.innerText = calc.memory[0];
      }
      // Handling for correct order of operations in chained operations
      // I do need to add some logic to the "equals" section so it knows how to evaluate it correctly
      // EX 2 + 6 * 2 = 14 = 28 = 56 etc.
      // EX 2 + 6 * 2 * (display 12) 2 = 26
      // first else if initiates the storing of order of operations sequence
      else if (
        !isHighOrderOperation(calc.operator1) &&
        isHighOrderOperation(btnValue) &&
        !calc.operator2
      ) {
        calc.memory[1] = calc.displayVal;
        calc.operator2 = btnValue;
      }
      // this handles chained higher order operations
      // EX 2 + 6 * 2 * 2 / 3 ... still no handing for when you hit "="
      else if (
        !isHighOrderOperation(calc.operator1) &&
        isHighOrderOperation(btnValue) &&
        calc.operator2
      ) {
        calc.memory[1] = calc[`${calc.operator2}`](
          calc.memory[1],
          calc.displayVal
        );
        display.innerText = calc.memory[1];
        calc.operator2 = btnValue;
      } /*else if (handling for chaining like 2 + 6 * 2 + 6 = 20 ) {
        // do stuff
      }*/

      calc.displayVal = "";
    }

    // EQUALS
    if (button.id === "equals") {
      if (!calc.repeatedEqualPress && !calc.operator2) {
        // FIXME
        // need to add handling for = press when op1 +- && storedOp */
        // if ^ : storedVal = displayVal, call storedOp(memory[1], storedVal) return newVal, then op1(memory[1], newVal) return newDisplayVal --- clear op1, clear memory, repeatEquals=true
        calc.storedVal = calc.displayVal;
        calc.operator2 = calc.operator1;
        initialEval(calc.operator1);

        calc.memory = [];
        calc.operator1 = false;
      } else if (calc.repeatedEqualPress) {
        repeatedEval(calc.operator2);
      }
    }

    // FUNCTIONS
    // TODO *** clear/allClear not working somewhere. will look after order of operations is sorted out better
    if (button.id === "clear") {
      calc.displayVal === "" ? calc.allClear() : calc.clear();
    }
    if (button.id === "sign") {
      calc.sign();
    }
    if (button.id === "percent") {
      calc.percentage();
      display.innerText = calc.displayVal;
    }
    if (button.id === "decimal" && calc.decimal === false) {
      calc.displayVal += ".";
      calc.decimal = true;
      display.innerText = calc.displayVal;
    }

    // not quite right, here's what I want: after "1 + 3" > Clear, btn = AC display = 0 "+" button has hover effect to show that is the previously selected operation
    // needs a refactor post PEMDAS update anyhow
    calc.displayVal == 0 && !calc.function
      ? (clearBtn.innerText = "AC")
      : (clearBtn.innerText = "C");

    // add a display.innerText = calc.displayVal here in lieu of calls elsewhere, maybe?
    // display.innerText = calc.displayVal;
  });
});
