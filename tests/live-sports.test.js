"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const liveSports = require("../live-sports");

const originalFetch = global.fetch;
const originalDateNow = Date.now;

test.afterEach(() => {
  global.fetch = originalFetch;
  Date.now = originalDateNow;
  liveSports.resetCaches();
});

function response(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload
  };
}

test("LIVE manifest exposes one Stremio-native catalog", () => {
  const manifest = liveSports.createManifest("3.1.1", "https://example.com/logo.png");
  assert.equal(manifest.id, "community.doomplug.s.live");
  assert.equal(manifest.name, "LIVE");
  assert.deepEqual(manifest.types, ["tv"]);
  assert.equal(manifest.catalogs[0].name, "LIVE SPORTS");
  assert.equal(JSON.stringify(manifest).toLowerCase().includes("nuvio"), false);
});

test("live stream validation rejects non-playback and blocked links", () => {
  assert.equal(liveSports.isPlayableStream({ url: "https://video.example/live.m3u8" }), true);
  assert.equal(liveSports.isPlayableStream({ externalUrl: "https://example.com/donate" }), false);
  assert.equal(liveSports.isPlayableStream({ url: "https://accounts.google.com/login" }), false);
  assert.equal(liveSports.isPlayableStream({ url: "https://video.example/account/live.m3u8" }), false);
  assert.equal(liveSports.isPlayableStream({ name: "Premium", url: "https://video.example/live.m3u8" }), false);
  assert.equal(liveSports.isPlayableStream({ name: "Tip: external player", url: "https://video.example/health" }), false);
});

test("catalog combines both sources behind Doom IDs and standard cards", async () => {
  global.fetch = async (url) => {
    if (url.includes("sports.highfly.to")) {
      return response({ metas: [{
        id: "leaf:one",
        type: "sport",
        name: "LIVE: Cricket One",
        poster: "https://img.example/one.jpg",
        description: "Live cricket"
      }] });
    }
    return response({ metas: [{
      id: "source-two",
      type: "tv",
      name: "Nuvio Live Sports: Football Two",
      poster: "https://img.example/two.jpg",
      description: "Nuvio Sports live football",
      team1: { name: "One" },
      _source: "private"
    }] });
  };

  const metas = await liveSports.getCatalog();
  assert.equal(metas.length, 2);
  assert.ok(metas.every((meta) => meta.type === "tv" && meta.id.startsWith("doomlive:")));
  assert.equal(JSON.stringify(metas).toLowerCase().includes("nuvio"), false);
  assert.equal("team1" in metas[1], false);
  assert.equal("_source" in metas[1], false);
});

test("stream responses are sanitized and cached for 35 minutes", async () => {
  let now = 1_000_000;
  let fetchCount = 0;
  Date.now = () => now;
  global.fetch = async () => {
    fetchCount += 1;
    return response({ streams: [
      {
        name: "Nuvio Sports Direct",
        title: "HD English",
        url: "https://video.example/live.m3u8",
        score: 100,
        _source: "hidden",
        behaviorHints: { notWebReady: false, bingeGroup: "upstream" }
      },
      { name: "Support", externalUrl: "https://example.com/donate" },
      { name: "Premium stream", url: "https://video.example/premium.m3u8" }
    ] });
  };

  const id = liveSports.encodeLiveId("s", "match-one");
  const first = await liveSports.getStreams("tv", id);
  assert.equal(first.length, 1);
  assert.deepEqual(Object.keys(first[0]).sort(), ["behaviorHints", "description", "name", "url"]);
  assert.equal(JSON.stringify(first).toLowerCase().includes("nuvio"), false);
  assert.equal(first[0].behaviorHints.bingeGroup, id);

  now += liveSports.constants.LIVE_REFRESH_MS - 1;
  await liveSports.getStreams("tv", id);
  assert.equal(fetchCount, 1);
});

test("empty results retry after one minute and HighFly retains working links", async () => {
  let now = 2_000_000;
  let emptyFetches = 0;
  let highflyFetches = 0;
  Date.now = () => now;
  global.fetch = async (url) => {
    if (url.includes("sports.highfly.to")) {
      highflyFetches += 1;
      return response({ streams: highflyFetches === 1
        ? [{ name: "Live", url: "https://video.example/highfly.m3u8" }]
        : [] });
    }
    emptyFetches += 1;
    return response({ streams: [] });
  };

  const emptyId = liveSports.encodeLiveId("s", "empty-match");
  assert.deepEqual(await liveSports.getStreams("tv", emptyId), []);
  now += liveSports.constants.LIVE_EMPTY_RETRY_MS - 1;
  assert.deepEqual(await liveSports.getStreams("tv", emptyId), []);
  assert.equal(emptyFetches, 1);
  now += 2;
  assert.deepEqual(await liveSports.getStreams("tv", emptyId), []);
  assert.equal(emptyFetches, 2);

  const highflyId = liveSports.encodeLiveId("h", "working-match");
  const first = await liveSports.getStreams("tv", highflyId);
  now += liveSports.constants.LIVE_REFRESH_MS + 1;
  const retained = await liveSports.getStreams("tv", highflyId);
  assert.deepEqual(retained, first);
  assert.equal(highflyFetches, 2);
});
