
const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
export async function fetchLlmResults(genre:string) {

  // Configure Endpoint
  const llmEndpoint = import.meta.env.VITE_LLM_API;
  const options = {
    method: "POST",
    // mode: "cors",
    headers: new Headers({ "content-type": "application/json", "Access-Control-Allow-Origin": "*" }),
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "Given a genre, crtitize each one and why they might be bad for the community",
        },
        {
          role: "user",
          content: genre,
        },
      ],
      max_length: 120,
    }),
  };

  let sleepTime = 1000
  while(true) {
    sleepTime *= 2
    try {
      const response = await fetch(llmEndpoint, options);
      const data = await response.json();
      if (response.ok) {
        return data
      }
      await sleep(sleepTime)
    } catch (error) {
      console.error(error);
      await sleep(sleepTime)
    }
  }
}