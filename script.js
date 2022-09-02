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
    this.displayVal = Number(this.displayVal) / 100;
    this.displayVal = String(this.displayVal);
  },
};

// will be added to equalsBtn && functionBtn event listeners
const evalOrderOperations = function () {
  let orderOpsVal, newVal;
  if (calc.operator1 && calc.operator2) {
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
    display.innerText = calc.displayVal;
  } else
    return false; /* do i need to return here if the If evals to false? idk yet */
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
      calc.memory.push(calc.displayVal);
      // with 2+6*2 :
      // currently yielding memory ["2", 14", 4] , displayVal 4
      // no idea why, but I guess that's not bad for a first attempt
      // might be running the other stuff below in addition to evalOrderOperations()
      calc.displayVal = "";
      evalOrderOperations();

      if (!calc.operator1) {
        calc.operator1 = btnValue;
        // } else if (btnValue === "add" || btnValue === "subtract") {
        //   calc.displayVal =
        //     calc.operator1 === "add"
        //       ? calc.add(calc.memory[0], calc.memory[1])
        //       : calc.subtract(calc.memory[0], calc.memory[1]);
        //   calc.memory.shift();
        //   calc.memory.push(calc.displayVal);
      } else calc.operator2 = btnValue;
    }

    if (button.id === "equals") {
      // the below currently only works for addition, no handling for orderOfOperations
      // the evaluationOrderOperations() will need to live somewhere in here
      calc.memory.push(calc.displayVal);
      evalOrderOperations();
      display;

      if (!calc.repeatEqual) {
        if (calc.operator1 === "add") {
          calc.memory.push(calc.displayVal);
          calc.displayVal = calc.add(calc.memory[0], calc.displayVal);
        }
        calc.repeatEqual = true;
        // calc.memory.shift();
        display.innerText = calc.displayVal;
      } else {
        if (calc.operator1 === "add") {
          calc.memory.push(calc.displayVal);
          calc.displayVal = calc.add(calc.memory[0], calc.memory[1]);
          calc.memory[1] = calc.displayVal;
          display.innerText = calc.displayVal;
        }
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
  });

  // add a display.innerText = calc.displayVal here in lieu of calls elsewhere, maybe?
});
