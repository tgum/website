// golfed version
// var cd=[],cde=[],add_countdown=()=>{};setInterval(i=>{for(i=0;i<cd.length;i++){var S=(new Date(cd[i])-Date.now())/1000,f=Math.floor,d=f(S/86400),h=f(S%86400/3600),m=f(S%3600/60),s=f(S/1%60);cde[i].innerText=d+"d"+h+"h"+m+"m"+s+"s"}},1000)
let countdowns = []
setInterval(() => {
  let now = Date.now()
  let units      = [86400, 3600, 60, 1]
  let unit_names = ["day", "hour", "minute", "second"]
  for (let countdown of countdowns) {
    let timeleft = (countdown.timestamp - now)/1000
    let output = ""
    if (timeleft <= 0) {
      output = countdown.message_done
    } else {
      for (let i = 0; i < units.length; i++) {
        let unit = units[i]
        let count = timeleft
        if (Math.floor(count/unit) > 0) {
          if (i > 0) count = count % units[i-1]
          count = Math.floor(count/unit)
          output += count + " " + unit_names[i]
          if (count != 1) output += "s"
          if (i < units.length - 1) output += ", "
        }
      }      
    }
    countdown.element.innerText = output
  }
})

for (let countdown of Array.from(document.querySelectorAll(".countdown"))) {
  countdowns.push({
    element: countdown,
    message_done: countdown.dataset.message,
    timestamp: new Date(countdown.dataset.timestamp).getTime()
  })
}
