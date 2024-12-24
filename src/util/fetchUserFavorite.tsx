import { SpotifyToken } from "@/types/token";

export async function fetchUserFavorite(token: SpotifyToken) {
  let options = {
    method: 'GET',
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  }

  return await Promise.all([
    fetchTopArtist(options),
    fetchTopSongs(options)
  ])
}

async function fetchTopArtist(options:any) {
  let res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20", options)

  while(true) {
    if(!res.ok) {
      alert(JSON.stringify(await res.json()))
      window.localStorage.clear()
      window.location.href = "/"
    }
    else {
      let data = await res.json()
      return data
    }
  }
}
async function fetchTopSongs(options:any) {
  let res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10", options)

  while(true) {
    if(!res.ok) {
      alert(JSON.stringify(await res.json()))
      window.localStorage.clear()
      window.location.href = "/"
    }
    else {
      let data = await res.json()
      return data
    }
  }
}