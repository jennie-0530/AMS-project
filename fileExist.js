// TODO : fs모듈을 활용하여 ams.json 파일의 존재 여부 검사
// TODO : 파일 O => json 파일에 저장되어 있는 계좌 목록 정보(문자열)를 읽어와서 accountRepository의 배열에 초기화
// TODO : 파일 X => ams.json 빈 파일 생성하기
const fs = require("fs");
const constants = require("fs").constants;
// const data = require("./ams.json"); => import 방식으로 json 파일을 가져오면 json 파일이 없는 경우 에러 생김
const AccountRepository = require("./AccountRepository");

// ! "./ams.json" => 상수로 저장하기

const fileExist = function () {
  let list = null;

  if (fs.existsSync("./ams.json")) {
    // fs.readFile("./ams.json", (error, data) => {
    //   if (error) throw error;
    //   // console.log(data.toString());
    //   list = data.toString();
    // });
    return fs.readFileSync("./ams.json");
  }

  // fs.access(
  //   "./ams.json",
  //   constants.F_OK | constants.W_OK | constants.R_OK,
  //   (result) => {
  //     fs.readFile("./ams.json", (error, data) => {
  //       if (error) throw error;
  //       console.log(data.toString());
  //       list = data.toString();
  //     });
  //   }
  // );

  // console.log(list);

  return list;
};
// const fileExist = function () {
//   return fs
//     .access("./ams.json", constants.F_OK | constants.W_OK | constants.R_OK)
//     .then(() => {
//       console.log("파일이 존재합니다.");
//       // // json 파일 읽어오기
//       fs.readFile("./ams.json").then((err, data) => {
//         console.log("헐");
//         if (err) {
//           throw err;
//         }
//         console.log(data);
//         console.log(data.toString());
//       });
//     })
//     .catch(() => {
//       console.log("파일이 존재하지 않습니다.");
//       return fs.writeFile("./ams.json", "", (err) => {
//         if (err) {
//           console.log(err);
//         } else console.log(" 새로운 파일을 생성합니다.");
//       });
//     });
// };

module.exports = fileExist;

/* ams.json
[
  { "number": "123-456", "owner": "강쥐", "password": 1234, "balance": 20000 },
  { "number": "2222", "owner": "고영", "password": 2222, "balance": 30000 },
  { "number": "3333", "owner": "토끼", "password": 3788, "balance": 40000 }
]

*/
