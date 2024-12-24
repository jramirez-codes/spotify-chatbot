import { SpotifyToken } from "@/types/token";
import CryptoJS from 'crypto-js'

const randomString = (length: number) => {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

export function createClientToken() {
  const tokenKey = import.meta.env.VITE_SPOTIFY_STATE_KEY + 'TOKEN'

  // Check Current Token
  let token = window.localStorage.getItem(tokenKey)
  if (token) {
    // return token 
    let spotifyToken: SpotifyToken = JSON.parse(CryptoJS.AES.decrypt(token, import.meta.env.VITE_SECRET_PASS).toString(CryptoJS.enc.Utf8))
    if (parseInt(spotifyToken.expires_in) > Date.now()) {
      // Return 
      return (spotifyToken as SpotifyToken)
    }
  }

  // Check Query Params
  const queryString = window.location.href;
  if (queryString.includes('#')) {
    // Cache and Reroute
    // let token = JSON.stringify()
    let tokenArray = queryString.split('#')[1].split('&')
    let token: any = {}
    for (let item of tokenArray) {
      let itemKey = item.split('=')
      token[itemKey[0]] = itemKey[1]
    }

    (token as SpotifyToken).expires_in = (parseInt((token as SpotifyToken).expires_in) + Date.now()).toString()
    window.localStorage.setItem(tokenKey, CryptoJS.AES.encrypt(JSON.stringify(token), import.meta.env.VITE_SECRET_PASS).toString())
    return token
  }

  // Create New Login
  var client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  var redirect_uri = 'http://localhost:5173/';
  var state = randomString(16);
  var scope = 'user-top-read user-read-private user-read-email';
  var url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  window.location.href = url
}