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
  let num = 0;

  // 계좌 종류가 유효할 때까지 반복
  while (num !== 1 && num !== 2) {
    num = parseInt(await readLine("> "));

    if (num !== 1 && num !== 2) {
      console.log("잘못된 선택입니다. 다시 입력해 주세요.");
      console.log(header);
    }
  }

  let accountNum = await readLine("- 계좌번호 : ");
  let accountOwner = await readLine("- 예금주명 : ");
  let password = parseInt(await readLine("- 비밀번호 : "));
  let initMoney = parseInt(await readLine("- 입금액 : "));
  let rentMoney = 0;

  if (num === 1) {
    // * 입출금 계좌
    account = new Account(accountNum, accountOwner, password, initMoney);
  } else if (num === 2) {
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
  accountRepository.addAccount(account);
  console.log("계좌가 등록되었습니다.");
};

// * 계좌 목록 출력
const printAllAccounts = function () {
  const accounts = accountRepository.findByAll();
  if (accounts.length === 0) {
    console.log("등록된 계좌가 없습니다.");
    return;
  }
  console.log("-------------------------------------------------------");
  console.log("계좌구분 \t 계좌번호 \t 예금주 \t 잔액");
  console.log("-------------------------------------------------------");
  accounts.forEach((account) => {
    const type =
      account instanceof MinusAccount ? "마이너스 계좌" : "입출금 계좌";
    console.log(
      `${type} \t ${account.number} \t ${account.owner} \t ${account.balance}`
    );
  });
};

// * 입금

const deposit = async function () {
  let inputNum = await readLine("- 계좌번호 : ");
  let inputMoney = parseInt(await readLine("- 입금액 : "));
  accountRepository.deposit(inputNum, inputMoney);
  let balance = accountRepository.getBalance(inputNum);
  console.log(
    `${inputNum}원이 입금되었습니다. 현재 잔고는 ${balance}원입니다.`
  );
};

// * 출금
const withdraw = async function () {
  let outputNum = await readLine("- 계좌번호 : ");
  let outputMoney = parseInt(await readLine("- 출금액 : "));
  let outputPassword = parseInt(await readLine("- 비밀번호 : "));
  let result = accountRepository.withdraw(
    outputNum,
    outputMoney,
    outputPassword
  );
  console.log(`${result}원이 출금되었습니다.`);
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
  printAllAccounts();
};

// * 어플리케이션 종료
const endApplication = function () {
  console.log(">>> 프로그램을 종료합니다.");
  consoleInterface.close();
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

  const data = fileExist();
  if (data) {
    accountRepository.accounts = JSON.parse(data.toString());
  }
  let running = true;

  while (running) {
    printMenu();

    let menuNum = parseInt(await readLine("> "));
    switch (menuNum) {
      case 1:
        await createAccount();
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
        endApplication();
        break;
      default:
        console.log("잘못 선택하셨습니다.");
    }
  }
};

app();
