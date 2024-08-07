/*
 * 은행 직원용 계좌 관리 애플리케이션
 * 작성자 : 김준경
 */

class AccountRepository {
  constructor() {
    this.accounts = []; // this.accounts가 프로퍼티 이름.
  }

  // ^ setter / getter
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
    let index = this.accounts.findIndex((account) => account.number === num);
    if (index !== -1) {
      return (this.accounts[index].balance += money);
    } else return false;
  }

  withdraw(num, money, password) {
    let index = this.accounts.findIndex((account) => account.number === num);
    if (index !== -1) {
      if (password === this.accounts[index].password) {
        if (this.accounts[index].balance >= money) {
          return (this.accounts[index].balance -= money);
        } else throw new AccountError(200, "잔액이 부족합니다.");
      } else throw new AccountError(300, "비밀번호가 틀렸습니다.");
    } else return false;
  }

  findByAll() {
    return [...this.accounts];
    // * 외부 배열에서 원본 배열에 접근하는 것은 위험하므로 배열의 복사본을 반환해주자.
  }

  findByNumber(number) {
    return this.accounts.find((account) => account.number === number);
  }

  findByName(name) {
    return this.accounts.find((account) => account.owner === name);
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
      0
    ); // 최댓값을 가진 계좌가 마이너스 계좌일 수도 있는데 0으로 초기화해도 되나?
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

  deleteAccount(number) {
    let index = this.accounts.findIndex((account) => number === account.number);
    if (index != -1) {
      return this.accounts.splice(index, 1);
    }
    return null;
  }
}

module.exports = AccountRepository;
