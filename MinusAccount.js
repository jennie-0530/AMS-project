const Account = require("./Account");

class MinusAccount extends Account {
  constructor(number, owner, password, rentMoney, balance) {
    super(number, owner, password, balance);
    this.rentMoney = rentMoney;
  }
}

module.exports = MinusAccount;
