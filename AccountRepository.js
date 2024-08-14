/*
 * 은행 직원용 계좌 관리 애플리케이션
 * 작성자 : 김준경
 */

// TODO 마이너스 계좌에서 대출금 다 갚아도 계좌목록 출력하면 계좌구분이 입출금 계좌로 안변함
// TODO AccountRepository에 모든 메소드 다 정의하는 것보다는 Account 클래스에 정의한 후, MinusAccount에서 상속받아 사용?

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
    }

    return false;
  }

  deposit(num, money) {
    const account = this.findByNumber(num);
    // * 마이너스 계좌
    if (num instanceof MinusAccount) {
      if (account.rentMoney) {
        return (account.rentMoney -= num);
      }
    } else if (account) {
      return (account.balance += money);
    } else return false;
  }

  withdraw(num, money, password) {
    const account = this.findByNumber(num);

    if (!account) {
      return "ACCOUNT_NOT_FOUND";
    }
    if (account.balance < money) {
      return "INSUFFICIENT_BALANCE";
    }
    if (password !== account.password) {
      return "INVALID_PASSWORD";
    }
    account.balance -= money;
    return "SUCCESS";
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
    return this.accounts[index];
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
      0
    );
    return total;
  }

  getMax() {
    let max = this.accounts.reduce(
      (prev, account) => (prev > account.balance ? prev : account.balance),
      this.accounts[0].balance
    );
    return max;
  }

  getMin() {
    let min = this.accounts.reduce(
      (prev, account) => (prev < account.balance ? prev : account.balance),
      this.accounts[0].balance
    );
    return min;
  }

  rangeSearch(num1, num2) {
    let balance = this.accounts.filter(
      (account) => account.balance >= num1 && account.balance <= num2
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
