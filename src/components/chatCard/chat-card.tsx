import { AnimatePresence } from "motion/react";
import { Card } from "../ui/card";
import { motion } from "motion/react";
import React from "react";
import { Button } from "../ui/button";

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

  return (
    <div className="rounded-lg backdrop-blur-sm w-[100vw] md:w-[70vw] lg:w-[60vw] h-[60vh] p-10 mt-[20vh] grid">
      <Card className="p-5 justify-self-stretch">
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
                  <Button key={idx} variant={"outline"} className="ml-1 mr-1 mt-1">
                    {name}
                  </Button>
                );
              })}
            </h1>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
