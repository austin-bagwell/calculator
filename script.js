"use strict";
// clone of iPhone SE calculator (basic operations only)
// TODO
// FIXME guess I need to add another operand to account for order of operations
// decimal is non functional
// add the responsive Clear/All Clear button as seen on iPhone
// HTML/CSS needs a major revamp
// refactor JS for cleaner code
// add handling for keyboard entry ?(if(keypress is in [keyboard, events, in, array] do the operation at the index that matches the key event...something like that)

let display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

const calc = {
  // STATE
  currentVal: 0,
  previousVal: 0,
  function: false,
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
    this.previousVal = 0;
    this.decimal = false;
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
    this.currentVal += Number(this.previousVal);
  },
  subtract() {
    this.currentVal = Number(this.previousVal) - Number(this.currentVal);
  },
  multiply() {
    this.currentVal *= Number(this.previousVal);
  },
  divide() {
    this.currentVal = Number(this.previousVal) / Number(this.currentVal);
  },
};

display.innerText = "0";

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.value;
    const btnClass = button.className;

    if (button.id === "decimal" && calc.decimal === false) {
      calc.currentVal += ".";
      calc.decimal = true;
      display.innerText = calc.currentVal;
    }

    if (button.id === "percent") {
      calc.percentage();
      display.innerText = calc.currentVal;
    }

    if (btnClass === "number-btn") {
      if (!calc.decimal) {
        calc.inputInt(value);
        display.innerText = calc.currentVal;
      } else {
        calc.currentVal = calc.currentVal.concat(value);
        display.innerText = calc.currentVal;
      }
    }

    // how to dynamically call methods using btn.value?
    if (btnClass === "function-btn") {
      calc.function = value;
      calc.previousVal = calc.currentVal;
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
    }

    if (button.id === "sign") {
      calc.sign();
    }

    if (button.id === "clear") {
      calc.clear();
    }
  });
});
