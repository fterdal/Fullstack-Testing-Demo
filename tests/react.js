/* eslint-env mocha */
import React from "react"
import { expect } from "chai"
import { mount, shallow } from "enzyme"
import axios from "axios"
import waitForExpect from "wait-for-expect"
import { mockAxios } from "./setup"

class SinglePokemon extends React.Component {
  constructor() {
    super()
    this.fetchPokemon = this.fetchPokemon.bind(this)
    this.state = {
      name: "",
      types: [],
      error: null
    }
    // console.log("CONSTRUCTOR")
  }
  componentDidMount() {
    // console.log("COMPONENT DID MOUNT")
    this.fetchPokemon()
  }
  async fetchPokemon() {
    try {
      const { id } = this.props
      const { data } = await axios.get(`/api/pokemon/${id}`)
      // console.log("DATA", data)
      this.setState({
        name: data.name,
        types: data.types
      })
    } catch (err) {
      this.setState({
        error: err
      })
    }
  }
  render() {
    // console.log("RENDER")
    const { error, name, types } = this.state
    // console.log("this.state:", this.state)
    if (error) return <div>Error!</div>
    return (
      <div>
        {error ? (
          "Error"
        ) : (
          <>
            <div>{name}</div>
            <div>Types:</div>
            <ul>
              {types.map(type => {
                return <li key={type}>{type}</li>
              })}
            </ul>
          </>
        )}
      </div>
    )
  }
}

describe.only("React", () => {
  afterEach(() => {
    console.log("RESTORING MOCK AXIOS")
    mockAxios.restore()
  })

  describe("SinglePokemon", () => {
    it("renders pokemon name and types from props", async () => {
      mockAxios.onGet("/api/pokemon/131").reply(200, {
        name: "Lapras",
        types: ["water", "ice"]
      })

      const laprasId = 131
      const wrapper = mount(<SinglePokemon id={laprasId} />)
      await waitForExpect(() => {
        expect(wrapper.html()).to.include("Lapras")
        expect(wrapper.html()).to.include("ice")
        expect(wrapper.html()).to.include("water")
      })
    })

    it("ACTUALLY renders pokemon name and types from props", async () => {
      mockAxios.onGet("/api/pokemon/39").reply(200, {
        name: "Jigglypuff",
        types: ["normal", "fairy"]
      })
      const jigglypuffId = 39
      const wrapper = mount(<SinglePokemon id={jigglypuffId} />)
      await waitForExpect(() => {
        expect(wrapper.html()).to.include("Jigglypuff")
        expect(wrapper.html()).to.include("normal")
        expect(wrapper.html()).to.include("fairy")
        expect(wrapper.html()).to.not.include("water")
      })
    })

    it("responds to errors well", async () => {
      mockAxios.onGet("/api/pokemon/74").reply(500)
      const geodudeId = 74
      const wrapper = mount(<SinglePokemon id={geodudeId} />)
      await waitForExpect(() => {
        expect(wrapper.html()).to.include("Error")
        expect(wrapper.html()).to.not.include("Jigglypuff")
      })
    })
  })
})
