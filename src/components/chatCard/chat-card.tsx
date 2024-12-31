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

interface MusicSet {
  [key: string]: number
}
interface GenreSet {
  [key: string]: GenreInfo
}

export function ChatCard(props: { spotifyData: SpotifyData }) {
  const [isQueryingLlm, setIsQueryLlm] = React.useState(false);
  const [genreInfo, setGenreInfo] = React.useState<GenreSet>({});
  const [selectedGenre, setSelectedGenre] = React.useState("")

  const scrollIntoView = () => {
    const targetElement = document.getElementById("GENRE_BOTTOM");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Should Only get the top 4
  const musicGenres = React.useMemo(() => {
    if (props.spotifyData) {
      const musicSet: MusicSet = {}
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

  async function fetchGenreInfo(genre: string) {
    if (!isQueryingLlm && !genreInfo.hasOwnProperty(genre)) {
      setIsQueryLlm((_) => true);

      // Check to see if there are cached results
      let llmResults: any = await fetchCachedRecord(genre)
      if (llmResults === null) {
        // Fetch New Results
        llmResults = (await fetchLlmResults(genre)).received
        cacheNewRecord(genre, llmResults)
      }

      // Update Front End State
      setGenreInfo((e) => {
        e[genre] = {
          genre: genre,
          genre_response: llmResults,
          genre_rendered: false,
        }
        return e
      })
      scrollIntoView();

      setIsQueryLlm((_) => false);
    }
    setSelectedGenre(genre)
  }

  function setGenreRenderFlag() {
    setGenreInfo(e=>{
      e[selectedGenre].genre_rendered = true
      return e
    })
  }

  return (
    <div className="rounded-lg backdrop-blur-sm w-[100vw] md:w-[70vw] lg:w-[60vw] h-[75vh] p-10 mt-[10vh] grid">
      <Card className="pl-5 pb-5 pr-5 pt-0 justify-self-stretch overflow-auto relative">
        <h1 className="font-serif text-lg">
          Hello I am the <u>Criti Koala</u>,
        </h1>
        <motion.div exit={{ opacity: 0 }} className="sticky top-0 left-0 bg-white pb-2 min-h-[100px] mb-2">
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
                    className="w-full min-h-[50px] disabled:bg-sky-200"
                    onClick={() => { fetchGenreInfo(name) }}
                    disabled={name === selectedGenre}
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
        {selectedGenre !== "" ? (
          <React.Fragment>
            <h1 className="font-serif text-lg">
              <Typewriter
                text={genreInfo[selectedGenre].genre_response + '...'}
                speed={2}
                typeEnabled={!genreInfo[selectedGenre].genre_rendered}
                setGenreRenderFlag={()=>{setGenreRenderFlag()}}
              />
            </h1>
          </React.Fragment>
        ) : (
          <h1 className="font-serif text-lg text-center font-bold">Click an genre to learn my thoughts!</h1>
        )}
        <div id="GENRE_BOTTOM" />
      </Card>
    </div>
  );
}
