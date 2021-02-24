import { parseCommand } from "../command"

it("edge and fill", () => {
  console.log(parseCommand("circle 0 0 0 2 stone grass"));
})

it("only edge", () => {
  console.log(parseCommand("circle 0 0 0 2 stone"));
})