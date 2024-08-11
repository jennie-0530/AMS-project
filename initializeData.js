const fs = require("fs");
const path = "./ams.json";

// TODO 함수는 한가지의 기능만 하게 하기
/*1. 파일의 존재 여부 
  2. 파일이 없을 때 빈 배열로 초기화된 JSON 파일 생성 
  3. 파일 읽어오는 함수
  4. 프로그램 시작시, 파일이 존재하지 않으면 생성, 존재하면 파일의 내용을 읽어서 반환해줌
*/
// 원래 코드
// const fileExist = function () {
//   if (fs.existsSync(path)) {
//     if (fs.readFileSync(path)) {
//       return JSON.stringify("[]");
//     }
//   } else {
//     return fs.writeFileSync(path, JSON.stringify([]), (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   }
// };

// 1. 파일 존재 여부
const fileExist = function () {
  return fs.existsSync(path);
};

// 2. 파일 없으면 JSON 파일 생성
const createFile = function () {
  return fs.writeFileSync(path, JSON.stringify([]), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

// 3. 프로그램 시작
const initializeData = function () {
  if (!fileExist()) {
    createFile();
    return JSON.stringify([]);
  } else {
    return fs.readFileSync(path);
  }
};

module.exports = initializeData;
