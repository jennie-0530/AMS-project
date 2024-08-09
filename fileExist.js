const fs = require("fs");
const path = "./ams.json";

const fileExist = function () {
  if (fs.existsSync(path)) {
    if (fs.readFileSync(path)) {
      return JSON.stringify("[]");
    }
  } else {
    return fs.writeFileSync(path, JSON.stringify([]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

module.exports = fileExist;

// TODO 함수는 한가지의 기능만 하게 하기
