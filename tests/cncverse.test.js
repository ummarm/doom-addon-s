"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const cncverse = require("../providers/cncverse");
const { addonGroups, addonManifests, normalizeStream, cleanDirectPlaybackStream } = require("../addon");

const originalFetch = global.fetch;

test.afterEach(() => {
  global.fetch = originalFetch;
});

test("CNCVerse is enabled in every quality group", () => {
  for (const slug of ["quality-4k", "quality-1080", "quality-low"]) {
    assert.ok(addonGroups[slug].providerIds.includes("cncverse"));
    assert.equal(addonManifests[slug].version, "3.1.1");
  }
});

test("CNCVerse requests Stremio movie and episode IDs and removes non-stream rows", async () => {
  const requested = [];
  global.fetch = async (url) => {
    requested.push(url);
    return {
      ok: true,
      json: async () => ({
        streams: [
          { name: "Support", externalUrl: "https://example.com/donate" },
          {
            name: "CNCVerse 1080p",
            title: "Movie 1080p English Hindi",
            url: "https://video.example/movie.mkv",
            behaviorHints: { notWebReady: true, filename: "Movie.1080p.mkv" },
            subtitles: [{ id: "english", lang: "eng", url: "https://subs.example/movie.vtt" }]
          },
          { name: "Insecure", url: "http://video.example/movie.mkv" }
        ]
      })
    };
  };

  const movie = await cncverse.getStreams("123", "movie", null, null, "tt4425200");
  const episode = await cncverse.getStreams("456", "tv", 1, 2, "tt0944947");
  assert.equal(movie.length, 1);
  assert.equal(episode.length, 1);
  assert.ok(requested[0].endsWith("/stream/movie/tt4425200.json"));
  assert.ok(requested[1].endsWith("/stream/series/tt0944947%3A1%3A2.json"));
  assert.deepEqual(movie[0].subtitles, [
    { id: "english", lang: "eng", url: "https://subs.example/movie.vtt" }
  ]);
});

test("CNCVerse normalization preserves Stremio MKV and subtitle hints", () => {
  const provider = { id: "cncverse", name: "CNCVerse" };
  const normalized = normalizeStream({
    name: "CNCVerse 4K",
    description: "Example Movie 2026 2160p English Hindi",
    url: "https://video.example/example.mkv",
    behaviorHints: {
      notWebReady: true,
      filename: "Example.Movie.2026.2160p.mkv",
      videoSize: 1000000000
    },
    subtitles: [{ id: "english", lang: "eng", url: "https://subs.example/example.vtt" }]
  }, provider, { title: "Example Movie", year: "2026" });

  assert.equal(normalized.behaviorHints.doomProviderId, "cncverse");
  assert.equal(normalized.behaviorHints.notWebReady, true);
  assert.equal(cleanDirectPlaybackStream(normalized).behaviorHints.notWebReady, true);
  assert.equal(normalized.subtitles.length, 1);
});
