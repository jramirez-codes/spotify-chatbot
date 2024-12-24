import React from "react";
import { SpotifyToken } from "./types/token";
import { createClientToken } from "./util/createClientToken";
import { fetchUserFavorite } from "./util/fetchUserFavorite";
import { Card } from "./components/ui/card";

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

  return (
    <>
      {spotifyUserData ? (
        <>
          <div className="fixed top-0 left-0">
            <div className="flex shink-0 animate-newScroll">
              {spotifyUserData.topArtist.items.map((obj: any, idx: any) => {
                const size = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
                const margin = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
                if (idx > spotifyUserData.topArtist.items.length / 2) {
                  return (
                    <div style={{ margin: margin }} className="relative">
                      <img
                        className="rounded object-contain drop-shadow-lg"
                        style={{ minWidth: size + "vw", minHeight: size + "vw" }}
                        src={obj.images[1].url}
                        key={idx + obj.images[0].url}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className="fixed bottom-0 left-0">
            <div className="flex shink-0 animate-newScroll">
              {spotifyUserData.topArtist.items.map((obj: any, idx: any) => {
                const size = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
                const margin = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
                if (idx <= spotifyUserData.topArtist.items.length / 2) {
                  return (
                    <div style={{ margin: margin }} className="relative">
                      <img
                        className="rounded object-contain drop-shadow-lg"
                        style={{ minWidth: size + "vw", minHeight: size + "vw" }}
                        src={obj.images[1].url}
                        key={idx + obj.images[0].url}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </>
      ) : null}
      <div className="fixed top-0 left-0 w-full flex justify-center items-center">
        <div className="rounded-lg backdrop-blur-sm w-[60vh] h-[60vh] p-10 mt-[20vh] grid">
          <Card className="p-5 justify-self-stretch">
            <h1 className="font-serif text-xl">Criti Koala</h1>
            <h1 className="font-serif">Hello I am the Criti Koala, here to judge your poor music tastes!</h1>
          </Card>
        </div>
      </div>
    </>
  );
}

export default App;
