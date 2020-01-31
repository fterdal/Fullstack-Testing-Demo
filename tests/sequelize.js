/* eslint-env mocha */
import { expect } from "chai"

const promiseMath = (num1, num2) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num1 + num2)
    }, 100)
  })
}

describe("Sequelize", () => {

  // using chai-as-promised
  it("do some math", () => {
    expect(promiseMath(3, 5)).to.eventually.equal(8)
  })
})
