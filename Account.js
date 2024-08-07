class Account {
  constructor(number, owner, password, balance) {
    this.number = number;
    this.owner = owner;
    this.password = password;
    this.balance = balance;
  }
  toString() {
    return `${this.number}\t${this.owner}\t${this.balance}`;
  }
}

module.exports = Account;
