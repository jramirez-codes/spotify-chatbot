import React from "react";
import { SpotifyToken } from "./types/token";
import { createClientToken } from "./util/createClientToken";
import { fetchUserFavorite } from "./util/fetchUserFavorite";
import { ImageCard } from "./components/imagesCard/image-card";
import { ChatCard } from "./components/chatCard/chat-card";
import { SpotifyData, TopArtistItem } from "./types/spotify";

function App() {
  const spotifyToken: SpotifyToken = createClientToken();
  const [spotifyUserData, setSpotifyUserData] = React.useState<SpotifyData | null>(null);

  // Fetching User Info
  React.useEffect(() => {
    const key = "spotify-data";
    const userFavorite = window.localStorage.getItem(key);
    if (!userFavorite) {
      const asnycFunc = async () => {
        const [topArtist, topSongs] = await fetchUserFavorite(spotifyToken);

        window.localStorage.setItem(
          key,
          JSON.stringify({
            topArtist: topArtist,
            topSongs: topSongs,
          }),
        );
        setSpotifyUserData({
          topArtist: topArtist,
          topSongs: topSongs,
        });
      };
      asnycFunc();
    } else {
      setSpotifyUserData(JSON.parse(userFavorite));
    }
  }, []);

  console.log(spotifyUserData);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex justify-center items-center">
        {spotifyUserData ? (
          <>
            <div className="fixed top-0 left-0">
              <div className="flex animate-newScroll">
                {spotifyUserData.topArtist.items.map((obj: TopArtistItem, idx: number) => {
                  if (idx > spotifyUserData.topArtist.items.length / 2) {
                    return <ImageCard obj={obj} key={idx} />;
                  }
                })}
              </div>
            </div>
            <div className="fixed bottom-0 left-0">
              <div className="flex animate-newScroll">
                {spotifyUserData.topArtist.items.map((obj: TopArtistItem, idx: number) => {
                  if (idx <= spotifyUserData.topArtist.items.length / 2) {
                    return <ImageCard obj={obj} key={idx} />;
                  }
                })}
              </div>
            </div>
            <ChatCard spotifyData={spotifyUserData} />
          </>
        ) : null}
      </div>
    </>
  );
}

export default App;
