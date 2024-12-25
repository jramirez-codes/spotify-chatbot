import React from "react";
import { SpotifyToken } from "./types/token";
import { createClientToken } from "./util/createClientToken";
import { fetchUserFavorite } from "./util/fetchUserFavorite";
import { Card } from "./components/ui/card";
import { ImageCard } from "./components/imagesCard/image-card";

function App() {
  const spotifyToken: SpotifyToken = createClientToken();
  const [spotifyUserData, setSpotifyUserData] = React.useState<any>(null);

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
                {spotifyUserData.topArtist.items.map((obj: any, idx: any) => {
                  if (idx > spotifyUserData.topArtist.items.length / 2) {
                    return <ImageCard obj={obj} key={idx} />;
                  }
                })}
              </div>
            </div>
            <div className="fixed bottom-0 left-0">
              <div className="flex animate-newScroll">
                {spotifyUserData.topArtist.items.map((obj: any, idx: any) => {
                  if (idx <= spotifyUserData.topArtist.items.length / 2) {
                    return <ImageCard obj={obj} key={idx} />;
                  }
                })}
              </div>
            </div>
          </>
        ) : null}
        <div className="rounded-lg backdrop-blur-sm w-[100vw] md:w-[70vw] lg:w-[60vw] h-[60vh] p-10 mt-[20vh] grid">
          <Card className="p-5 justify-self-stretch">
            <h1 className="font-serif text-xl"></h1>
            <h1 className="font-serif text-lg">
              Hello I am the <u>Criti Koala</u>,
            </h1>
            <h1 className="font-serif text-lg">Here to judge your poor music tastes!</h1>
          </Card>
        </div>
      </div>
    </>
  );
}

export default App;
