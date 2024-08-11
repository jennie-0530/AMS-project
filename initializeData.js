const fs = require("fs");
const path = "./ams.json";

const fileExist = function () {
  return fs.existsSync(path);
};

const createFile = function () {
  return fs.writeFileSync(path, JSON.stringify([]), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const initializeData = function () {
  if (!fileExist()) {
    createFile();
    return JSON.stringify([]);
  } else {
    return fs.readFileSync(path);
  }
};

module.exports = initializeData;
