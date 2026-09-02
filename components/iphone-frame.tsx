"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * iPhone 17 mockup frame.
 *
 * Every dimension is a ratio of one variable, `--pw` (the body width), so the
 * frame stays proportionally correct at any size. Ratios are derived from the
 * published iPhone 17 figures:
 *
 *   body      71.5 x 149.6 mm      -> height = width x 2.0923
 *   display   1206 x 2622 px       -> 19.5:9, 6.3"
 *   bezel     ~2.2 mm               -> 3.1% of body width at the sides
 *
 * Corner radii and button placements are close approximations measured off
 * the device silhouette rather than published values — Apple does not
 * document them, and the display uses a continuous corner curve that CSS
 * `border-radius` can only approximate.
 */

const RATIO = {
  /** body height / body width — 149.6 / 71.5 */
  height: 2.0923,
  /** side bezel as a fraction of body width */
  bezelX: 0.031,
  /** top/bottom bezel — slightly tighter than the sides, chosen so the
      resulting screen is exactly 1206:2622 rather than merely close */
  bezelY: 0.0265,
  /** outer corner radius */
  bodyRadius: 0.162,
  /** screen corner radius */
  screenRadius: 0.131,
  /** Dynamic Island: 125 x 36.7 pt on a 1206 pt-wide screen */
  islandWidth: 0.292,
  islandHeight: 0.0855,
  /** island top inset, from the screen top edge */
  islandTop: 0.026,
} as const;

const px = (k: number) => `calc(var(--pw) * ${k})`;

/** Side buttons, positioned as a fraction of body height from the top. */
const BUTTONS = [
  { side: "left", top: 0.152, height: 0.045 }, // Action button
  { side: "left", top: 0.224, height: 0.068 }, // Volume up
  { side: "left", top: 0.302, height: 0.068 }, // Volume down
  { side: "right", top: 0.243, height: 0.106 }, // Side button
  { side: "right", top: 0.402, height: 0.055 }, // Camera Control
] as const;

export function IPhoneFrame({
  children,
  className = "",
  widthClass = "[--pw:216px] sm:[--pw:248px]",
  screenClassName = "",
}: {
  children: ReactNode;
  className?: string;
  /** Sets `--pw`; everything else scales from it. */
  widthClass?: string;
  screenClassName?: string;
}) {
  return (
    <div
      className={`relative shrink-0 ${widthClass} ${className}`}
      style={
        {
          width: "var(--pw)",
          height: px(RATIO.height),
        } as CSSProperties
      }
    >
      {/* Side buttons sit behind the body so only the sliver outside the
          silhouette shows, the way they read on the real device. */}
      {BUTTONS.map((button, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-gradient-to-b from-zinc-500 to-zinc-700 dark:from-zinc-600 dark:to-zinc-800"
          style={{
            top: px(RATIO.height * button.top),
            height: px(RATIO.height * button.height),
            width: px(0.014),
            [button.side]: px(-0.008),
          }}
        />
      ))}

      {/* Titanium band */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-zinc-300 via-zinc-500 to-zinc-400 dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-700 shadow-2xl"
        style={{ borderRadius: px(RATIO.bodyRadius) }}
      >
        {/* Screen */}
        <div
          className={`absolute overflow-hidden bg-black ${screenClassName}`}
          style={{
            top: px(RATIO.bezelY),
            bottom: px(RATIO.bezelY),
            left: px(RATIO.bezelX),
            right: px(RATIO.bezelX),
            borderRadius: px(RATIO.screenRadius),
          }}
        >
          {children}

          {/* Dynamic Island */}
          <div
            aria-hidden="true"
            /* Hairline rim: the island is pure black, so against a near-black
               app screen it would otherwise disappear entirely. */
            className="absolute left-1/2 -translate-x-1/2 bg-black z-20 ring-1 ring-white/[0.07]"
            style={{
              top: px(RATIO.islandTop),
              width: px(RATIO.islandWidth),
              height: px(RATIO.islandHeight),
              borderRadius: px(RATIO.islandHeight / 2),
            }}
          >
            {/* Front camera, right-of-centre inside the island */}
            <span
              className="absolute rounded-full bg-[#0d0d10] ring-1 ring-white/10"
              style={{
                width: px(RATIO.islandHeight * 0.42),
                height: px(RATIO.islandHeight * 0.42),
                right: px(RATIO.islandHeight * 0.28),
                top: px(RATIO.islandHeight * 0.29),
              }}
            />
          </div>

          {/* Bottom scrim: app content taller than the screen would otherwise
              run straight into the home indicator. iOS does the same. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent"
            style={{ height: px(0.1) }}
          />

          {/* Home indicator */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/70 z-20"
            style={{
              bottom: px(0.028),
              width: px(0.33),
              height: px(0.017),
            }}
          />
        </div>
      </div>
    </div>
  );
}
