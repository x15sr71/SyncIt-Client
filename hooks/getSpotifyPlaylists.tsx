import { useState } from "react";
import apiClient from "../utils/api"; 

interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

interface SpotifyOwner {
  display_name: string;
  external_urls: { spotify: string };
  id: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  images: SpotifyImage[];
  tracks: { total: number };
  external_urls: { spotify: string };
  owner: SpotifyOwner;
}

interface GetPlaylistsResponse {
  success: boolean;
  data: SpotifyPlaylist[];
}   

export default function useGetSpotifyPlaylists() {
    const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);

    const fetchPlaylists = async () => {
        try {
            const response = await apiClient.get<GetPlaylistsResponse>("/getSpotifyPlaylists");
            console.log(response.data);
            setSpotifyPlaylists(response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching Spotify playlists:", error);
            setSpotifyPlaylists([]);
            throw error; // Re-throw the error so the component can handle it
        }
    };

    return { fetchPlaylists, spotifyPlaylists };
}