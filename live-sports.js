"use strict";

const HIGHFLY_MANIFEST_URL = process.env.LIVE_HIGHFLY_MANIFEST_URL
  || "https://sports.highfly.to/3e5a6479-111d-4d6f-99e0-41b76c47841e.8b5a5d20adc80ecc/manifest.json";
const SECONDARY_SPORTS_MANIFEST_URL = process.env.LIVE_SECONDARY_MANIFEST_URL
  || "https://nuviosports.xyz/eyJ0aW1lem9uZSI6IkF1c3RyYWxpYS9TeWRuZXkiLCJzcG9ydHMiOiJmb290YmFsbCxjcmlja2V0IiwicmVwbGF5U291cmNlcyI6ImxpdmV0diJ9/manifest.json";

const LIVE_REFRESH_MS = Number(process.env.LIVE_REFRESH_MS || 35 * 60 * 1000);
const LIVE_EMPTY_RETRY_MS = Number(process.env.LIVE_EMPTY_RETRY_MS || 60 * 1000);
const LIVE_CATALOG_REFRESH_MS = Number(process.env.LIVE_CATALOG_REFRESH_MS || 5 * 60 * 1000);
const LIVE_FETCH_TIMEOUT_MS = Number(process.env.LIVE_FETCH_TIMEOUT_MS || 20000);
const LIVE_CATALOG_PAGE_SIZE = Number(process.env.LIVE_CATALOG_PAGE_SIZE || 100);

const sources = {
  h: {
    baseUrl: manifestBaseUrl(HIGHFLY_MANIFEST_URL),
    type: "sport",
    catalogIds: ["sports_live", "sports_today"],
    keepPreviousOnEmpty: true
  },
  s: {
    baseUrl: manifestBaseUrl(SECONDARY_SPORTS_MANIFEST_URL),
    type: "tv",
    catalogIds: ["nuvio_sports_live", "nuvio_sports_upcoming", "nuvio_sports_networks"],
    keepPreviousOnEmpty: false
  }
};

const catalogCache = new Map();
const streamCache = new Map();
const streamInflight = new Map();

function manifestBaseUrl(manifestUrl) {
  return String(manifestUrl || "")
    .replace(/\/manifest\.json(?:\?.*)?$/i, "")
    .replace(/\/+$/, "");
}

