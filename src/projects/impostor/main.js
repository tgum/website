let newstate = () => createState({
    state: "loading",
    players: [],
    impostors: [],
    eliminated: [],
    word: "",
    showIndex: 0,
    timeleft: 0
})
let state = newstate()

let words = []
fetch("words.txt")
    .then(r => r.text())
    .then(r => {
        words = r.trim().split("\n")
        state.state = "menu"
    })

function startgame() {
    state.players = $("#players").value.trim().split("\n")
    state.word = randomchoice(words)

    numimpostors = +$("#numimpostors").value.trim()
    while (state.impostors.length < numimpostors) {
        let nextimpostor = random(state.players.length)
        if (!state.impostors.includes(nextimpostor)) {
            state.impostors.push(nextimpostor)
        }
    }
    console.log((state.impostors))

    localStorage.setItem("impostor-names", $("#players").value.trim())
    localStorage.setItem("impostor-impostors", numimpostors)

    state.state = "showword"
}

function Loading() {
    let text = h1("Loading")
    setInterval(() => text.textContent += ".", 100)
    return text
}

function Menu() {
    return div(
        h1("Setup game"),
        textarea({
            id: "players",
            rows: 8,
        }, localStorage.getItem("impostor-names") || ""),
        label("Number of impostors: ", 
            input({
                id: "numimpostors",
                type: "number",
                oninput: e => {
                    let t = e.target
                    let numplayers = $("#players").value.trim().split("\n").length
                    if (+t.value.trim() > numplayers) {
                        t.value = numplayers
                    }
                    if (+t.value.trim() < 1) {
                        t.value = 1
                    }
                },
                value: localStorage.getItem("impostor-impostors") || 1,
            })
        ),
        button({
            onclick: startgame
        }, "start game"),
        button({
            onclick: () => {
                let players = $("#players").value.trim().split("\n")
                let newplayers = []
                let numplayers = players.length
                for (let i = 0; i < numplayers; i++) {
                    let index = random(players.length)
                    newplayers.push(players[index])
                    players.splice(index, 1)
                }
                $("#players").value = newplayers.join("\n")
            }
        }, "shuffle names")
    )
}

function WordToShow() {
    let isImpostor = state.impostors.includes(state.showIndex)
    return div(
        h1(state.players[state.showIndex]),
        h2({
            style: {
                opacity: 0,
                transition: "0.1s ease-in-out",
            },
            className: "word",
            id: isImpostor ? "impostor" : ""
        }, isImpostor ? "You're the impostor >:D" : state.word)
    )
}
function ShowWord() {
    state.showIndex = 0
    let view = div(
        WordToShow(),
    )

    state.addUpdate("showIndex", () => {
        view.innerHTML = ""
        view.append(WordToShow())
    })

    return div(
        view,
        button(
            {
                oncontextmenu: () => {return false},
                onmousedown: () => {
                    $(".word").style.opacity = 1
                },
                onmouseup: () => {
                    $(".word").style.opacity = 0
                },
                ontouchstart: () => {
                    $(".word").style.opacity = 1
                },
                ontouchend: () => {
                    $(".word").style.opacity = 0
                },
            },
            "Hold to reveal word"
        ), br(),
        button(
            {
                id: "nextplayer",
                onclick: () => {
                    if (state.showIndex < state.players.length - 1) {
                        state.showIndex++
                        if (state.showIndex == state.players.length - 1) {
                            $("#nextplayer").textContent = "begin game"
                        }
                    } else {
                        state.state = "playing"
                    }
                }
            },
            "next player"
        )
    )
}

function Timer(amount, callback) {
    state.timeleft = amount
    let display = p({className: "timer"}, ""+Math.floor((state.timeleft)/60) + ":00")

    let timer = setInterval(() => {
        state.timeleft--
        if (state.timeleft <= 0) {
            clearInterval(timer)
            callback()
        }
        display.textContent = Math.floor((state.timeleft)/60) + ":" + (""+state.timeleft%60).padStart(2, "0")
    }, 1000)
    return display
}

function Vote() {
    let view = div(
        h1("vote the impostor out!"),
        pre(state.players.filter((x, i) => state.impostors.includes(i)).join("\n")),
        button({
            onclick: cancelvote
        }, "back")
    )

    return view
}

let cancelvote = () => {}
function Playing() {
    let view = div()
    let play = div(
        h1("u can discuss and stuff now"),
        h2(randomchoice(state.players) + " starts"),
        button(
            { onclick: () => {
                view.innerHTML = ""
                view.append(Vote())
            } },
            "show impostors"//vote (unimplemented)"
        ),
        button(
            { onclick: () => {
                    location.href = ""
            } },
            "play again"
        ),
    )
    view.append(play)

    cancelvote = () => {
        view.innerHTML = ""
        view.append(play)
    }

    return div(
        Timer(60 * state.players.length, ()=>{}),
        view
    )
}

function MainInterface() {
	let view = div(
		Loading()
	)

	state.addUpdate("state", () => {
		view.innerHTML = ""
		if (state.state == "menu") {
			view.append(Menu())
		} else if (state.state == "showword") {
			view.append(ShowWord())
		} else if (state.state == "playing") {
			view.append(Playing())
		}
	})

	return main(
		view
	)
}

document.body.appendChild(MainInterface());
if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('serviceworker.js');
} 

function random(max) {
    return Math.floor(Math.random() * max)
}
function randomchoice(array) {
    return array[random(array.length)]
}