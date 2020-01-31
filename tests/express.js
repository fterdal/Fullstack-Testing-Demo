/* eslint-env mocha */
import { expect } from "chai"

const app = require("express")()
app.get("/hello", (req, res) => {
  res.json(["Hello"])
})

const supertest = require("supertest-as-promised")(app)

describe("Express", () => {
  it("says hello", () => {
    return supertest
      .get("/hello")
      .expect(200)
      .expect(res => {
        expect(res.body).to.deep.equal(["Hello"])
      })
  })
})
