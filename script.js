"use strict";
// clone of iPhone SE calculator (basic operations only)
// TODO

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
  decimal: false,
  // currently not using this as a state anywhere
  // orderOperations: false,
  repeatEqual: false,

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
    this.displayVal = "";
    this.decimal = false;
    display.innerText = "0";
  },

  allClear() {
    this.memory = [];
    this.decimal = false;
    this.operator1 = false;
    this.operator2 = false;
    this.orderOperations = false;
    this.repeatEqual = false;
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
  if (!calc.repeatEqual && !calc.operator2) {
    if (operator === "add") {
      calc.memory.push(calc.displayVal);
      calc.displayVal = calc.add(calc.memory[0], calc.memory[1]);
    } else if (operator === "subtract") {
      calc.memory.push(calc.displayVal);
      calc.displayVal = calc.subtract(calc.memory[0], calc.memory[1]);
      calc.memory[0] = calc.displayVal;
    } else if (operator === "multiply") {
      calc.memory.push(calc.displayVal);
      calc.displayVal = calc.multiply(calc.memory[0], calc.memory[1]);
    } else if (operator === "divide") {
      calc.memory.push(calc.displayVal);
      calc.displayVal = calc.divide(calc.memory[0], calc.memory[1]);
      calc.memory[0] = calc.displayVal;
    }
    display.innerText = calc.displayVal;
    calc.repeatEqual = true;
  }
};

const repeatedEval = function (operator) {
  if (calc.repeatEqual && !calc.operator2) {
    if (operator === "add") {
      calc.memory[1] = calc.displayVal;
      calc.displayVal = calc.add(calc.memory[0], calc.memory[1]);
      display.innerText = calc.displayVal;
    } else if (operator === "subtract") {
      calc.displayVal = calc.subtract(calc.memory[0], calc.memory[1]);
      calc.memory[0] = calc.displayVal;
      display.innerText = calc.displayVal;
    } else if (operator === "multiply") {
      calc.memory[1] = calc.displayVal;
      calc.displayVal = calc.multiply(calc.memory[0], calc.memory[1]);
      display.innerText = calc.displayVal;
    } else if (operator === "divide") {
      calc.displayVal = calc.divide(calc.memory[0], calc.memory[1]);
      calc.memory[0] = calc.displayVal;
      display.innerText = calc.displayVal;
    }
  }
};

// will be added to equalsBtn && functionBtn event listeners
// how to disable adding to memory if a function is pressed multiple times
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
  calc.memory.push(newVal);
  calc.memory.shift();
  calc.memory.shift();

  calc.operator1 = calc.operator2;
  calc.operator2 = false;
  calc.displayVal = newVal;
  // display.innerText = calc.displayVal;
};

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
      const lowOrderOperations = ["add", "subtract"];
      const highOrderOperations = ["multiply", "divide"];

      if (!calc.operator1) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
      } else if (
        lowOrderOperations.includes(calc.operator1) &&
        highOrderOperations.includes(calc.operator2)
      ) {
        calc.memory.push(calc.displayVal);
        evalOrderOperations();
        display.innerText = calc.displayVal;
      } else if (btnValue === "add" || btnValue === "subtract") {
        calc.operator1 = btnValue;
        calc.displayVal =
          calc.operator1 === "add"
            ? calc.add(calc.memory[0], calc.displayVal)
            : calc.subtract(calc.memory[0], calc.displayVal);
        calc.memory.shift();
        calc.memory.push(calc.displayVal);
        display.innerText = calc.displayVal;
      } else {
        calc.memory.push(calc.displayVal);
        calc.operator2 = btnValue;
      }

      calc.displayVal = "";
    }

    if (button.id === "equals") {
      /*
       *
       * The chunk below describes the behavior that happens when no Order of Operations are engaged and the user continues to hit "=". Essentially, repeat the initial operation using the 2nd number that was pressed. So, 1 + 1 = = = 4 and so on
       *
       *
       */
      if (!calc.repeatEqual && !calc.operator2) {
        initialEval(calc.operator1);
      } else if (calc.repeatEqual && !calc.operator2) {
        repeatedEval(calc.operator1);
      }
    }

    // FUNCTIONS
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
