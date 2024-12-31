import { TopArtist, TopArtistItem } from "@/types/spotify"
import { capitalizeWords } from "@/util/capitalizeWords"
import React from "react"

export function RelatedArtists(props: { genre: string, spotifyArtists: TopArtist }) {

  let sortedSpotifyArtists = React.useMemo(() => {
    return props.spotifyArtists.items.sort((a: TopArtistItem, b: TopArtistItem) => (b.popularity - a.popularity))
  }, [props.spotifyArtists])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sortedSpotifyArtists.map((obj: TopArtistItem, idx: number) => {
          if (obj.genres.includes(props.genre)) {
            return (
              <div key={idx + obj.name} className="flex border-2 rounded-md p-1">
                <img src={obj.images[0].url} className="w-[100px] h-[100px] rounded" />
                <div>
                  <h1 className="w-full pl-2 font-bold">{obj.name}</h1>
                  {/* <h1 className="w-full pl-2">Popularity {obj.popularity}</h1> */}
                  <div className="pl-2 flex flex-wrap max-h-[75px] overflow-auto">
                    {obj.genres.map((genre,idx)=>{
                      return(
                        <div key={genre+idx} className="p-2 bg-sky-200 rounded-full m-1">
                          {capitalizeWords(genre)}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>
    </>
  )
}