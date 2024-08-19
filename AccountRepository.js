/*
 * 은행 직원용 계좌 관리 애플리케이션
 * 작성자 : 김준경
 */

// TODO 마이너스 계좌에서 대출금 다 갚아도 계좌목록 출력하면 계좌구분이 입출금 계좌로 안변함

const Account = require("./Account");
const MinusAccount = require("./MinusAccount");

class AccountRepository {
  constructor() {
    this.accounts = []; // this.accounts가 프로퍼티 이름.
  }

  set accounts(accounts) {
    this._accounts = accounts;
  }
  get accounts() {
    return this._accounts;
  }

  addAccount(account) {
    if (this.accounts.indexOf(account) === -1) {
      this.accounts.push(account);
      return true;
      // new Account로 생성?
    }

    return false;
  }

  deposit(num, money) {
    const account = this.findByNumber(num);
    // * 마이너스 계좌
    if (account instanceof MinusAccount) {
      // num instanceof MinusAccount로 검사하는 게 아니라 account instanceof MinusAccount로 검사해야 함.
      // num은 계좌 번호를 나타내는 문자열이기 때문에 num으로 검사하면 결과는 항상 false일 수 밖에 없음 => 마이너스 통장의 대출잔액을 다 상환해도 입출금 계좌로 전환되지 않은 이유
      if (account.rentMoney) {
        return (account.rentMoney -= num);
      }
    } else if (account) {
      return (account.balance += money);
    } else return false;
  }

  withdraw(num, money, password) {
    let account = this.findByNumber(num);
    let limit = 3000000;

    if (!account) {
      return "ACCOUNT_NOT_FOUND";
    } else if (password !== account.password) {
      return "INVALID_PASSWORD";
    }

    if (account instanceof MinusAccount) {
      if (money > limit) {
        return "EXCEED_LIMIT";
      } else {
        limit -= money;
        account.rentMoney += money;
        let index = this.accounts.findIndex((acc) => acc.number === num);
        this.accounts[index] = account; // 업데이트된 account를 배열에 반영
        return "SUCCESS_LOAN";
      }
    } else if (account.balance < money) {
      return "INSUFFICIENT_BALANCE";
    } else {
      account.balance -= money;
      let index = this.accounts.findIndex((acc) => acc.number === num);
      this.accounts[index] = account;
      return "SUCCESS";
    }
  }
  deleteAccount(num, password) {
    let index = this.accounts.findIndex((account) => num === account.number);
    let account = this.findByNumber(num);
    if (index === -1) {
      return "ACCOUNT_NOT_FOUND";
    }

    if (password !== account.password) {
      return "INVALID_PASSWORD";
    }
    this.accounts.splice(index, 1);
    return "SUCCESS";
  }
  findByAll() {
    return [...this.accounts];
  }

  findByNumber(num) {
    let index = this.accounts.findIndex((account) => account.number === num);
    let account = this.accounts[index];
    // ! 어떤 클래스의 인스턴스인지 구분하고, 해당 클래스의 인스턴스로 생성해주는 작업
    if (!account) {
      return null; // 계좌를 찾지 못한 경우 null 반환
    }
    if (account.rentMoney !== undefined) {
      // 마이너스 계좌이면
      return new MinusAccount(
        account.number,
        account.owner,
        account.password,
        account.rentMoney,
      );
    } else {
      return new Account(
        account.number,
        account.owner,
        account.password,
        account.balance,
      );
    }
  }

  findByName(name) {
    return this.accounts.find((account) => account.owner === name);
  }

  getBalance(num) {
    const account = this.findByNumber(num);
    try {
      if (account) {
        return account.balance;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  getTotal() {
    let total = this.accounts.reduce(
      (prev, account) => prev + account.balance,
      0,
    );
    return total;
  }

  getMax() {
    let max = this.accounts.reduce(
      (prev, account) => (prev > account.balance ? prev : account.balance),
      this.accounts[0].balance,
    );
    return max;
  }

  getMin() {
    let min = this.accounts.reduce(
      (prev, account) => (prev < account.balance ? prev : account.balance),
      this.accounts[0].balance,
    );
    return min;
  }

  rangeSearch(num1, num2) {
    let balance = this.accounts.filter(
      (account) => account.balance >= num1 && account.balance <= num2,
    );
    return balance;
  }

  updateName(name1, name2) {
    let result = this.accounts.find((account) => name1 === account.owner);
    result.owner = name2;
    return result;
  }
}

module.exports = AccountRepository;
