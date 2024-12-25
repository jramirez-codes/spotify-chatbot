import { AnimatePresence } from "motion/react";
import { Card } from "../ui/card";
import { motion } from "motion/react";
import React from "react";
import { Button } from "../ui/button";
import { handler } from "tailwindcss-animate";

function Typewriter({ text, speed }) {
  const [displayText, setDisplayText] = React.useState("");
  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;

      if (i === text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayText}</span>;
}

export function ChatCard(props: { spotifyData: any }) {
  const [isQueryingLlm, setIsQueryLlm] = React.useState(false);

  const musicGenres = React.useMemo(() => {
    if (props.spotifyData) {
      const musicSet = new Set();
      for (const artist of props.spotifyData.topArtist.items) {
        for (const genre of artist.genres) {
          musicSet.add(genre);
        }
      }
      return Array.from(musicSet);
    }
    return [];
  }, [props.spotifyData]);

  async function handleQueryLlm(genre: string) {
    if (!isQueryingLlm) {
      setIsQueryLlm((_) => true);
      const llmEndpoint = import.meta.env.VITE_LLM_API;
      alert("TEST EVENT");
      const options = {
        method: "POST",
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          "content-type": "application/json",
        }),
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
          max_length: 60,
        }),
      };
      const res = await fetch(llmEndpoint, options);
      if (res.ok) {
        alert(JSON.stringify(await res.json()));
      }

      setIsQueryLlm((_) => false);
    }
  }

  return (
    <div className="rounded-lg backdrop-blur-sm w-[100vw] md:w-[70vw] lg:w-[60vw] h-[60vh] p-10 mt-[20vh] grid">
      <Card className="p-5 justify-self-stretch overflow-auto">
        <h1 className="font-serif text-xl"></h1>
        <h1 className="font-serif text-lg">
          Hello I am the <u>Criti Koala</u>,
        </h1>
        <AnimatePresence>
          <motion.div exit={{ opacity: 0 }}>
            <h1 className="font-serif text-lg">
              {/* <Typewriter text={`Here to judge your poor music tastes! From what I hear you seem to listening to:`} speed={10} /> */}
              <span>Here to judge your poor music tastes! From what I hear you seem to listening to:</span>
              {musicGenres.map((name: any, idx) => {
                return (
                  <Button
                    key={idx}
                    variant={"outline"}
                    className="ml-1 mr-1 mt-1"
                    onClick={() => {
                      handleQueryLlm(name);
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </h1>
            <h1 className="font-serif text-lg">Click an genre to learn my thoughts!</h1>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
