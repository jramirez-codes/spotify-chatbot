import { SpotifyToken } from "@/types/token";
import CryptoJS from "crypto-js";

export async function fetchUserFavorite(token: SpotifyToken) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  }
  const key = import.meta.env.VITE_SPOTIFY_STATE_KEY +"-spotify-data";
  const userFavorite = window.localStorage.getItem(key);

  // Check if local cache exsits
  if (!userFavorite) {
    // Fetch New Results 
    const [topArtist, topSongs] = await Promise.all([
      fetchTopArtist(options),
      fetchTopSongs(options)
    ])
    
    // Save to Local Storage
    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(userFavorite), import.meta.env.VITE_SECRET_PASS).toString();
    window.localStorage.setItem(key,cipherText);

    // Return Data
    return {
      topArtist: topArtist,
      topSongs: topSongs,
    };
  } 
  return JSON.parse(CryptoJS.AES.decrypt(userFavorite, import.meta.env.VITE_SECRET_PASS).toString(CryptoJS.enc.Utf8));
}

async function fetchTopArtist(options: any) {
  let res = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20", options)

  while (true) {
    if (!res.ok) {
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
async function fetchTopSongs(options: any) {
  let res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10", options)

  while (true) {
    if (!res.ok) {
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