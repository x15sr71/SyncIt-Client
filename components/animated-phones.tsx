"use client"

import { useEffect, useState } from "react"
import { Music, ArrowRight } from "lucide-react"

const playlistSongs = [
  { title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55" },
  { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { title: "Shape of You", artist: "Ed Sheeran", duration: "3:53" },
  { title: "Dance Monkey", artist: "Tones and I", duration: "3:29" },
  { title: "Someone Like You", artist: "Adele", duration: "4:45" },
  { title: "Stay With Me", artist: "Sam Smith", duration: "2:52" },
]

export function AnimatedPhones() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSongIndex((prev) => (prev + 1) % playlistSongs.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
      {/* YouTube Music Phone */}
      <div className="w-64 h-[500px] bg-[#030303] rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-500">
        <div className="bg-[#030303] h-full w-full">
          <div className="bg-[#030303] p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                YT
              </div>
              <div>
                <div className="text-white font-medium">My Playlist</div>
                <div className="text-gray-400 text-xs">YouTube Music</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 p-2">
            {playlistSongs.map((song, index) => (
              <div
                key={`yt-${index}`}
                className={`p-3 rounded-lg transition-all duration-500 ${
                  index === currentSongIndex ? "bg-red-500/20 translate-x-8 opacity-0" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                    <Music className="h-5 w-5 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{song.title}</div>
                    <div className="text-gray-400 text-xs truncate">{song.artist}</div>
                  </div>
                  <div className="text-gray-400 text-xs">{song.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Migration Arrow */}
      <div className="z-10 transition-transform duration-500 sm:rotate-0 rotate-90">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#1DB954] to-[#833AB4] rounded-full flex items-center justify-center animate-pulse">
          <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-white transform sm:rotate-0 rotate-90" />
        </div>
      </div>

      {/* Spotify Phone */}
      <div className="w-64 h-[500px] bg-[#121212] rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500">
        <div className="bg-[#121212] h-full w-full">
          <div className="bg-gradient-to-b from-[#535353] to-[#121212] p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                SP
              </div>
              <div>
                <div className="text-white font-medium">My Playlist</div>
                <div className="text-gray-400 text-xs">Spotify</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 p-2">
            {playlistSongs.map((song, index) => (
              <div
                key={`sp-${index}`}
                className={`p-3 rounded-lg transition-all duration-500 ${
                  index === currentSongIndex ? "bg-green-500/20 -translate-x-8 opacity-0" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                    <Music className="h-5 w-5 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{song.title}</div>
                    <div className="text-gray-400 text-xs truncate">{song.artist}</div>
                  </div>
                  <div className="text-gray-400 text-xs">{song.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
