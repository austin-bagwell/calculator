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
  storedVal: "",
  storedFunc: false,
  decimal: false,
  // currently not using this as a state anywhere
  // orderOperations: false,
  repeatEqualPress: false,

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
    this.repeatEqualPress = false;
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
  // calc.memory.shift();
  calc.repeatEqualPress = true;
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

// TODO
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
    // FIXME
    if (btnClass === "function-btn") {
      const lowOrderOperations = ["add", "subtract"];
      const highOrderOperations = ["multiply", "divide"];

      // this block handles operations chained after hitting "=" one or more times
      // EX: 1 + 3 = 4 = 7 + 3 = 10
      // EX: 5 * 5 = 25 = 125 / 100 = 1.25
      if (!calc.operator1 && !calc.repeatEqualPress) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
      } else if (!calc.operator1 && calc.repeatEqualPress) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
        calc.repeatEqualPress = false;
        calc.storedFunc = false;
        calc.storedVal = "";
      }
      // This block handles chained operator input for + and -
      // EX: 1 + 1 + 1 + 1 = 4
      // EX: 100 - 5 - 20 + 25 = 100
      else if (
        calc.operator1 &&
        (btnValue === "add" || btnValue === "subtract")
      ) {
        calc.memory[1] = calc.displayVal;
        calc.memory[0] =
          calc.operator1 === "add"
            ? calc.add(calc.memory[0], calc.memory[1])
            : calc.subtract(calc.memory[0], calc.memory[1]);
        calc.displayVal = calc.memory[0];
        calc.operator1 = btnValue;
        display.innerText = calc.memory[0];
        calc.memory.pop();
      }
      // This block handles multiply and divide as the first operator

      // else if (
      //   (btnValue === "add" || btnValue === "subtract") &&
      //   !calc.repeatEqualPress
      // ) {
      //   calc.memory[1] = calc.displayVal;
      //   calc.memory[0] =
      //     calc.operator1 === "add"
      //       ? calc.add(calc.memory[0], calc.memory[1])
      //       : calc.subtract(calc.memory[0], calc.memory[1]);
      //   calc.displayVal = calc.memory[0];
      //   calc.memory.pop();
      //   display.innerText = calc.displayVal;
      // } else if (
      //   lowOrderOperations.includes(calc.operator1) &&
      //   highOrderOperations.includes(calc.operator2)
      // ) {
      //   // initialEval(calc.operator1);
      //   // calc.memory.push(calc.displayVal);
      //   // evalOrderOperations();
      //   // display.innerText = calc.displayVal;
      // } else {
      //   calc.memory.push(calc.displayVal);
      //   calc.operator2 = btnValue;
      // }

      calc.displayVal = "";
    }

    // EQUALS
    if (button.id === "equals") {
      if (!calc.repeatEqualPress && !calc.operator2) {
        calc.storedVal = calc.displayVal;
        calc.storedFunc = calc.operator1;
        initialEval(calc.operator1);
        // calc.storedVal = calc.memory[0];
        calc.memory = [];
        calc.operator1 = false;
      } else if (calc.repeatEqualPress) {
        // calc.memory.shift();
        repeatedEval(calc.storedFunc);
      }
    }

    // FUNCTIONS
    // FIXME *** clear/allClear not working somewhere. will look after order of operations is sorted out better
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
