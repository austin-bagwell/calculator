"use strict";
// clone of iPhone SE calculator (basic operations only)

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

    const onlyDigits = (displayStr) => {
      displayStr = displayStr.replace(".", "");
      displayStr = displayStr.replace("-", "");
      return displayStr;
    };

    // INPUT NUMBER VALUES AS STRINGS
    if (btnClass === "number-btn") {
      if (onlyDigits(calc.displayVal).length >= 9) {
        return;
      } else if (calc.displayVal === "-0" || calc.displayVal === "0") {
        calc.displayVal = calc.displayVal.replace("0", btnValue);
        display.innerText = calc.displayVal;
      } else {
        calc.displayVal = calc.displayVal.concat(btnValue);
        display.innerText = calc.displayVal;
      }
    }
    // OPERATIONS
    if (btnClass === "operator-btn") {
      if (!calc.operator1) {
        calc.memory.push(calc.displayVal);
        calc.operator1 = btnValue;
      } else if (calc.repeatedEqualPress) {
        calc.operator1 = btnValue;
        calc.memory[0] = display.innerText;
        calc.repeatedEqualPress = false;
        calc.operator2 = false;
        calc.storedVal = "";
      } else if (isHighOrderOperation(calc.operator1)) {
        calc.memory[0] = calc[`${calc.operator1}`](
          calc.memory[0],
          calc.displayVal
        );
        calc.operator1 = btnValue;
        display.innerText = calc.memory[0];
      } else if (
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
      } else if (
        !isHighOrderOperation(calc.operator1) &&
        isHighOrderOperation(btnValue) &&
        !calc.operator2
      ) {
        calc.operator2 = btnValue;
        calc.memory[1] = calc.displayVal;
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

    display.innerText === "0" && !calc.operator1
      ? (clearBtn.innerText = "AC")
      : (clearBtn.innerText = "C");

    if (
      Number(display.innerText > 999999999) ||
      Number(display.innerText < -999999999)
    ) {
      function expo(num) {
        return Number.parseFloat(num).toExponential();
      }
      display.innerText = expo(display.innerText).toString();
    } else if (onlyDigits(display.innerText).length >= 9) {
      display.innerText = expo(display.innerText).toString();
    }

    if (Number(display.innerText > 999) || Number(display.innerText < -999)) {
      display.innerText = display.innerText.replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        "$1,"
      );
    }
  });
});
