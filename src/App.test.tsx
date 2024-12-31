import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { fetchUserFavorite } from "./util/fetchUserFavorite";
import { createClientToken } from "./util/createClientToken";
import { SpotifyData } from "./types/spotify";

jest.mock("./util/fetchUserFavorite");
jest.mock("./util/createClientToken");

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  // test("fetches and stores user data if not in localStorage", async () => {
  //   const mockToken = "mock-token";
  //   const mockData: SpotifyData = {
  //     topArtist: { items: [{ id: "1", name: "Artist 1", genres: ['rap'] }] },
  //     topSongs: { items: [{ id: "101", name: "Song 1" }] },
  //   };

  //   (createClientToken as jest.Mock).mockReturnValue(mockToken);
  //   (fetchUserFavorite as jest.Mock).mockResolvedValue([mockData.topArtist, mockData.topSongs]);

  //   render(<App />);

  //   await waitFor(() => {
  //     expect(fetchUserFavorite).toHaveBeenCalledWith(mockToken);
  //     expect(window.localStorage.getItem("spotify-data")).toEqual(
  //       JSON.stringify(mockData)
  //     );
  //     expect(screen.getByText(/Artist 1/i)).toBeTruthy();
  //   });
  // });

  test("loads user data from localStorage if available", async () => {
    const mockData: SpotifyData = {
      topArtist: { items: [{ id: "1", name: "Artist 1", genres: ['rap'] }] },
      topSongs: { items: [{ id: "101", name: "Song 1" }] }
    };

    window.localStorage.setItem("spotify-data", JSON.stringify(mockData));

    render(<App />);

    await waitFor(() => {
      expect(fetchUserFavorite).not.toHaveBeenCalled();
      expect(screen.getByText(/Artist 1/i)).toBeTruthy();
    });
  });

  test("renders ImageCard and ChatCard components when data is available", async () => {
    const mockToken = "mock-token";
    const mockData: SpotifyData = {
      topArtist: { items: [{ id: "1", name: "Artist 1", genres: ['rap'] }, { id: "2", name: "Artist 2", genres: ['pop'] }] },
      topSongs: { items: [{ id: "101", name: "Song 1" }] },
    };

    (createClientToken as jest.Mock).mockReturnValue(mockToken);
    (fetchUserFavorite as jest.Mock).mockResolvedValue([mockData.topArtist, mockData.topSongs]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText(/Artist/i).length).toBe(2); // Two artists in mockData
      expect(screen.getByText(/chat/i)).toBeTruthy(); // ChatCard presence
    });
  });
});
