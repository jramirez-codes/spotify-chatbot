import { createClient } from "@libsql/client";
import CryptoJS from "crypto-js";
import pako from 'pako';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const turso = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

function compressToBase64(input:string) {
  const compressed = pako.deflate(input, { level: 9 }); // Best compression level
  return btoa(String.fromCharCode(...compressed));
}

function decompressFromBase64(base64String:string) {
  const binaryString = atob(base64String);
  const binaryData = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    binaryData[i] = binaryString.charCodeAt(i);
  }
  return pako.inflate(binaryData, { to: 'string' });
}

export async function cacheNewRecord(id: string, data: string) {
  // Create Hash of ID
  const hashedId = CryptoJS.SHA256(id).toString(CryptoJS.enc.Hex);
  const compressedData = compressToBase64(data)
  let sleepTime = 1000
  while (true) {
    try {
      return await turso.execute({
        sql: "INSERT INTO results VALUES (:id,:data)",
        args: {
          id: hashedId,
          data: compressedData
        },
      });
    }
    catch (e) {
      sleepTime *= 2
      console.log(e)
      await sleep(sleepTime)
    }
  }
}

export async function fetchCachedRecord(id: string) {
  const hashedId = CryptoJS.SHA256(id).toString(CryptoJS.enc.Hex);
  let sleepTime = 1000
  while (true) {
    try {
      const data = await turso.execute({
        sql: "SELECT data FROM results WHERE id = ?",
        args: [hashedId]
      })
      if(data.rows.length == 0) {
        return null
      }
      return decompressFromBase64(data.rows[0][0] as string)
    }
    catch (e) {
      sleepTime *= 2
      console.log(e)
      await sleep(sleepTime)
    }
  }
}