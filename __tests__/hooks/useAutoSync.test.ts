/**
 * @file useAutoSync.test.ts
 *
 * Tests for the FREQUENCY_TO_MINUTES constant exported from hooks/useAutoSync.ts.
 * This is a pure data structure — no React renderer or network needed.
 */

import { FREQUENCY_TO_MINUTES } from "@/hooks/useAutoSync";

describe("FREQUENCY_TO_MINUTES", () => {
  it("maps 'hourly' to 60 minutes", () => {
    expect(FREQUENCY_TO_MINUTES["hourly"]).toBe(60);
  });

  it("maps '3hours' to 180 minutes", () => {
    expect(FREQUENCY_TO_MINUTES["3hours"]).toBe(180);
  });

  it("maps 'daily' to 1440 minutes (24 × 60)", () => {
    expect(FREQUENCY_TO_MINUTES["daily"]).toBe(1440);
  });

  it("covers exactly the three options offered in the sync-preferences dialog", () => {
    expect(Object.keys(FREQUENCY_TO_MINUTES)).toEqual([
      "hourly",
      "3hours",
      "daily",
    ]);
  });

  it("all values are positive integers", () => {
    for (const value of Object.values(FREQUENCY_TO_MINUTES)) {
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
    }
  });

  it("values are strictly ascending (hourly < 3hours < daily)", () => {
    const { hourly, "3hours": threeHours, daily } = FREQUENCY_TO_MINUTES;
    expect(hourly).toBeLessThan(threeHours);
    expect(threeHours).toBeLessThan(daily);
  });
});
