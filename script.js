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
  currentVal: 0,
  previousVal: 0,
  function: false,
  // will need these for correct order of operations
  operator1: false,
  operator2: false,

  decimal: false,

  // METHODS
  inputInt(val) {
    this.currentVal =
      this.currentVal >= 0
        ? this.currentVal * 10 + Number(val)
        : this.currentVal * 10 + -Number(val);
  },
  clear() {
    this.currentVal = 0;
    this.decimal = false;
    // maybe reset function?
    // this.function = false;
    display.innerText = 0;
  },

  allClear() {
    this.currentVal = 0;
    this.previousVal = 0;
    this.decimal = false;
    this.function = false;
    display.innerText = 0;
  },
  sign() {
    // not quite matching iPhone functionality here -- I want sign() > -0 > -x
    // this.currentVal != 0
    //   ? (this.currentVal = -this.currentVal)
    //   : (this.currentVal = String("-0"));
    this.currentVal = -this.currentVal;
    display.innerText = String(this.currentVal);
  },
  // need to do some rounding to account for weird JS number issues
  percentage() {
    this.currentVal = Number(this.currentVal) / 100;
  },
  add() {
    this.currentVal = Number(this.currentVal);
    this.previousVal = Number(this.previousVal);
    this.currentVal += this.previousVal;
  },
  subtract() {
    this.currentVal = Number(this.currentVal);
    this.previousVal = Number(this.previousVal);
    this.currentVal = this.previousVal - this.currentVal;
  },
  multiply() {
    this.currentVal = Number(this.currentVal);
    this.previousVal = Number(this.previousVal);
    this.currentVal *= this.previousVal;
  },
  divide() {
    this.currentVal = Number(this.currentVal);
    this.previousVal = Number(this.previousVal);
    this.currentVal = this.previousVal / this.currentVal;
  },
};

display.innerText = "0";

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.value;
    const btnClass = button.className;

    if (btnClass === "number-btn") {
      if (!calc.decimal) {
        calc.inputInt(value);
        display.innerText = calc.currentVal;
        calc.currentVal = Number(calc.currentVal);
      } else {
        calc.currentVal = calc.currentVal.concat(value);
        display.innerText = calc.currentVal;
        // calc.currentVal = Number(calc.currentVal);
      }
    }

    // how to dynamically call methods using btn.value?
    if (btnClass === "function-btn") {
      calc.function = value;
      calc.previousVal = Number(calc.currentVal);
      calc.currentVal = 0;
      calc.decimal = false;
    }

    if (button.id === "equals") {
      if (calc.function === "add") {
        calc.add();
      } else if (calc.function === "subtract") {
        calc.subtract();
      } else if (calc.function === "multiply") {
        calc.multiply();
      } else if (calc.function === "divide") {
        calc.divide();
      }
      display.innerText = calc.currentVal;
      calc.decimal = false;
    }

    // FUNTIONS
    if (button.id === "clear") {
      calc.currentVal == 0 ? calc.allClear() : calc.clear();
    }
    if (button.id === "sign") {
      calc.sign();
    }
    if (button.id === "percent") {
      calc.percentage();
      display.innerText = calc.currentVal;
    }
    if (button.id === "decimal" && calc.decimal === false) {
      calc.currentVal += ".";
      calc.decimal = true;
      display.innerText = calc.currentVal;
    }

    // not quite right, here's what I want: after "1 + 3" > Clear, btn = AC display = 0 "+" button has hover effect to show that is the previously selected operation
    calc.currentVal == 0 && !calc.function
      ? (clearBtn.innerText = "AC")
      : (clearBtn.innerText = "C");
  });
});
