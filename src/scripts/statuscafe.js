fetch("https://status.cafe/users/tgum/status.json")
  .then( r => r.json() )
  .then( r => {
    document.querySelector("#statuscafe-container").innerHTML = `
      <div id="statuscafe">
        <div id=statuscafe-content style="text-align: center">${r.face} <em>${r.content}</em></div>
        <small>updated: <strong>${r.timeAgo}</strong></small>
      </div>
    `
  })
