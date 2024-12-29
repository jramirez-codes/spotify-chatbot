import { Card } from "../ui/card";
import { motion } from "motion/react";
import React from "react";
import { Button } from "../ui/button";
import { GenreInfo } from "@/types/genre";
import { capitalizeWords } from "@/util/ capitalizeWords";
import { Loader2 } from "lucide-react";
import { SpotifyData } from "@/types/spotify";
import { Typewriter } from "./sub-compnents/typewriter";

export function ChatCard(props: { spotifyData: SpotifyData }) {
  const [isQueryingLlm, setIsQueryLlm] = React.useState(false);
  const [genreInfo, setGenreInfo] = React.useState<GenreInfo[]>([]);

  const scrollIntoView = () => {
    const targetElement = document.getElementById("GENRE_BOTTOM");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const musicGenres = React.useMemo(() => {
    if (props.spotifyData) {
      const musicSet = new Set();
      for (const artist of props.spotifyData.topArtist.items) {
        for (const genre of artist.genres) {
          musicSet.add(genre);
        }
      }
      return [...musicSet] as string[];
    }
    return [] as string[];
  }, [props.spotifyData]);

  async function handleQueryLlm(genre: string) {
    if (!isQueryingLlm) {
      setIsQueryLlm((_) => true);
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

      try {
        const response = await fetch(llmEndpoint, options);
        const data = await response.json();
        if (response.ok) {
          setGenreInfo((e) => [
            ...e,
            {
              genre: genre,
              genre_response: data.received,
            },
          ]);
          // Scroll Into View
          scrollIntoView();
        }
      } catch (error) {
        console.error(error);
      }
      setIsQueryLlm((_) => false);
    }
  }

  return (
    <div className="rounded-lg backdrop-blur-sm w-[100vw] md:w-[70vw] lg:w-[60vw] h-[75vh] p-10 mt-[10vh] grid">
      <Card className="pl-5 pb-5 pr-5 pt-0 justify-self-stretch overflow-auto relative">
        <h1 className="font-serif text-lg">
          Hello I am the <u>Criti Koala</u>,
        </h1>
        <motion.div exit={{ opacity: 0 }} className="sticky top-0 left-0 bg-white pb-2">
          <h1 className="font-serif text-lg">
            {/* <Typewriter text={`Here to judge your poor music tastes! From what I hear you seem to listening to:`} speed={10} /> */}
            <span>Here to judge your music tastes! From what I hear you seem to listening to:</span>
            {musicGenres.map((name: string, idx: number) => {
              return (
                <Button
                  key={idx + name + 1}
                  variant={"outline"}
                  className="ml-1 mr-1 mt-1"
                  onClick={() => {
                    handleQueryLlm(name);
                  }}
                >
                  {capitalizeWords(name)}
                </Button>
              );
            })}
          </h1>
          {isQueryingLlm && (
            <div className="absolute top-0 right-0 w-[100%] h-[100%] backdrop-blur-sm rounded">
              <div className="ml-[48%] mt-4">
                <Loader2 className="animate-spin" size={64} />
              </div>
              <h1 className="font-serif text-2xl font-bold text-center">
                <Typewriter text="Judging your music tastes, please wait!" speed={60} />
              </h1>
              {/* {selectedSong && (
                <iframe
                  className="p-4"
                  src={`https://open.spotify.com/embed/track/${selectedSong.id}?utm_source=generator`}
                  width="100%"
                  height="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  ref={playRef.current}
                />
              )} */}
            </div>
          )}
        </motion.div>
        <h1 className="font-serif text-lg">Click an genre to learn my thoughts!</h1>
        {genreInfo.map((obj, idx) => {
          return (
            <React.Fragment key={"GENRE_IFNO" + obj.genre + idx}>
              <h1 className="font-serif text-lg underline font-bold">{capitalizeWords(obj.genre)}</h1>
              <h1 className="font-serif text-lg">
                <Typewriter text={obj.genre_response} speed={60} />
              </h1>
            </React.Fragment>
          );
        })}
        <div id="GENRE_BOTTOM" />
      </Card>
    </div>
  );
}
