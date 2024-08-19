/*
 * 은행 직원용 계좌 관리 애플리케이션
 * 작성자 : 김준경
 */

const Account = require("./Account");
const MinusAccount = require("./MinusAccount");

class AccountRepository {
  constructor() {
    this.accounts = [];
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
    if (account instanceof MinusAccount) {
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
        this.accounts[index] = account;
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
    if (!account) {
      return null;
    }
    if (account.rentMoney !== undefined) {
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
}

module.exports = AccountRepository;
