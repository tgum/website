fetch("https://status.cafe/users/tgum/status.json")
  .then( r => r.json() )
  .then( r => {
    document.querySelector("#statuscafe").innerHTML = `
      <div id=statuscafe-username><a href="https://status.cafe/users/tgum" target="_blank">${r.author}</a>${r.face} ${r.timeAgo}</div>
      <div id=statuscafe-content>${r.content}</div>
    `
  })
