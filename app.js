const AccountRepository = require("./AccountRepository");
const Account = require("./Account");
const MinusAccount = require("./MinusAccount");
const readLine = require("./readline");
const fileExist = require("./fileExist");
const fs = require("fs");
const { createInterface } = require("readline");

const consoleInterface = createInterface({
  input: process.stdin,
});
let accountRepository = new AccountRepository();

// 메뉴 출력
const printMenu = function () {
  console.log(
    "--------------------------------------------------------------------"
  );
  console.log(
    "1.계좌등록 | 2.계좌목록 | 3.예금 | 4.출금 | 5.검색 | 6.삭제 | 7.종료"
  );
  console.log(
    "--------------------------------------------------------------------"
  );
};

// * 계좌 등록
const createAccount = async function () {
  console.log("■ 등록 계좌 종류 선택");
  const header =
    "--------------------------------\n" +
    "1. 입출금계좌 | 2. 마이너스 계좌\n" +
    "--------------------------------";
  console.log(header);

  let account = null;
  let num = parseInt(await readLine("> "));
  let accountNum = await readLine("- 계좌번호 : ");
  let accountOwner = await readLine("- 예금주명 : ");
  let password = parseInt(await readLine("- 비밀번호 : "));
  let initMoney = parseInt(await readLine("- 입금액 : "));
  let rentMoney = 0;
  if (num === 1) {
    // * 입출력 계좌
    account = new Account(accountNum, accountOwner, password, initMoney);
  } else {
    // * 마이너스 계좌
    rentMoney = parseInt(await readLine("- 대출금액 : "));
    account = new MinusAccount(
      accountNum,
      accountOwner,
      password,
      initMoney,
      rentMoney
    );
  }
  console.log(accountNum, accountOwner, password, initMoney, rentMoney);
  accountRepository.addAccount(account);

  console.log("신규 계좌 등록 결과 메시지 출력");
};

// * 계좌 목록 출력
const printAllAccounts = async function () {
  console.log("-------------------------------------------------------");
  console.log("계좌구분 \t 계좌번호 \t 예금주 \t 잔액");
  console.log("-------------------------------------------------------");
  console.log(accountRepository.findByAll());
};

// * 입금
const deposit = async function () {
  let inputNum = await readLine("- 계좌번호 : ");
  let inputMoney = parseInt(await readLine("- 입금액 : "));
  console.log(accountRepository.deposit(inputNum, inputMoney));
};

// * 출금
const withdraw = async function () {
  let outputNum = await readLine("- 계좌번호 : ");
  let outputMoney = parseInt(await readLine("- 출금액 : "));
  let outputPassword = parseInt(await readLine("- 비밀번호 : "));
  accountRepository.withdraw(outputNum, outputMoney, outputPassword);
};

// * 계좌번호로 검색
const searchNum = async function () {
  let searchNum = await readLine("- 계좌번호 : ");
  console.log(searchNum);
  console.log("검색 결과 출력");
  console.log(accountRepository.findByNumber(searchNum));
};

// * 계좌 삭제
const deleteAccount = async function () {
  console.log("계좌 삭제");
  // 계좌 번호 입력 받아 계좌 해당 계좌 삭제
  let deleteNum = await readLine("- 계좌번호 : ");
  accountRepository.deleteAccount(deleteNum);
  console.log("삭제 이후 결과 출력");
  console.log(accountRepository.findByAll());
};

// * 어플리케이션 종료
const endApplication = function () {
  console.log(">>> 프로그램을 종료합니다.");
  consoleInterface.close();
  running = false;
  fs.writeFileSync("./ams.json", JSON.stringify(accountRepository.accounts));
};

const app = async function () {
  console.log(
    `====================================================================`
  );
  console.log(
    `--------------     KOSTA 은행 계좌 관리 프로그램     ---------------`
  );
  console.log(
    `====================================================================`
  );

  let running = true;

  const data = fileExist();
  if (data) {
    accountRepository.accounts = JSON.parse(data.toString());
  }

  while (running) {
    printMenu();

    let menuNum = parseInt(await readLine("> "));
    switch (menuNum) {
      case 1:
        await createAccount(); // ! case에 있는 코드들을 함수로 정의한 후 외부에서 호출한 것일 뿐인데 왜 await 키워드를 붙여야함?
        break;
      case 2: // 전체계좌 목록 출력
        await printAllAccounts();
        break;
      case 3: // 입금
        await deposit();
        break;
      case 4: // 출금
        await withdraw();
        break;
      case 5: // 계좌번호로 검색
        await searchNum();
        break;
      case 6:
        await deleteAccount();
        break;
      case 7:
        await endApplication();
        break;
      default:
        console.log("잘못 선택하셨습니다.");
    }
  }
};

app();
