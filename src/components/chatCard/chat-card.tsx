import { Card } from "../ui/card";
import { motion } from "motion/react";
import React from "react";
import { Button } from "../ui/button";
import { GenreInfo } from "@/types/genre";
import { capitalizeWords } from "@/util/capitalizeWords";
import { Loader2 } from "lucide-react";
import { SpotifyData } from "@/types/spotify";
import { Typewriter } from "./sub-compnents/typewriter";
import { fetchLlmResults } from "@/util/fetchLlmResults";
import { cacheNewRecord, fetchCachedRecord } from "@/util/turso";

export function ChatCard(props: { spotifyData: SpotifyData }) {
  const [isQueryingLlm, setIsQueryLlm] = React.useState(false);
  const [genreInfo, setGenreInfo] = React.useState<GenreInfo[]>([]);

  const scrollIntoView = () => {
    const targetElement = document.getElementById("GENRE_BOTTOM");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Should Only get the top 4
  const musicGenres = React.useMemo(() => {
    if (props.spotifyData) {
      interface musicSet {
        [key: string]: number
      }
      const musicSet: musicSet = {}
      for (const artist of props.spotifyData.topArtist.items) {
        for (const genre of artist.genres) {
          if (musicSet.hasOwnProperty(genre)) {
            musicSet[genre] += 1
          }
          else {
            musicSet[genre] = 1
          }
        }
      }

      return Object.entries(musicSet)
        .sort(([, valueA], [, valueB]) => valueB - valueA) // Sort descending by values
        .slice(0, 4) // Take the top three
        .map(([key]) => key); // Extract the keys
    }
    return [] as string[];
  }, [props.spotifyData]);

  async function handleQueryLlm(genre: string) {
    if (!isQueryingLlm) {
      setIsQueryLlm((_) => true);

      // Check to see if there are cached results
      let llmResults: any = await fetchCachedRecord(genre)
      if (llmResults === null) {
        // Fetch New Results
        llmResults = (await fetchLlmResults(genre)).received
        cacheNewRecord(genre, llmResults)
      }

      // Update Front End State
      setGenreInfo((e) => [
        ...e,
        {
          genre: genre,
          genre_response: llmResults,
        },
      ]);
      // Scroll Into View
      scrollIntoView();

      setIsQueryLlm((_) => false);
    }
  }

  return (
    <div className="rounded-lg backdrop-blur-sm w-[100vw] md:w-[70vw] lg:w-[60vw] h-[75vh] p-10 mt-[10vh] grid">
      <Card className="pl-5 pb-5 pr-5 pt-0 justify-self-stretch overflow-auto relative">
        <h1 className="font-serif text-lg">
          Hello I am the <u>Criti Koala</u>,
        </h1>
        <motion.div exit={{ opacity: 0 }} className="sticky top-0 left-0 bg-white pb-2 min-h-[100px]">
          <h1 className="font-serif text-lg">
            {/* <Typewriter text={`Here to judge your poor music tastes! From what I hear you seem to listening to:`} speed={10} /> */}
            <span>Here to judge your music tastes! From what I hear you seem to listening to:</span>
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-1">
          {musicGenres.map((name: string, idx: number) => {
            return (
              <div
                key={idx + name + 1}
                className="col-span-1 p-1"
              >
              <Button
                variant={"outline"}
                className="w-full min-h-[50px]"
                onClick={() => {
                  handleQueryLlm(name);
                }}
              >
                {capitalizeWords(name)}
              </Button>
              </div>
            );
          })}
          </div>
          {isQueryingLlm && (
            <div className="absolute top-0 right-0 w-[100%] h-[100%] backdrop-blur-sm rounded">
              <div className="ml-[48%] mt-4">
                <Loader2 className="animate-spin" size={64} />
              </div>
              <h1 className="font-serif text-2xl font-bold text-center">
                <Typewriter text="Judging your music tastes, please wait!" speed={60} />
              </h1>
            </div>
          )}
        </motion.div>
        <h1 className="font-serif text-lg">Click an genre to learn my thoughts!</h1>
        {genreInfo.map((obj, idx) => {
          return (
            <React.Fragment key={"GENRE_IFNO" + obj.genre + idx}>
              <h1 className="font-serif text-lg underline font-bold">{capitalizeWords(obj.genre)}</h1>
              <h1 className="font-serif text-lg">
                <Typewriter text={obj.genre_response+'...'} speed={60} />
              </h1>
            </React.Fragment>
          );
        })}
        <div id="GENRE_BOTTOM" />
      </Card>
    </div>
  );
}
