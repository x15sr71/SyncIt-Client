"use client";

import { useEffect, useState } from "react";
import {
  Music,
  ArrowRight,
  ChevronLeft,
  MoreHorizontal,
  MoreVertical,
  ArrowDownToLine,
  Shuffle,
  Play,
  Home,
  Search,
  Library,
  Compass,
} from "lucide-react";
import { SiSpotify, SiYoutubemusic } from "react-icons/si";
import { IPhoneFrame } from "./iphone-frame";

const playlistSongs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    plays: "1.2B",
    art: "from-amber-500 to-rose-600",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    plays: "982M",
    art: "from-red-500 to-slate-800",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    plays: "874M",
    art: "from-sky-400 to-indigo-600",
  },
  {
    title: "Dance Monkey",
    artist: "Tones and I",
    plays: "651M",
    art: "from-yellow-400 to-orange-600",
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    plays: "540M",
    art: "from-neutral-400 to-neutral-700",
  },
  {
    title: "Stay With Me",
    artist: "Sam Smith",
    plays: "412M",
    art: "from-teal-400 to-emerald-700",
  },
];

/** Square gradient stand-in for album art. */
function Art({
  gradient,
  className = "",
}: {
  gradient: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 ${className}`}
    >
      <Music className="w-1/3 h-1/3 text-white/70" />
    </div>
  );
}

const TABS_SPOTIFY = [
  { icon: Home, label: "Home", on: true },
  { icon: Search, label: "Search", on: false },
  { icon: Library, label: "Your Library", on: false },
];

const TABS_YTM = [
  { icon: Home, label: "Home", on: true },
  { icon: Compass, label: "Explore", on: false },
  { icon: Library, label: "Library", on: false },
];

function TabBar({
  tabs,
  bg,
}: {
  tabs: typeof TABS_SPOTIFY;
  /** Opaque, or the track list shows through it. */
  bg: string;
}) {
  return (
    <div
      className={`flex items-center justify-around border-t border-white/5 pt-1.5 pb-[7%] text-[7px] text-white/50 z-20 shrink-0 ${bg}`}
    >
      {tabs.map(({ icon: Icon, label, on }) => (
        <div
          key={label}
          className={`flex flex-col items-center gap-0.5 ${on ? "text-white" : ""}`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Spotify iOS playlist screen. Follows the real app: art-derived gradient
 * header, centred cover, title, owner row, metadata line, download and
 * ellipsis on the left with shuffle and the green play button on the right.
 * Rows end in an ellipsis rather than a duration — Spotify does not show
 * track length in the mobile playlist view.
 */
function SpotifyScreen({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="h-full w-full bg-[#121212] flex flex-col text-white">
      <div className="bg-gradient-to-b from-[#3b4d61] via-[#26313d] to-[#121212] px-3 pb-3 pt-[13%] shrink-0">
        <ChevronLeft className="w-4 h-4 text-white/90 mb-1" />
        <div className="flex justify-center">
          <Art
            gradient="from-violet-500 to-fuchsia-700"
            className="w-[42%] aspect-square rounded shadow-2xl"
          />
        </div>
        <div className="mt-2 text-[15px] font-bold leading-tight">
          My Playlist
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <SiSpotify className="w-3 h-3 text-[#1DB954]" />
          <span className="text-[9px] font-semibold text-white/90">SyncIt</span>
        </div>
        <div className="text-[9px] text-white/60 mt-0.5">
          Playlist &middot; 6 songs, 24 min
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/70">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <MoreHorizontal className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <Shuffle className="w-3.5 h-3.5 text-[#1DB954]" />
            <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Play className="w-4 h-4 text-black fill-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 pt-1 space-y-2 overflow-hidden">
        {playlistSongs.map((song, index) => (
          <div
            key={`sp-${index}`}
            className={`flex items-center gap-2.5 transition-all duration-500 ${
              index === currentIndex
                ? "-translate-x-8 opacity-0"
                : "opacity-100"
            }`}
          >
            <Art gradient={song.art} className="w-8 h-8 rounded-sm" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate leading-tight">
                {song.title}
              </div>
              <div className="text-[9px] text-white/60 truncate">
                {song.artist}
              </div>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-white/50 shrink-0" />
          </div>
        ))}
      </div>

      <TabBar tabs={TABS_SPOTIFY} bg="bg-[#121212]" />
    </div>
  );
}

/**
 * YouTube Music iOS playlist screen. Follows the real app: near-black
 * background, centred cover, owner and metadata lines, the Play / Shuffle
 * pill pair, and rows carrying "artist · plays" with a vertical overflow.
 */
function YouTubeMusicScreen({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="h-full w-full bg-[#030303] flex flex-col text-white">
      <div className="bg-gradient-to-b from-[#3a1c1c] via-[#1a0f0f] to-[#030303] px-3 pb-3 pt-[13%] shrink-0">
        <div className="flex items-center justify-between mb-1">
          <ChevronLeft className="w-4 h-4 text-white/90" />
          <SiYoutubemusic className="w-3.5 h-3.5 text-[#FF0000]" />
        </div>
        <div className="flex justify-center">
          <Art
            gradient="from-rose-500 to-red-800"
            className="w-[42%] aspect-square rounded shadow-2xl"
          />
        </div>
        <div className="mt-2 text-[15px] font-bold leading-tight">
          My Playlist
        </div>
        <div className="text-[9px] text-white/60 mt-0.5">
          Playlist &middot; SyncIt &middot; 6 songs
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white text-black text-[9px] font-semibold py-1.5">
            <Play className="w-3 h-3 fill-black" />
            Play
          </div>
          <div className="flex-1 flex items-center justify-center gap-1 rounded-full bg-white/10 text-white text-[9px] font-semibold py-1.5">
            <Shuffle className="w-3 h-3" />
            Shuffle
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 pt-1.5 space-y-2 overflow-hidden">
        {playlistSongs.map((song, index) => (
          <div
            key={`yt-${index}`}
            className={`flex items-center gap-2.5 transition-all duration-500 ${
              index === currentIndex ? "translate-x-8 opacity-0" : "opacity-100"
            }`}
          >
            <Art gradient={song.art} className="w-8 h-8 rounded-sm" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate leading-tight">
                {song.title}
              </div>
              <div className="text-[9px] text-white/60 truncate">
                {song.artist} &middot; {song.plays} plays
              </div>
            </div>
            <MoreVertical className="w-3.5 h-3.5 text-white/50 shrink-0" />
          </div>
        ))}
      </div>

      <TabBar tabs={TABS_YTM} bg="bg-[#030303]" />
    </div>
  );
}

export function AnimatedPhones() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSongIndex((prev) => (prev + 1) % playlistSongs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
      <IPhoneFrame
        className="transform -rotate-6 hover:rotate-0 transition-transform duration-500"
        screenClassName="bg-[#030303]"
      >
        <YouTubeMusicScreen currentIndex={currentSongIndex} />
      </IPhoneFrame>

      {/* Migration Arrow */}
      <div className="z-10 transition-transform duration-500 sm:rotate-0 rotate-90">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#1DB954] to-[#833AB4] rounded-full flex items-center justify-center animate-pulse">
          <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-white transform sm:rotate-0 rotate-90" />
        </div>
      </div>

      <IPhoneFrame
        className="transform rotate-6 hover:rotate-0 transition-transform duration-500"
        screenClassName="bg-[#121212]"
      >
        <SpotifyScreen currentIndex={currentSongIndex} />
      </IPhoneFrame>
    </div>
  );
}
