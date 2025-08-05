import { useState, useCallback } from "react";
import apiClient from "../utils/api"; 

// SpotifyPlaylist interface (Spotify object compliance)
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

// Success response structure
export interface GetPlaylistsSuccess {
  success: true;
  data: SpotifyPlaylist[];
}

// Error response structure
export interface GetPlaylistsError {
  success: false;
  error: string; // e.g., "UNAUTHORIZED", "AUTH_REFRESH_FAILED", etc.
  message: string; // Friendly message to display
}

// Final union type
export type GetPlaylistsResponse = GetPlaylistsSuccess | GetPlaylistsError;


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