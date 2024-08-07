const { createInterface } = require("readline");

const consoleInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readLine = function (message) {
  return new Promise((resolve) => {
    consoleInterface.question(message, (userInput) => {
      resolve(userInput);
    });
  });
};

module.exports = readLine;
