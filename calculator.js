let firstOperand = 0;
let secondOperand = 0;
let operationName;

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
}

async function loadContract() {
  return await new window.web3.eth.Contract(
    [
      {
        constant: false,
        inputs: [
          {
            name: "x",
            type: "int256",
          },
          {
            name: "y",
            type: "int256",
          },
        ],
        name: "div",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            name: "x",
            type: "int256",
          },
          {
            name: "y",
            type: "int256",
          },
        ],
        name: "sub",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            name: "x",
            type: "int256",
          },
          {
            name: "y",
            type: "int256",
          },
        ],
        name: "addition",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            name: "x",
            type: "int256",
          },
          {
            name: "y",
            type: "int256",
          },
        ],
        name: "mult",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getResult",
        outputs: [
          {
            name: "",
            type: "int256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
    ],
    "0x0A8A372bCADBe40785dd7E2D8bBbDC09aA636DD4"
  );
}

async function printResult() {
  const coolNumber = await window.contract.methods.getResult().call();
  updateStatus(`Result: ${coolNumber}`);
}

async function getCurrentAccount() {
  const accounts = await window.web3.eth.getAccounts();
  return accounts[0];
}

async function eval() {
  if (operationName && secondOperand && firstOperand) {
    const account = await getCurrentAccount();
    updateStatus("calculating...");
    console.log({ operationName, firstOperand, secondOperand });
    await window.contract.methods[operationName](firstOperand, secondOperand)
      .send({ from: account });
    await printResult();
  } else {
    operationName = null;
    firstOperand = 0;
    secondOperand = 0;
    alert('Incorrect input. Ask something simple like 2+2')
  }
}

async function load() {
  await loadWeb3();
  window.contract = await loadContract();
  updateStatus("Ready!");
}

function updateStatus(status) {
  const statusEl = document.querySelector(".screen");
  statusEl.innerHTML = status;
  console.log(status);
}

load();

// Get all the keys from document
var keys = document.querySelectorAll("#calculator span");
var operators = ["+", "-", "x", "÷"];
var operatorsMap = {"+": "addition", "-": "sub", "x": "mult", "÷": "div"};
var decimalAdded = false;

// Add onclick event to all the keys and perform operations
for (var i = 0; i < keys.length; i++) {
  keys[i].onclick = function (e) {
    // Get the input and button values
    var input = document.querySelector(".screen");
    var inputVal = input.innerHTML;
    var btnVal = this.innerHTML;
    if (inputVal == 'Ready!') {
      inputVal = '';
      input.innerHTML = '';
    }


    // Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
    // If clear key is pressed, erase everything
    if (btnVal == "C") {
      input.innerHTML = "";
      decimalAdded = false;
    }

    // If eval key is pressed, calculate and display the result
    else if (btnVal == "=") {
      eval();
      decimalAdded = false;
    }

    // Basic functionality of the calculator is complete. But there are some problems like
    // 1. No two operators should be added consecutively.
    // 2. The equation shouldn't start from an operator except minus
    // 3. not more than 1 decimal should be there in a number

    // We'll fix these issues using some simple checks

    // indexOf works only in IE9+
    else if (operators.indexOf(btnVal) > -1) {
      // Operator is clicked
      // Get the last character from the equation
      var lastChar = inputVal[inputVal.length - 1];

      // Only add operator if input is not empty and there is no operator at the last
      if (inputVal != "" && operators.indexOf(lastChar) == -1)
        input.innerHTML += btnVal;
      // Allow minus if the string is empty
      else if (inputVal == "" && btnVal == "-") input.innerHTML += btnVal;

      // Replace the last operator (if exists) with the newly pressed operator
      if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
        // Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
        input.innerHTML = inputVal.replace(/.$/, btnVal);
      }
      operationName = operatorsMap[btnVal];

      decimalAdded = false;
    }

    // Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
    else if (btnVal == ".") {
      if (!decimalAdded) {
        input.innerHTML += btnVal;
        decimalAdded = true;
      }
    }

    // if any other key is pressed, just append it
    else {
      if (!firstOperand) {
        firstOperand = +btnVal;
      } else if (operationName) {
        secondOperand = +btnVal;
      } else {
        firstOperand = +(inputVal + btnVal);
      }
      input.innerHTML += btnVal;
    }

    // prevent page jumps
    e.preventDefault();
  };
}
