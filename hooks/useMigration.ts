import { useState } from "react";

export const useMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMigration = async (playlistId: string, playlistName: string) => {
    console.log("useMigration: Starting migration", { playlistId, playlistName });

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3002/youtube-to-spotify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId, playlistName }),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
          console.error("useMigration: Backend error response", { errorData });
        } catch (jsonErr) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
            console.error("useMigration: Fallback text error response", { errorText });
          } catch (textErr) {
            console.error("useMigration: Failed to parse error", { textErr });
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;

    } catch (err: any) {
      let userFriendlyMessage = err?.message || "Migration failed";

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        userFriendlyMessage = "Cannot connect to the migration server. Please check if the server is running on port 3002.";
      } else if (err.message.includes("ECONNREFUSED")) {
        userFriendlyMessage = "Connection refused. Please check if the migration server is running.";
      } else if (err.message.includes("CORS")) {
        userFriendlyMessage = "CORS error. Please check server CORS configuration.";
      }

      setError(userFriendlyMessage);
      throw new Error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { startMigration, isLoading, error };
};
