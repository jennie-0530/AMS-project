const Account = require("./Account");

class MinusAccount extends Account {
  constructor(number, owner, password, rentMoney) {
    super(number, owner, password);
    this.rentMoney = rentMoney;
  }
}

module.exports = MinusAccount;
