"use strict";
// clone of iPhone SE calculator (basic operations only)

// Solving JS floating point math issues .1 +.2 = .300000000000004
// To solve the problem above, it helps to multiply and divide:
// let x = (0.2 * 10 + 0.1 * 10) / 10;
// how/when to implement that?

// HTML/CSS needs a major revamp
// add handling for keyboard entry ?(if(keypress is in [keyboard, events, in, array] do the operation at the index that matches the key event...something like that)
// refactor as needed

let display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");
const clearBtn = document.querySelector("#clear");

const calc = {
  memory: [],
  displayVal: "",
  operator1: false,
  operator2: false,
  storedVal: "",
  decimal: false,
  repeatedEqualPress: false,

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
    this.displayVal = "";
    display.innerText = "0";
  },

  allClear() {
    this.memory = [];
    this.storedVal = "";
    this.decimal = false;
    this.operator1 = false;
    this.operator2 = false;
    this.orderOperations = false;
    this.repeatedEqualPress = false;
    display.innerText = "0";
  },

  sign() {
    if (this.displayVal != "") {
      this.displayVal = -Number(this.displayVal).toString();
      display.innerText = this.displayVal;
    } else if (display.innerText === "-0") {
      display.innerText = "0";
    } else {
      display.innerText = "-0";
      this.displayVal = "-0";
    }
  },
  percentage() {
    this.displayVal = (Number(this.displayVal) / 100).toString();
  },
};
// EVENT LISTENERS
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const btnValue = button.value;
    const btnClass = button.className;
    const highOrderOperations = ["multiply", "divide"];
    const isHighOrderOperation = (op) =>
      highOrderOperations.includes(op) || false;

    // INPUT NUMBER VALUES AS STRINGS
    if (btnClass === "number-btn") {
      if (calc.displayVal === "-0") {
        calc.displayVal = calc.displayVal.replace("0", btnValue);
        display.innerText = calc.displayVal;
      } else {
        calc.displayVal = calc.displayVal.concat(btnValue);
        display.innerText = calc.displayVal;
      }
    }
    // OPERATIONS
    if (btnClass === "function-btn") {
      if (!calc.operator1) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
      } else if (calc.repeatedEqualPress) {
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
        !isHighOrderOperation(btnValue) &&
        !calc.operator2
      ) {
        calc.memory[0] = calc[`${calc.operator1}`](
          calc.memory[0],
          calc.displayVal
        );
        calc.operator1 = btnValue;
        display.innerText = calc.memory[0];
      }
      // Handling for correct order of operations in chained operations
      // EX 2 + 6 * 2 = 14 = 28 = 56 etc.
      else if (
        !isHighOrderOperation(calc.operator1) &&
        isHighOrderOperation(btnValue) &&
        !calc.operator2
      ) {
        calc.operator2 = btnValue;
        calc.memory[1] = calc.displayVal;

        // handling for chained operations like:
        // 2 + 6 * 2 + 6 = 20 = 26 = 32 etc.
      } else if (
        !isHighOrderOperation(calc.operator1) &&
        !isHighOrderOperation(btnValue)
      ) {
        calc.storedVal = calc.displayVal;
        calc.memory[1] = calc[`${calc.operator2}`](
          calc.memory[1],
          calc.displayVal
        );
        calc.displayVal = calc[`${calc.operator1}`](
          calc.memory[0],
          calc.memory[1]
        );
        calc.memory = [];
        calc.operator1 = btnValue;
        calc.operator2 = false;
        calc.memory[0] = calc.displayVal;
        display.innerText = calc.displayVal;
      } else if (
        !isHighOrderOperation(calc.operator1) &&
        isHighOrderOperation(btnValue)
      ) {
        calc.storedVal = calc.displayVal;
        calc.memory[1] = calc[`${calc.operator2}`](
          calc.memory[1],
          calc.displayVal
        );
        calc.operator2 = btnValue;
        calc.displayVal = calc.memory[1];
        display.innerText = calc.displayVal;
      }

      calc.displayVal = "";
      calc.decimal = false;
    }

    // EQUALS
    if (button.id === "equals") {
      if (
        !isHighOrderOperation(calc.operator1) &&
        isHighOrderOperation(calc.operator2)
      ) {
        calc.storedVal = calc.displayVal;
        calc.memory[1] = calc[`${calc.operator2}`](
          calc.memory[1],
          calc.displayVal
        );
        calc.displayVal = calc[`${calc.operator1}`](
          calc.memory[0],
          calc.memory[1]
        );
        display.innerText = calc.displayVal;
        calc.operator1 = calc.operator2;
        calc.operator2 = false;
        calc.memory = [];
        calc.repeatedEqualPress = true;
      } else if (!calc.repeatedEqualPress) {
        calc.storedVal = display.innerText;
        calc.displayVal = calc[`${calc.operator1}`](
          calc.memory[0],
          display.innerText
        );
        display.innerText = calc.displayVal;
        calc.repeatedEqualPress = true;
        calc.memory = [];
      } else {
        calc.displayVal = calc[`${calc.operator1}`](
          calc.displayVal,
          calc.storedVal
        );
        display.innerText = calc.displayVal;
      }
    }

    // FUNCTIONS
    // TODO *** clear/allClear not working somewhere. will look after order of operations is sorted out better
    if (button.id === "clear") {
      clearBtn.innerText === "AC" ? calc.allClear() : calc.clear();
    }
    if (button.id === "sign") {
      calc.sign();
    }
    if (button.id === "percent") {
      calc.percentage();
      display.innerText = calc.displayVal;
    }
    if (button.id === "decimal" && calc.decimal === false) {
      calc.displayVal === ""
        ? (calc.displayVal = "0.")
        : (calc.displayVal += ".");
      calc.decimal = true;
      display.innerText = calc.displayVal;
    }

    // not quite right, here's what I want: after "1 + 3" > Clear, btn = AC display = 0 "+" button has hover effect to show that is the previously selected operation
    display.innerText === "0" && !calc.operator1
      ? (clearBtn.innerText = "AC")
      : (clearBtn.innerText = "C");
  });
});
