const AccountRepository = require("./AccountRepository");
const Account = require("./Account");
const MinusAccount = require("./MinusAccount");
const readLine = require("./readline");
const initializeData = require("./initializeData");
const fs = require("fs");
const { createInterface } = require("readline");

const consoleInterface = createInterface({
  input: process.stdin,
});
let accountRepository = new AccountRepository();

const printMenu = function () {
  console.log(
    "--------------------------------------------------------------------",
  );
  console.log(
    "1.계좌등록 | 2.계좌목록 | 3.예금 | 4.출금 | 5.검색 | 6.삭제 | 7.종료",
  );
  console.log(
    "--------------------------------------------------------------------",
  );
};
const accountNumberPattern = /^\d{4}-\d{4}$/;
const passwordPattern = /^\d{4}$/;
const moneyPattern = /^\d+$/;
const ownerPattern = /^[A-Za-z가-힣]+$/;

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

  let accountNum = "";
  let password = "";
  let accountOwner = "";
  let initMoney = "";
  let rentMoney = "";

  // * 유효성 검사
  while (!accountNumberPattern.test(accountNum)) {
    accountNum = await readLine("- 계좌번호 (xxxx-xxxx) : ");
    if (!accountNumberPattern.test(accountNum)) {
      console.log(
        "계좌번호는 '1234-5678'과 같은 형식이어야 합니다. 다시 입력해주세요.",
      );
    }
  }

  while (!ownerPattern.test(accountOwner)) {
    accountOwner = await readLine("- 예금주명 : ");
    if (!ownerPattern.test(accountOwner)) {
      console.log("이름은 한글 또는 영어로만 입력해주세요.");
    }
  }

  while (!passwordPattern.test(password)) {
    password = parseInt(await readLine("- 비밀번호 : "));
    if (!passwordPattern.test(password)) {
      console.log(
        "비밀번호는 4자리 숫자 형식이어야 합니다. 다시 입력해주세요.",
      );
    }
  }

  if (num === 1) {
    // * 입출금 계좌
    while (!moneyPattern.test(initMoney)) {
      initMoney = parseInt(await readLine("- 입금액 (0 이상의 숫자) : "));
      if (!moneyPattern.test(initMoney)) {
        console.log("입금액은 0 이상의 숫자여야 합니다. 다시 입력해주세요.");
      }
    }
    account = new Account(accountNum, accountOwner, password, initMoney);
  } else if (num === 2) {
    // * 마이너스 계좌
    while (!moneyPattern.test(rentMoney)) {
      rentMoney = parseInt(await readLine("- 대출 금액 (0 이상의 숫자) : "));
      if (!moneyPattern.test(rentMoney)) {
        console.log("대출 금액은 0 이상의 숫자여야 합니다. 다시 입력해주세요.");
      }
    }
    account = new MinusAccount(accountNum, accountOwner, password, rentMoney);
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
  console.log(
    "--------------------------------------------------------------------",
  );
  console.log("계좌구분\t계좌번호\t예금주\t금액정보\t");
  console.log(
    "--------------------------------------------------------------------",
  );
  accounts.forEach((account) => {
    const type =
      account.rentMoney !== undefined ? "마이너스 계좌" : "입출금 계좌";

    if (type === "마이너스 계좌") {
      console.log(
        `${type}\t${account.number}\t${account.owner}\t대출금액: ${account.rentMoney}원`,
      );
    } else {
      console.log(
        `${type}\t${account.number}\t${account.owner}\t계좌잔액: ${account.balance}원`,
      );
    }
  });
};

// * 입금
const deposit = async function () {
  let inputNum = await readLine("- 계좌번호 : ");
  let inputMoney = parseInt(await readLine("- 입금액 : "));
  accountRepository.deposit(inputNum, inputMoney);
  let account = accountRepository.findByNumber(inputNum);
  let balance = accountRepository.getBalance(inputNum);

  if (inputNum instanceof Account) {
    console.log(
      `${inputMoney}원이 입금되었습니다. 현재 잔고는 ${balance}원입니다.`,
    );
  } else {
    if (account.rentMoney <= inputMoney) {
      let balance = inputMoney - account.rentMoney;
      account.rentMoney = 0;
      const newAccount = new Account(
        inputNum,
        account.owner,
        account.password,
        balance,
      );
      let index = accountRepository.accounts.findIndex(
        (account) => account.number === inputNum,
      );
      accountRepository.accounts[index] = newAccount;
      console.log(
        "대출금을 모두 상환하셨습니다. 마이너스 계좌에서 입출금 계좌로 변경됩니다.",
      );
    }
  }
  return account;
};

