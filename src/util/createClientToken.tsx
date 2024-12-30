import { SpotifyToken } from "@/types/token";
import CryptoJS from "crypto-js";

const randomString = (length: number) => {
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1);
};

function routeToSpotifyAuth() {
  // Create New Login
  const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const urlRegex = /^(.*?\/.*?\/.*?)(?:\/|$)/;
  const match = window.location.href.match(urlRegex);
  let redirect_uri = "";
  if(match) {
    redirect_uri = match[1]+'/'
    alert(match[1])
  }

  // alert(redirect_uri);
  const state = randomString(16);
  const scope = "user-top-read user-read-private user-read-email";
  let url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url += "&state=" + encodeURIComponent(state);

  window.location.href = url;
}

export function createClientToken() {
  const tokenKey = import.meta.env.VITE_SPOTIFY_STATE_KEY + "TOKEN";
  // Check Current Token
  const token = window.localStorage.getItem(tokenKey);
  if (token) {
    // return token
    const spotifyToken: SpotifyToken = JSON.parse(CryptoJS.AES.decrypt(token, import.meta.env.VITE_SECRET_PASS).toString(CryptoJS.enc.Utf8));
    if (parseInt(spotifyToken.expires_in) > Date.now()) {
      return spotifyToken as SpotifyToken;
    } else {
      routeToSpotifyAuth();
    }
  }

  // Check Query Params
  const queryString = window.location.href;
  if (queryString.includes("#")) {
    // Cache and Reroute
    // let token = JSON.stringify()
    const tokenArray = queryString.split("#")[1].split("&");
    let token: any = {};
    for (const item of tokenArray) {
      const itemKey = item.split("=");
      token[itemKey[0]] = itemKey[1];
    }

    (token as SpotifyToken).expires_in = (parseInt((token as SpotifyToken).expires_in) + Date.now()).toString();
    window.localStorage.setItem(tokenKey, CryptoJS.AES.encrypt(JSON.stringify(token), import.meta.env.VITE_SECRET_PASS).toString());
    return token;
  }

  routeToSpotifyAuth();
}
