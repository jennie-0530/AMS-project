const Account = require("./Account");

class MinusAccount extends Account {
  constructor(number, owner, password, balance, debt) {
    super(number, owner, password, balance);
    this.debt = debt;
  }
}

module.exports = MinusAccount;
