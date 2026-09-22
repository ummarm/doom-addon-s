"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { getStreams } = require("../providers/pengu");
const { addonGroups, addonManifests, normalizeStream } = require("../addon");

const manifestUrl = "https://pengu.uk/%7B%22auth_token%22%3A%22test%22%7D/manifest.json";

test("Pengu is included in all three quality groups", () => {
  for (const slug of ["quality-4k", "quality-1080", "quality-low"]) {
    assert.ok(addonGroups[slug].providerIds.includes("pengu"));
    assert.equal(addonManifests[slug].version, "3.0.6");
  }
});

test("Pengu requires a private manifest URL", async () => {
  const previous = process.env.PENGU_MANIFEST_URL;
  delete process.env.PENGU_MANIFEST_URL;
  try {
    assert.deepEqual(await getStreams(null, "movie", null, null, "tt4425200"), []);
  } finally {
    if (previous === undefined) delete process.env.PENGU_MANIFEST_URL;
    else process.env.PENGU_MANIFEST_URL = previous;
  }
});

test("Pengu requests movies and episodes and discards non-playable rows", async () => {
  const previousUrl = process.env.PENGU_MANIFEST_URL;
  const previousFetch = global.fetch;
  const requested = [];
  process.env.PENGU_MANIFEST_URL = manifestUrl;
  global.fetch = async (url) => {
    requested.push(url);
    return {
      ok: true,
      json: async () => ({ streams: [
        { name: "Donate", externalUrl: "https://example.com/donate" },
        { name: "Pengu 1080p", description: "Movie 1080p", url: "https://pengu.uk/direct/external/movie", behaviorHints: { filename: "Movie.1080p.mkv" } },
        { name: "Bad", url: "http://example.com/movie" }
      ] })
    };
  };
  try {
    const movie = await getStreams(null, "movie", null, null, "tt4425200");
    const episode = await getStreams(null, "tv", 1, 2, "tt0944947");
    assert.equal(movie.length, 1);
    assert.equal(episode.length, 1);
    assert.equal(requested[0], `${manifestUrl.slice(0, -"manifest.json".length)}stream/movie/tt4425200.json`);
    assert.equal(requested[1], `${manifestUrl.slice(0, -"manifest.json".length)}stream/series/tt0944947%3A1%3A2.json`);
    const normalized = normalizeStream(movie[0], { id: "pengu", name: "Pengu" }, { title: "Movie" });
    assert.equal(normalized.behaviorHints.doomProviderId, "pengu");
    assert.equal(normalized.behaviorHints.notWebReady, true);
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.PENGU_MANIFEST_URL;
    else process.env.PENGU_MANIFEST_URL = previousUrl;
  }
});