function createManifest(version, logo) {
  return {
    id: "community.doomplug.s.live",
    version,
    name: "LIVE",
    description: "Live football, cricket, and other sports in one Stremio catalog.",
    logo,
    resources: [
      { name: "catalog", types: ["tv"] },
      { name: "meta", types: ["tv"], idPrefixes: ["doomlive:"] },
      { name: "stream", types: ["tv"], idPrefixes: ["doomlive:"] }
    ],
    types: ["tv"],
    idPrefixes: ["doomlive:"],
    catalogs: [{
      type: "tv",
      id: "live_sports",
      name: "LIVE SPORTS",
      extra: [
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    }],
    behaviorHints: { adult: false, p2p: false, configurable: false }
  };
}

function encodeLiveId(source, upstreamId) {
  return `doomlive:${source}:${Buffer.from(String(upstreamId), "utf8").toString("base64url")}`;
}

function decodeLiveId(value) {
  const match = /^doomlive:([hs]):([A-Za-z0-9_-]+)$/.exec(String(value || ""));
  if (!match) return null;
  try {
    const upstreamId = Buffer.from(match[2], "base64url").toString("utf8");
    return upstreamId ? { source: match[1], upstreamId } : null;
  } catch {
    return null;
  }
}

function sourceUrl(source, resource, id) {
  const config = sources[source];
  if (!config) throw new Error("Unknown live source");
  return `${config.baseUrl}/${resource}/${encodeURIComponent(config.type)}/${encodeURIComponent(id)}.json`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "Doom-addon-S-Live/1.0" },
    signal: AbortSignal.timeout(LIVE_FETCH_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  return response.json();
}

function validHttpUrl(value) {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

function isGoogleHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  return host === "google.com"
    || host.endsWith(".google.com")
    || host.endsWith(".googleusercontent.com")
    || host.endsWith(".googleapis.com")
    || host === "goo.gl";
}

function hasBlockedPageMarker(parsed) {
  const pageText = `${parsed.pathname} ${parsed.search}`;
  return /(?:^|[\/_?&=.-])(?:login|log-in|signin|sign-in|account)(?:$|[\/_?&=.-])/i.test(pageText);
}

function hasBlockedLabel(value) {
  return /\b(?:premium|subscribe|upgrade)\b/i.test(String(value || ""));
}

function streamText(stream) {
  return [stream && stream.name, stream && stream.title, stream && stream.description,
    stream && stream.url, stream && stream.externalUrl].filter(Boolean).join("\n");
}

function isPlayableStream(stream) {
  if (!stream || typeof stream !== "object" || hasBlockedLabel(streamText(stream))) return false;
  const parsed = validHttpUrl(stream.url);
  if (!parsed || isGoogleHost(parsed.hostname) || hasBlockedPageMarker(parsed)) return false;
  if (/^tip\s*:/i.test(String(stream.name || "")) || /\/health\/?$/i.test(parsed.pathname)) return false;
  return true;
}

function cleanBehaviorHints(value, liveId) {
  const input = value && typeof value === "object" ? value : {};
  const output = {};
  if (typeof input.notWebReady === "boolean") output.notWebReady = input.notWebReady;
  if (input.proxyHeaders && typeof input.proxyHeaders === "object") output.proxyHeaders = input.proxyHeaders;
  if (input.filename) output.filename = String(input.filename);
  if (input.videoSize) output.videoSize = input.videoSize;
  output.bingeGroup = liveId;
  return output;
}

function cleanCardText(value) {
  return String(value || "")
    .replace(/nuvio\s*(?:live\s*)?sports?/gi, "Doom LIVE")
    .replace(/^[^A-Za-z0-9(]+/, "")
    .replace(/^LIVE\s*:\s*/i, "")
    .trim();
}

function sanitizeStreams(streams, liveId) {
  const seen = new Set();
  return (Array.isArray(streams) ? streams : [])
    .filter(isPlayableStream)
    .filter((stream) => {
      if (seen.has(stream.url)) return false;
      seen.add(stream.url);
      return true;
    })
    .map((stream) => ({
      name: cleanCardText(stream.name) || "Doom LIVE",
      description: cleanCardText(stream.description || stream.title || "Live sports stream"),
      url: stream.url,
      behaviorHints: cleanBehaviorHints(stream.behaviorHints, liveId)
    }));
}

function sanitizeMeta(meta, source) {
  if (!meta || typeof meta !== "object" || !meta.id || !meta.name || hasBlockedLabel(meta.name)) return null;
  const id = encodeLiveId(source, meta.id);
  return {
    id,
    type: "tv",
    name: cleanCardText(meta.name) || "Live Sports",
    poster: meta.poster,
    posterShape: meta.posterShape || "landscape",
    background: meta.background || meta.poster,
    genres: Array.isArray(meta.genres) ? meta.genres.map(String) : [],
    description: cleanCardText(meta.description || "Live sports"),
    releaseInfo: String(meta.releaseInfo || "LIVE"),
    cast: Array.isArray(meta.cast) ? meta.cast.map(String) : undefined,
    released: meta.released,
    behaviorHints: { defaultVideoId: id }
  };
}

async function fetchCatalog(source) {
  const config = sources[source];
  const payloads = await Promise.all(config.catalogIds.map(async (catalogId) => {
    try {
      return await fetchJson(sourceUrl(source, "catalog", catalogId));
    } catch (error) {
      console.error(`[Doom LIVE] Catalog ${catalogId}: ${error.message || error}`);
      return null;
    }
  }));
  const seen = new Set();
  const metas = [];
  for (const payload of payloads) {
    for (const upstreamMeta of payload && Array.isArray(payload.metas) ? payload.metas : []) {
      const meta = sanitizeMeta(upstreamMeta, source);
      if (!meta || seen.has(meta.id)) continue;
      seen.add(meta.id);
      metas.push(meta);
    }
  }
  return metas;
}

async function catalogForSource(source) {
  const now = Date.now();
  const cached = catalogCache.get(source);
  if (cached && now - cached.checkedAt < LIVE_CATALOG_REFRESH_MS) return cached.metas;
  const metas = await fetchCatalog(source);
  if (metas.length > 0) {
    catalogCache.set(source, { metas, checkedAt: now });
    return metas;
  }
  if (cached && sources[source].keepPreviousOnEmpty && cached.metas.length > 0) {
    catalogCache.set(source, { metas: cached.metas, checkedAt: now });
    return cached.metas;
  }
  catalogCache.set(source, { metas: [], checkedAt: now });
  return [];
}

function catalogSearchText(meta) {
  return [meta.name, meta.description, meta.releaseInfo, ...(meta.genres || [])]
    .filter(Boolean).join(" ").toLowerCase();
}

async function getCatalog(extra = {}) {
  const results = await Promise.all([catalogForSource("h"), catalogForSource("s")]);
  let metas = results.flat();
  const search = String(extra.search || "").trim().toLowerCase();
  if (search) metas = metas.filter((meta) => catalogSearchText(meta).includes(search));
  const skip = Math.max(0, Number.parseInt(extra.skip, 10) || 0);
  return metas.slice(skip, skip + LIVE_CATALOG_PAGE_SIZE);
}

async function getMeta(type, id) {
  if (type !== "tv") return null;
  const parsed = decodeLiveId(id);
  if (!parsed) return null;
  const payload = await fetchJson(sourceUrl(parsed.source, "meta", parsed.upstreamId));
  return sanitizeMeta(payload && payload.meta, parsed.source);
}

function streamCacheLifetime(entry) {
  return entry.streams.length > 0 ? LIVE_REFRESH_MS : LIVE_EMPTY_RETRY_MS;
}

async function refreshStreams(parsed, liveId) {
  const key = `${parsed.source}:${parsed.upstreamId}`;
  const previous = streamCache.get(key);
  try {
    const payload = await fetchJson(sourceUrl(parsed.source, "stream", parsed.upstreamId));
    const streams = sanitizeStreams(payload && payload.streams, liveId);
    if (streams.length > 0) {
      streamCache.set(key, { streams, checkedAt: Date.now() });
      return streams;
    }
    if (sources[parsed.source].keepPreviousOnEmpty && previous && previous.streams.length > 0) {
      streamCache.set(key, { streams: previous.streams, checkedAt: Date.now() });
      return previous.streams;
    }
    streamCache.set(key, { streams: [], checkedAt: Date.now() });
    return [];
  } catch (error) {
    console.error(`[Doom LIVE] Stream refresh: ${error.message || error}`);
    if (sources[parsed.source].keepPreviousOnEmpty && previous && previous.streams.length > 0) {
      streamCache.set(key, { streams: previous.streams, checkedAt: Date.now() });
      return previous.streams;
    }
    throw error;
  }
}

async function getStreams(type, id) {
  if (type !== "tv") return null;
  const parsed = decodeLiveId(id);
  if (!parsed) return null;
  const key = `${parsed.source}:${parsed.upstreamId}`;
  const cached = streamCache.get(key);
  if (cached && Date.now() - cached.checkedAt < streamCacheLifetime(cached)) return cached.streams;
  if (streamInflight.has(key)) return streamInflight.get(key);
  const request = refreshStreams(parsed, id).finally(() => streamInflight.delete(key));
  streamInflight.set(key, request);
  return request;
}

function resetCaches() {
  catalogCache.clear();
  streamCache.clear();
  streamInflight.clear();
}

module.exports = {
  createManifest,
  getCatalog,
  getMeta,
  getStreams,
  encodeLiveId,
  decodeLiveId,
  isPlayableStream,
  resetCaches,
  constants: { LIVE_REFRESH_MS, LIVE_EMPTY_RETRY_MS }
};
