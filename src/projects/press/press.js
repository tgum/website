fetch("/projects/press/stories/fire_owl.story")
  .then(r=>r.text())
  .then(r=>{
    parse_story(r)
    run_story()
  })

let rooms = {}
function parse_story(story) {
  let current_room = ""
  for (let line of story.split("\n")) {
    if (line.startsWith("== ")) {
      current_room = line.slice(3)
      rooms[current_room] = ""
    } else {
      rooms[current_room] += line + "\n"
    }
  }
  console.log(rooms)
}

let gameelt = document.querySelector("#game")

let variables = {knife: true}
let current_room = "Man"
function run_story() {
  let exits = []
  let output = ""
  for (let line of rooms[current_room].split("\n")) {
    switch (line[0]) {
      case ";":
        break
      case "\\":
        output += line.slice(1)
        break
      case "?":
      case "!":
        let varname = line.slice(1).split(" ")[0]
        if ((line[0]=="?"&&variables[varname])||(line[0]=="!"&&!variables[varname])) {
          line = line.slice(line.indexOf(" ")+1)
        } else {
          continue
        }
        break
    }
    switch (line[0]) {
      case "\\":
        output += line.slice(1)
        break
      case "+":
      case "-":
        variables[line.slice(1)] = line[0] == "+"
        break
      case "[":
        let closeIndex = line.indexOf("]")
        exits.push({dest: line.slice(1, closeIndex), text: line.slice(closeIndex+2)})
        break
      default:
        output += line
    }
    output += "\n"
  }
  console.log(exits)
  gameelt.innerText = output
  for (let exit of exits) {
    
  }
}