// * 출금
const withdraw = async function () {
  let outputNum = await readLine("- 계좌번호 : ");
  let outputMoney = parseInt(await readLine("- 출금액 : "));
  let outputPassword = parseInt(await readLine("- 비밀번호 : "));
  let statusCode = accountRepository.withdraw(
    outputNum,
    outputMoney,
    outputPassword,
  );
  let account = accountRepository.findByNumber(outputNum);
  let balance = account ? account.balance : null;

  switch (statusCode) {
    case "ACCOUNT_NOT_FOUND":
      console.log("입력하신 계좌를 찾을 수 없습니다.");
      break;
    case "INSUFFICIENT_BALANCE":
      console.log("잔액이 부족합니다.");
      break;
    case "INVALID_PASSWORD":
      console.log("비밀번호가 틀렸습니다.");
      break;

    case "EXCEED_LIMIT":
      console.log("대출 가능한 금액을 초과했습니다.");
      break;
    case "SUCCESS_LOAN":
      console.log();
      console.log(
        `대출이 승인되었습니다. 현재 대출 금액은 ${account.rentMoney}원입니다.`,
      );
      break;
    case "SUCCESS":
      console.log(
        `${outputMoney}원이 출금되었습니다. 현재 잔고는 ${balance}원입니다.`,
      );
      break;
  }
};

// * 계좌번호로 검색
const searchNum = async function () {
  let searchNum = await readLine("- 계좌번호 : ");
  let account = accountRepository.findByNumber(searchNum);
  if (!account) {
    console.log("입력하신 계좌를 찾을 수 없습니다.");
  } else {
    console.log(`계좌번호: ${account.number}`);
    console.log(`예금주: ${account.owner}`);
    account instanceof MinusAccount
      ? console.log(`대출금액: ${account.rentMoney}원`)
      : console.log(`잔액: ${account.balance}원`);
  }
};

// * 계좌 삭제
const deleteAccount = async function () {
  console.log("계좌 삭제");
  let deleteNum = await readLine("- 계좌번호 : ");
  let deletePassword = parseInt(await readLine("- 비밀번호 : "));
  let statusCode = accountRepository.deleteAccount(deleteNum, deletePassword);

  while (statusCode === "INVALID_PASSWORD") {
    console.log("비밀번호가 틀렸습니다. 다시 입력해주세요.");
    deletePassword = parseInt(await readLine("- 비밀번호 : "));
    statusCode = accountRepository.deleteAccount(deleteNum, deletePassword);
  }

  switch (statusCode) {
    case "ACCOUNT_NOT_FOUND":
      console.log("입력하신 계좌를 찾을 수 없습니다.");
      break;
    case "SUCCESS":
      console.log("계좌가 정상적으로 삭제되었습니다.");
      console.log("현재 계좌 목록");
      printAllAccounts();
  }
};

// * 어플리케이션 종료
const endApplication = function () {
  console.log(">>> 프로그램을 종료합니다.");
  consoleInterface.close();
  fs.writeFileSync("./ams.json", JSON.stringify(accountRepository.accounts));
};

const app = async function () {
  console.log(
    `====================================================================`,
  );
  console.log(
    `--------------     KOSTA 은행 계좌 관리 프로그램     ---------------`,
  );
  console.log(
    `====================================================================`,
  );

  const data = initializeData();
  if (data) {
    accountRepository.accounts = JSON.parse(data);
  }
  let running = true;

  while (running) {
    printMenu();

    let menuNum = parseInt(await readLine("> "));
    switch (menuNum) {
      case 1:
        await createAccount();
        break;
      case 2:
        await printAllAccounts();
        break;
      case 3:
        await deposit();
        break;
      case 4:
        await withdraw();
        break;
      case 5:
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
