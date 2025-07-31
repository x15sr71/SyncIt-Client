import { useState, useCallback } from "react";
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

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  images: { url: string }[];
  owner: {
    display_name: string;
    id: string;
    external_urls: { spotify: string };
  };
  tracks: {
    total: number;
  };
}


interface GetPlaylistsResponse {
  success: boolean;
  data: SpotifyPlaylist[];
}   

export default function useGetSpotifyPlaylists() {
    const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaylists = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching Spotify playlists...');
            const response = await apiClient.get<GetPlaylistsResponse>("/getSpotifyPlaylists");
            console.log('Spotify playlists response:', response.data);
            
            if (response.data.success && response.data.data) {
                // Force a new array reference to trigger re-render
                const newPlaylists = [...response.data.data];
                setSpotifyPlaylists(newPlaylists);
                console.log('Updated Spotify playlists state:', newPlaylists);
                return newPlaylists;
            } else {
                throw new Error('Failed to fetch playlists');
            }
        } catch (error) {
            console.error("Error fetching Spotify playlists:", error);
            setError(error instanceof Error ? error.message : 'Failed to fetch playlists');
            setSpotifyPlaylists([]);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to update a specific playlist in the local state
    const updatePlaylistInState = useCallback((playlistId: string, updates: Partial<SpotifyPlaylist>) => {
        setSpotifyPlaylists(prevPlaylists => {
            const updatedPlaylists = prevPlaylists.map(playlist => 
                playlist.id === playlistId 
                    ? { ...playlist, ...updates }
                    : playlist
            );
            console.log('Updated playlist in local state:', updatedPlaylists);
            return updatedPlaylists;
        });
    }, []);

    // Function to remove a playlist from local state
    const removePlaylistFromState = useCallback((playlistId: string) => {
        setSpotifyPlaylists(prevPlaylists => {
            const updatedPlaylists = prevPlaylists.filter(playlist => playlist.id !== playlistId);
            console.log('Removed playlist from local state:', updatedPlaylists);
            return updatedPlaylists;
        });
    }, []);

    return { 
        fetchPlaylists, 
        spotifyPlaylists, 
        loading, 
        error,
        updatePlaylistInState,
        removePlaylistFromState
    };
}