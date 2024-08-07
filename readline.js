//  Node의 표준내장모듈(readline) 활용하여 키보드 입력 받기

// readline 표준 내장 모듈은 한 번에 한 줄씩 process.stdin 스트림에서
// 데이터를 읽기 위한 인터페이스를 만들 수 있는 기능을 제공한다.

// 키보드 입력을 위한 인터페이스 생성
const { createInterface } = require("readline");

const consoleInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 키보드 입력 받기, async함수를 사용하기 위해 promise를 반환하게 함.

const readLine = function (message) {
  // message : 화면에 보여줄 메세지
  return new Promise((resolve) => {
    consoleInterface.question(message, (userInput) => {
      resolve(userInput); //사용자로부터 입력받은 정보를 resolve에 담는다.
    });
  });
};

module.exports = readLine;
