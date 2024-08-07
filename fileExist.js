const fs = require("fs");
const path = "./ams.json";

const fileExist = function () {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path);
  } else {
    return fs.writeFileSync(path, "", (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

module.exports = fileExist;
