(() => {
  const API_KEY = "8cdf2470f3b0da40da7724c595d00076"
  const containers = document.querySelectorAll(".lastfmwidget")

  containers.forEach(container => {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json&user=${container.dataset.user}&api_key=${API_KEY}`)
      .then(r=>r.json())
      .then(r => {
        let tracks = r.recenttracks.track
        if (tracks.length > 0) {
          const track = tracks[0]
          const name = track.name
          const album = track.album["#text"]
          const artist = track.artist["#text"]
          const imageurl = track.image[2]["#text"]
          console.log(track)
          container.innerHTML = `
            <img src="${imageurl}" class="lastfmcover"><br>
            <span class="lastfmsong">${name}</span> by <span class="lastfmartist">${artist}</span><br>
            <span class="lastfmalbum">${album}</span>
          `
          console.log(name, album, artist)
        }
      })
  })
})()
