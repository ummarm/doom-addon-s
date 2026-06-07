"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const TMDB_API_KEY = process.env.TMDB_API_KEY || "439c478a771f35c05022f9feabcca01c";
const DEFAULT_TIMEOUT_MS = Number(process.env.PROVIDER_TIMEOUT_MS || 45000);
const STREAM_PROBE_TIMEOUT_MS = Number(process.env.STREAM_PROBE_TIMEOUT_MS || 8000);
const STREAM_PROBE_CONCURRENCY = Number(process.env.STREAM_PROBE_CONCURRENCY || 6);
const STREAM_CACHE_TTL_MS = Number(process.env.STREAM_CACHE_TTL_MS || 10 * 60 * 1000);
const STREAM_CACHE_MAX_ENTRIES = Number(process.env.STREAM_CACHE_MAX_ENTRIES || 100);
const STREAM_FAST_PROVIDER_WAIT_MS = Number(process.env.STREAM_FAST_PROVIDER_WAIT_MS || 25000);
const STREAM_FAST_PROBE_TIMEOUT_MS = Number(process.env.STREAM_FAST_PROBE_TIMEOUT_MS || 2500);
const MEDIAFUSION_PROBE_TIMEOUT_MS = Number(process.env.MEDIAFUSION_PROBE_TIMEOUT_MS || 8000);

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const providerRegistry = JSON.parse(fs.readFileSync(path.join(ROOT, "providers.json"), "utf8"));

const providerEntries = providerRegistry.scrapers
  .filter((provider) => provider.enabled)
  .map((provider) => ({
    id: provider.id,
    name: provider.name,
    modulePath: path.join(ROOT, provider.filename),
    getStreams: null
  }));
const addonGroups = {
  murph: {
    name: "Umbrella M",
    providerIds: ["4khdhub_murph", "hdhub4u_murph", "moviebox_murph", "movies4u_murph"]
  },
  yoruix: {
    name: "Umbrella Y",
    providerIds: [
      "4khdhub_yoruix",
      "hdhub4u_yoruix",
      "moviebox_yoruix",
      "netmirror_yoruix",
      "uhdmovies_yoruix",
      "movieblast_yoruix"
    ]
  },
  d3adlyrocket: {
    name: "Umbrella D",
    providerIds: [
      "4khdhub",
      "4khdhubtv",
      "hdhub4u",
      "hindmoviez",
      "movieblast",
      "movieboxhindi",
      "moviebox",
      "movies4u",
      "moviesdrive",
      "netmirror",
      "peachify",
      "vegamovies",
      "vidlink",
      "streamflix",
      "uhdmovies",
      "4khdhubnew"
    ]
  },
  flixnest: {
    name: "Umbrella F",
    providerIds: [
      "flix_streams_emby",
      "flix_streams_mkvcinemas",
      "flix_streams_lotusvault",
      "flix_streams_archivevault",
      "flix_streams_uhdmovies",
      "flix_streams_4khdhub",
      "flix_streams_hdhub4u",
      "flix_streams_debridvault",
      "flix_streams_other",
      "flix_streams_vegamovies"
    ]
  },
  webstreamrmbg: {
    name: "Umbrella W",
    providerIds: ["webstreamrmbg"]
  },
  mediafusion: {
    name: "Umbrella MF",
    providerIds: ["mediafusion"]
  },
  aiostreams: {
    name: "Umbrella AIO",
    providerIds: ["aiostreams"]
  },
  "quality-4k": {
    name: "Umbrella 4K",
    providerIds: providerEntries.map((provider) => provider.id),
    qualityBand: "4k"
  },
  "quality-1080": {
    name: "Umbrella 1080",
    providerIds: providerEntries.map((provider) => provider.id),
    qualityBand: "1080"
  },
  "quality-low": {
    name: "Umbrella Low",
    providerIds: providerEntries.map((provider) => provider.id),
    qualityBand: "low"
  }
};
const addonGroupEntries = Object.fromEntries(
  Object.entries(addonGroups).map(([slug, group]) => [
    slug,
    providerEntries.filter((provider) => group.providerIds.includes(provider.id))
  ])
);
const addonManifests = Object.fromEntries(
  Object.entries(addonGroups).map(([slug, group]) => [
    slug,
    Object.assign({}, manifest, {
      id: `${manifest.id}.${slug}`,
      name: group.name,
      description: slug === "mediafusion"
        ? `${group.name} provider group for Doom-addon. Passes MediaFusion streams through with Hindi/English detection, blocked source-tag filtering, cached/playable placeholder rejection, and Hindi-first quality/size sorting.`
        : slug === "aiostreams"
          ? `${group.name} provider group for Doom-addon. Passes AIOStreams streams through without Umbrella formatting or extra filtering.`
          : group.qualityBand
            ? `${group.name} quality group for Doom-addon. Uses all enabled providers and keeps the main add-on rules, with streams routed by quality.`
            : `${group.name} provider group for Doom-addon. Uses the same Umbrella formatting, filtering, sorting, and playable checks as the main add-on.`
    })
  ])
);
const streamCache = new Map();
const streamInflight = new Map();
const passthroughProviderIds = new Set(["mediafusion", "aiostreams"]);
const passthroughStreams = new WeakSet();

function loadProvider(provider) {
  if (!provider.getStreams) {
    provider.getStreams = require(provider.modulePath).getStreams;
  }

  if (typeof provider.getStreams !== "function") {
    throw new Error(`${provider.name} does not export getStreams`);
  }

  return provider.getStreams;
}

function isPassthroughProvider(provider) {
  return Boolean(provider && passthroughProviderIds.has(provider.id));
}

function markPassthroughStream(stream) {
  if (stream && typeof stream === "object") {
    passthroughStreams.add(stream);
  }
  return stream;
}

function isPassthroughStream(stream) {
  return Boolean(stream && typeof stream === "object" && passthroughStreams.has(stream));
}

function mediaFusionStreamText(stream) {
  const behaviorHints = stream && stream.behaviorHints;
  return [
    stream && stream.name,
    stream && stream.title,
    stream && stream.description,
    behaviorHints && behaviorHints.filename,
    behaviorHints && behaviorHints.bingeGroup
  ].filter(Boolean).join("\n");
}

function hasBlockedMediaFusionTag(stream) {
  return /(^|[^a-z0-9])(?:hdtc|hdts|telesync|telecine|telecne|tele)([^a-z0-9]|$)/i
    .test(mediaFusionStreamText(stream));
}

function hasAllowedMediaFusionLanguage(stream) {
  const text = mediaFusionStreamText(stream);
  return /\b(?:hindi|hin|english|eng)\b/i.test(text);
}

function hasAllowedPassthroughLanguage(stream) {
  const text = mediaFusionStreamText(stream);
  return /\b(?:hindi|hin|english|eng)\b/i.test(text)
    || /🇮🇳|🇬🇧|🇺🇸/.test(text);
}

function reportedResponseSize(response) {
  const contentRange = response.headers.get("content-range") || "";
  const rangeMatch = contentRange.match(/\/(\d+)\s*$/);
  if (rangeMatch) {
    return Number(rangeMatch[1]) || 0;
  }

  const contentLength = Number(response.headers.get("content-length") || 0);
  return response.status === 200 && Number.isFinite(contentLength) ? contentLength : 0;
}

function isMediaFusionPlaceholder(response, stream) {
  const expectedSize = streamSizeBytes(stream);
  const reportedSize = reportedResponseSize(response);
  if (!expectedSize || !reportedSize) {
    return false;
  }

  return expectedSize > 50 * 1024 * 1024
    && reportedSize < Math.min(expectedSize * 0.1, 50 * 1024 * 1024);
}

async function probeMediaFusionStream(stream) {
  const headers = Object.assign({}, streamRequestHeaders(stream), { Range: "bytes=0-4095" });
  const response = await withTimeout(
    fetch(stream.url, {
      method: "GET",
      headers,
      redirect: "follow"
    }),
    MEDIAFUSION_PROBE_TIMEOUT_MS,
    `${stream.name || "MediaFusion stream"} probe`
  );
  const sample = await responseSample(response);
  if (isMediaFusionPlaceholder(response, stream)) {
    return { ok: false, reason: "placeholder or downloading response" };
  }

  const probe = responseProbeResult(response, stream.url, sample);
  return probe.ok ? { ok: true } : { ok: false, reason: `HTTP ${response.status}` };
}

async function filterMediaFusionStreams(streams) {
  const filtered = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < streams.length) {
      const stream = streams[nextIndex];
      nextIndex += 1;
      try {
        const probe = await probeMediaFusionStream(stream);
        if (probe.ok) {
          filtered.push(stream);
        } else {
          console.log(`[MediaFusion] Rejected unplayable/cache-miss stream: ${stream.name || stream.title || stream.url} (${probe.reason})`);
        }
      } catch (error) {
        console.log(`[MediaFusion] Rejected unverifiable stream: ${stream.name || stream.title || stream.url} (${error.message || error})`);
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(STREAM_PROBE_CONCURRENCY, streams.length) },
    () => worker()
  );
  await Promise.all(workers);
  return filtered;
}

function streamCacheKey(type, id, scope = "main") {
  return `${scope}:${type}:${id}`;
}

function cachedStreams(key) {
  const entry = streamCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.timestamp > STREAM_CACHE_TTL_MS) {
    streamCache.delete(key);
    return null;
  }
  return entry.streams.slice();
}

function rememberStreams(key, streams) {
  if (!Array.isArray(streams) || streams.length === 0 || STREAM_CACHE_TTL_MS <= 0) {
    return;
  }

  streamCache.set(key, {
    timestamp: Date.now(),
    streams: streams.slice()
  });

  while (streamCache.size > STREAM_CACHE_MAX_ENTRIES) {
    const oldestKey = streamCache.keys().next().value;
    streamCache.delete(oldestKey);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseStremioId(type, id) {
  const parts = String(id || "").split(":");
  const imdbId = parts[0];

  if (!/^tt\d+$/i.test(imdbId)) {
    return null;
  }

  if (type === "series") {
    const season = Number(parts[1]);
    const episode = Number(parts[2]);
    if (!Number.isInteger(season) || !Number.isInteger(episode)) {
      return null;
    }
    return { imdbId, type: "series", mediaType: "tv", season, episode };
  }

  if (type === "movie") {
    return { imdbId, type: "movie", mediaType: "movie", season: null, episode: null };
  }

  return null;
}

async function resolveTmdbId(imdbId, mediaType) {
  const resultsKey = mediaType === "tv" ? "tv_results" : "movie_results";
  const url = new URL(`https://api.themoviedb.org/3/find/${encodeURIComponent(imdbId)}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("external_source", "imdb_id");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Doom-addon Stremio Addon"
    }
  });

  if (!response.ok) {
    throw new Error(`TMDB lookup failed with ${response.status}`);
  }

  const payload = await response.json();
  const match = payload[resultsKey] && payload[resultsKey][0];
  return match ? String(match.id) : null;
}

async function resolveMediaInfo(tmdbId, mediaType) {
  const endpoint = mediaType === "tv" ? "tv" : "movie";
  const url = new URL(`https://api.themoviedb.org/3/${endpoint}/${encodeURIComponent(tmdbId)}`);
  url.searchParams.set("api_key", TMDB_API_KEY);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Doom-addon Stremio Addon"
    }
  });

  if (!response.ok) {
    throw new Error(`TMDB detail lookup failed with ${response.status}`);
  }

  const payload = await response.json();
  const title = mediaType === "tv" ? payload.name : payload.title;
  const originalTitle = mediaType === "tv" ? payload.original_name : payload.original_title;
  const date = mediaType === "tv" ? payload.first_air_date : payload.release_date;
  return {
    title: title || originalTitle || "",
    originalTitle: originalTitle || title || "",
    year: date ? String(date).slice(0, 4) : ""
  };
}

function qualityRank(value) {
  const text = String(value || "").toLowerCase();
  if (/\b(?:remux|uhd)\b/.test(text)) return 5;
  if (/\b2160p?\b/.test(text) || /(^|[^a-z0-9])4k([^a-z0-9]|$)/.test(text)) return 5;
  if (/\b1440p?\b/.test(text) || /(^|[^a-z0-9])2k([^a-z0-9]|$)/.test(text)) return 4;
  if (/\b1080p?\b/.test(text)) return 3;
  if (/\b720p?\b/.test(text)) return 2;
  if (/\b480p?\b/.test(text)) return 1;
  return 0;
}

function qualityEvidenceText(value) {
  return String(value || "")
    .split(/\r?\n/)
    .filter((line) => !/^\s*⚡/.test(line) && !/\b(?:Darth Vader|Murph Streams)\s+-\s+/i.test(line))
    .join(" ");
}

function streamQualityText(stream) {
  const behaviorHints = stream && stream.behaviorHints;
  return [
    qualityEvidenceText(stream && stream.name),
    qualityEvidenceText(stream && stream.title),
    qualityEvidenceText(stream && stream.description),
    stream && stream.quality,
    behaviorHints && behaviorHints.filename,
    behaviorHints && behaviorHints.bingeGroup
  ].filter(Boolean).join(" ");
}

function streamQualityRank(stream) {
  const behaviorHints = stream && stream.behaviorHints;
  const primaryText = [
    qualityEvidenceText(stream && stream.name),
    stream && stream.quality
  ].filter(Boolean).join(" ");
  const primaryRank = qualityRank(primaryText);
  if (primaryRank) {
    return primaryRank;
  }

  const filenameRank = qualityRank(behaviorHints && behaviorHints.filename);
  if (filenameRank) {
    return filenameRank;
  }

  return qualityRank(streamQualityText(stream));
}

function streamQualityBand(stream) {
  const text = streamQualityText(stream);
  const rank = streamQualityRank(stream);
  if (rank >= 5 || /\b(?:remux|uhd)\b/i.test(text)) {
    return "4k";
  }
  if (rank === 3) {
    return "1080";
  }
  if (rank > 0 || /\b(?:720p|720|480p|480|360p|360|240p|240|144p|144)\b/i.test(text)) {
    return "low";
  }
  return "1080";
}

function filterStreamsByQualityBand(streams, qualityBand) {
  if (!qualityBand) {
    return streams;
  }
  return streams.filter((stream) => streamQualityBand(stream) === qualityBand);
}

function normalizeHeaders(headers) {
  if (!headers || typeof headers !== "object") {
    return null;
  }

  return Object.fromEntries(
    Object.entries(headers)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)])
  );
}

function looksWebReady(url) {
  return /^https:\/\//i.test(url) && /\.mp4(?:[?#].*)?$/i.test(url);
}

function looksLikeHls(url, contentType = "") {
  const normalizedUrl = String(url || "").toLowerCase();
  const normalizedType = String(contentType || "").toLowerCase();
  return normalizedUrl.includes(".m3u8")
    || normalizedType.includes("mpegurl")
    || normalizedType.includes("application/x-mpegurl")
    || normalizedType.includes("vnd.apple.mpegurl");
}

function isKnownClientBoundUrl(url) {
  try {
    const parsed = new URL(url);
    return /^ddl\d*$/i.test(parsed.hostname.split(".")[0] || "")
      && parsed.hostname.toLowerCase().endsWith(".workers.dev");
  } catch {
    return false;
  }
}

function isBlockedNavigationUrl(url) {
  try {
    const parsed = new URL(url);
    const text = `${parsed.hostname} ${parsed.pathname} ${parsed.search}`.toLowerCase();
    return /\b(?:login|logout|signin|signup|register|captcha|account)\b/.test(text);
  } catch {
    return true;
  }
}

function isDirectMediaUrl(url) {
  try {
    const parsed = new URL(url);
    if (!/^https?:$/i.test(parsed.protocol)) {
      return false;
    }
    return /\.(?:mp4|mkv|m4v|webm|avi|m3u8|ts)(?:$|[?#])/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function looksLikeErrorDocument(contentType, sampleText = "") {
  const normalizedType = String(contentType || "").toLowerCase();
  const sample = String(sampleText || "").trim().slice(0, 256).toLowerCase();
  return normalizedType.includes("text/html")
    || normalizedType.includes("application/json")
    || normalizedType.includes("text/plain")
    || normalizedType.includes("xml")
    || sample.startsWith("<!doctype")
    || sample.startsWith("<html")
    || sample.startsWith("{")
    || sample.includes("<title>error")
    || sample.includes("cloudflare")
    || sample.includes("access denied")
    || sample.includes("not found")
    || sample.includes("invalid link")
    || sample.includes("generate link again")
    || sample.includes("link expired");
}

function hasBoxSignature(sampleBuffer, signature) {
  if (!sampleBuffer || sampleBuffer.length < 12) {
    return false;
  }
  return sampleBuffer.includes(Buffer.from(signature), 4);
}

function looksLikeMediaBytes(url, contentType, sampleBuffer) {
  if (!sampleBuffer || sampleBuffer.length < 4) {
    return false;
  }

  const normalizedUrl = String(url || "").toLowerCase();
  const normalizedType = String(contentType || "").toLowerCase();
  const startsWith = (hex) => sampleBuffer.subarray(0, hex.length / 2).equals(Buffer.from(hex, "hex"));

  if (startsWith("1a45dfa3")) {
    return true;
  }
  if (hasBoxSignature(sampleBuffer, "ftyp") || hasBoxSignature(sampleBuffer, "styp")) {
    return true;
  }
  if (sampleBuffer[0] === 0x47 && (sampleBuffer.length < 189 || sampleBuffer[188] === 0x47)) {
    return true;
  }
  if (sampleBuffer.subarray(0, 4).toString("ascii") === "RIFF" && sampleBuffer.subarray(8, 12).toString("ascii") === "AVI ") {
    return true;
  }

  const expectsKnownContainer = /\.(?:mkv|webm|mp4|m4v|ts|avi)(?:$|[?#])/i.test(normalizedUrl)
    || normalizedType.includes("matroska")
    || normalizedType.includes("webm")
    || normalizedType.includes("mp4")
    || normalizedType.includes("video/mp2t")
    || normalizedType.includes("avi");
  return !expectsKnownContainer && normalizedType.startsWith("video/");
}

function responseProbeResult(response, url, sample = {}, options = {}) {
  if (!response || !response.ok) {
    return { ok: false };
  }

  const contentType = response.headers.get("content-type") || "";
  const sampleText = sample.text || "";
  const sampleBuffer = sample.buffer || Buffer.alloc(0);
  if (looksLikeHls(url, contentType)) {
    return { ok: !sampleText || sampleText.includes("#EXTM3U") };
  }

  if (looksLikeErrorDocument(contentType, sampleText)) {
    return { ok: false };
  }

  const acceptRanges = response.headers.get("accept-ranges") || "";
  const contentRange = response.headers.get("content-range") || "";
  const contentLength = Number(response.headers.get("content-length") || 0);
  const mediaBytesOk = looksLikeMediaBytes(url, contentType, sampleBuffer);
  const seekable = response.status === 206
    || /bytes/i.test(acceptRanges)
    || /^bytes\s+/i.test(contentRange);
  return {
    ok: mediaBytesOk && (options.requireSeekable ? seekable : (response.status === 200 && contentLength > 0) || seekable)
  };
}

function contentRangeStart(response) {
  const contentRange = response && response.headers && response.headers.get("content-range");
  const match = String(contentRange || "").match(/^bytes\s+(\d+)-/i);
  if (!match) {
    return -1;
  }
  const start = Number(match[1]);
  return Number.isFinite(start) ? start : -1;
}

function hardSeekOffset(stream) {
  const size = streamSizeBytes(stream);
  const minimumOffset = 1024 * 1024;
  if (size > minimumOffset * 2) {
    return Math.min(size - 4096, Math.max(minimumOffset, Math.floor(size * 0.35)));
  }
  return minimumOffset;
}

function hardSeekProbeResult(response, url, sample = {}, offset = 0) {
  if (!response || !response.ok) {
    return { ok: false };
  }

  const contentType = response.headers.get("content-type") || "";
  const sampleText = sample.text || "";
  const sampleBuffer = sample.buffer || Buffer.alloc(0);
  if (looksLikeHls(url, contentType)) {
    return { ok: !sampleText || sampleText.includes("#EXTM3U") };
  }
  if (looksLikeErrorDocument(contentType, sampleText)) {
    return { ok: false };
  }
  if (response.status !== 206) {
    return { ok: false };
  }

  const rangeStart = contentRangeStart(response);
  return { ok: rangeStart === offset && sampleBuffer.length > 0 };
}

function streamRequestHeaders(stream) {
  const proxyHeaders = stream.behaviorHints
    && stream.behaviorHints.proxyHeaders
    && stream.behaviorHints.proxyHeaders.request;
  return normalizeHeaders(proxyHeaders) || {};
}

async function responseSample(response) {
  if (!response.body || typeof response.body.getReader !== "function") {
    return { buffer: Buffer.alloc(0), text: "" };
  }

  const reader = response.body.getReader();
  try {
    const chunk = await reader.read();
    if (!chunk.value) {
      return { buffer: Buffer.alloc(0), text: "" };
    }
    const buffer = Buffer.from(chunk.value).slice(0, 512);
    return { buffer, text: buffer.toString("utf8") };
  } finally {
    await reader.cancel().catch(() => {});
  }
}

function streamRequiresProbe(stream) {
  return Boolean(stream.behaviorHints && [
    "4khdhubnew",
    "4khdhub_yoruix",
    "hdhub4u",
    "hdhub4u_yoruix",
    "hdhub4u_murph",
    "movieblast_yoruix",
    "moviebox_yoruix",
    "peachify",
    "vegamovies",
    "uhdmovies_yoruix",
    "vidlink",
    "webstreamrmbg",
    "flix_streams_emby",
    "flix_streams_lotusvault",
    "flix_streams_debridvault"
  ].includes(stream.behaviorHints.doomProviderId));
}

function isFastAcceptableStream(stream) {
  return (/^https:\/\//i.test(stream.url || "") || isDirectMediaUrl(stream.url || ""))
    && !isKnownClientBoundUrl(stream.url)
    && !isBlockedNavigationUrl(stream.url);
}

async function probeStream(stream, options = {}) {
  if (isKnownClientBoundUrl(stream.url)) {
    return { ok: false };
  }

  const timeoutMs = options.timeoutMs || STREAM_PROBE_TIMEOUT_MS;
  const requireSeekable = streamRequiresProbe(stream);
  const headers = streamRequestHeaders(stream);
  const isHls = looksLikeHls(stream.url);
  const rangedHeaders = Object.assign({}, headers);
  if (!isHls && !rangedHeaders.Range && !rangedHeaders.range) {
    rangedHeaders.Range = "bytes=0-4095";
  }

  const getResponse = await withTimeout(
    fetch(stream.url, {
      method: "GET",
      headers: isHls ? headers : rangedHeaders,
      redirect: "follow"
    }),
    timeoutMs,
    `${stream.name} probe`
  );
  const sample = await responseSample(getResponse);
  const getProbe = responseProbeResult(getResponse, stream.url, sample, { requireSeekable });
  if (getProbe.ok) {
    if (requireSeekable && !isHls) {
      const offset = hardSeekOffset(stream);
      const seekHeaders = Object.assign({}, headers, { Range: `bytes=${offset}-${offset + 4095}` });
      const seekResponse = await withTimeout(
        fetch(stream.url, {
          method: "GET",
          headers: seekHeaders,
          redirect: "follow"
        }),
        timeoutMs,
        `${stream.name} seek probe`
      );
      const seekSample = await responseSample(seekResponse);
      return hardSeekProbeResult(seekResponse, stream.url, seekSample, offset);
    }
    return getProbe;
  }

  if (requireSeekable) {
    return { ok: false };
  }

  const headResponse = await withTimeout(
    fetch(stream.url, {
      method: "HEAD",
      headers,
      redirect: "follow"
    }),
    timeoutMs,
    `${stream.name} head probe`
  );
  return responseProbeResult(headResponse, stream.url, {}, { requireSeekable });
}

async function filterPlayableStreams(streams, options = {}) {
  const filtered = [];
  let nextIndex = 0;
  const probeOnlyRequired = Boolean(options.probeOnlyRequired);
  const probeTimeoutMs = options.probeTimeoutMs || STREAM_PROBE_TIMEOUT_MS;

  async function worker() {
    while (nextIndex < streams.length) {
      const stream = streams[nextIndex];
      nextIndex += 1;
      try {
        if (probeOnlyRequired && !streamRequiresProbe(stream)) {
          if (isFastAcceptableStream(stream)) {
            filtered.push(stream);
          } else {
            console.log(`[Stream probe] Rejected unlikely source: ${stream.name}`);
          }
          continue;
        }

        const probe = await probeStream(stream, { timeoutMs: probeTimeoutMs });
        if (probe.ok) {
          filtered.push(stream);
        } else {
          console.log(`[Stream probe] Rejected unplayable source: ${stream.name}`);
        }
      } catch (error) {
        console.log(`[Stream probe] Rejected ${stream.name}: ${error.message || error}`);
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(STREAM_PROBE_CONCURRENCY, streams.length) },
    () => worker()
  );
  await Promise.all(workers);
  return filtered;
}

const UMBRELLA_PROVIDER_CODES = {
  "4khdhub": "4KHH DR",
  "4khdhubnew": "4KHHN DR",
  "4khdhubtv": "4KHH DR",
  "4khdhub_yoruix": "4KHH Y",
  "4khdhub_murph": "4KHH M",
  "hdhub4u": "HDHU DR",
  "hdhub4u_murph": "HDHU M",
  "hdhub4u_yoruix": "HDHU Y",
  "flix_streams_emby": "EMB",
  "flix_streams_mkvcinemas": "MKV",
  "flix_streams_lotusvault": "LV",
  "flix_streams_archivevault": "AV",
  "flix_streams_uhdmovies": "UHD",
  "flix_streams_4khdhub": "4KHH F",
  "flix_streams_hdhub4u": "HDHU F",
  "flix_streams_debridvault": "DBV F",
  "flix_streams_other": "FLX",
  "flix_streams_vegamovies": "VG",
  "webstreamrmbg": "WSM",
  "mediafusion": "MF",
  "hindmoviez": "HM",
  "movieblast": "MBL",
  "movieblast_yoruix": "MBL Y",
  "moviebox": "MB",
  "movieboxhindi": "MBH DR",
  "moviebox_yoruix": "MB Y",
  "moviebox_murph": "MB M",
  "moviesdrive": "MD",
  "movies4u": "M4U DR",
  "movies4u_murph": "M4U M",
  "netmirror": "NM",
  "netmirror_yoruix": "NM Y",
  "peachify": "PF",
  "vegamovies": "VG DR",
  "vidlink": "VL DR",
  "streamflix": "SF",
  "uhdmovies": "UHD DR",
  "uhdmovies_yoruix": "UHD Y"
};
const DETAIL_PROVIDER_CODES = Object.assign({}, UMBRELLA_PROVIDER_CODES, {
  "flix_streams_mkvcinemas": "MKV Direct"
});
const KNOWN_AUDIO_LABELS = ["Hindi", "Tamil", "Telugu", "English", "Malayalam", "Kannada", "Punjabi"];
const SOURCE_DETAIL_NAMES = {
  "4khdhub": "Darth Vader",
  "4khdhubnew": "Darth Vader",
  "4khdhubtv": "Darth Vader",
  "4khdhub_yoruix": "Darth Vader",
  "4khdhub_murph": "Murph Streams",
  "hdhub4u": "Darth Vader",
  "hdhub4u_murph": "Murph Streams",
  "hdhub4u_yoruix": "Darth Vader",
  "flix_streams_emby": "Darth Vader",
  "flix_streams_mkvcinemas": "Darth Vader",
  "flix_streams_lotusvault": "Darth Vader",
  "flix_streams_archivevault": "Darth Vader",
  "flix_streams_uhdmovies": "Darth Vader",
  "flix_streams_4khdhub": "Darth Vader",
  "flix_streams_hdhub4u": "Darth Vader",
  "flix_streams_debridvault": "Darth Vader",
  "flix_streams_other": "Darth Vader",
  "flix_streams_vegamovies": "Darth Vader",
  "webstreamrmbg": "Darth Vader",
  "mediafusion": "Darth Vader",
  "hindmoviez": "Darth Vader",
  "movieblast": "Darth Vader",
  "movieblast_yoruix": "Darth Vader",
  "moviebox": "Darth Vader",
  "movieboxhindi": "Darth Vader",
  "moviebox_yoruix": "Darth Vader",
  "moviebox_murph": "Murph Streams",
  "moviesdrive": "Darth Vader",
  "movies4u": "Darth Vader",
  "movies4u_murph": "Murph Streams",
  "netmirror": "Darth Vader",
  "netmirror_yoruix": "Darth Vader",
  "peachify": "Darth Vader",
  "vegamovies": "Darth Vader",
  "vidlink": "Darth Vader",
  "streamflix": "Darth Vader",
  "uhdmovies": "Darth Vader",
  "uhdmovies_yoruix": "Darth Vader"
};

function parseSizeToBytes(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  const match = String(value || "").match(/([\d.]+)\s*(tb|gb|mb|kb|bytes|byte|b)\b/i);
  if (!match) {
    return 0;
  }

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  const unit = match[2].toLowerCase();
  const multipliers = {
    tb: 1024 ** 4,
    gb: 1024 ** 3,
    mb: 1024 ** 2,
    kb: 1024,
    bytes: 1,
    byte: 1,
    b: 1
  };
  return Math.round(amount * multipliers[unit]);
}

function streamSizeBytes(stream) {
  if (!stream || typeof stream !== "object") {
    return 0;
  }

  return parseSizeToBytes(stream.behaviorHints && stream.behaviorHints.videoSize)
    || parseSizeToBytes(stream.videoSize)
    || parseSizeToBytes(stream.size)
    || parseSizeToBytes(stream.description)
    || parseSizeToBytes(stream.title)
    || parseSizeToBytes(stream.name);
}

function hasHindiLanguage(stream) {
  const behaviorHints = stream && stream.behaviorHints;
  const text = [
    stream && stream.name,
    stream && stream.title,
    stream && stream.description,
    stream && stream.language,
    stream && stream.languages,
    behaviorHints && behaviorHints.filename,
    behaviorHints && behaviorHints.bingeGroup
  ].filter(Boolean).join(" ");

  return /\b(?:hindi|hin)\b/i.test(text);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  const gb = bytes / (1024 ** 3);
  if (gb >= 1) {
    return `${gb.toFixed(gb >= 10 ? 1 : 2).replace(/(\.\d*[1-9])0+$/, "$1").replace(/\.0+$/, "")}GB`;
  }

  const mb = bytes / (1024 ** 2);
  if (mb >= 1) {
    return `${mb.toFixed(mb >= 10 ? 0 : 1).replace(/(\.\d*[1-9])0+$/, "$1").replace(/\.0+$/, "")}MB`;
  }

  return `${Math.round(bytes / 1024)}KB`;
}

function firstMatch(text, pattern) {
  const match = String(text || "").match(pattern);
  return match ? match[1] || match[0] : "";
}

function cleanDetailText(value) {
  return String(value || "")
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMatchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MATCH_STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "by", "for", "from", "in", "into", "is", "it", "of", "on", "or", "part", "the", "to", "with"
]);

const STREAM_DETAIL_IGNORE_WORDS = new Set([
  "aac", "ac3", "amzn", "atmos", "audio", "avc", "bluray", "brrip", "cam", "ddp", "dd", "download", "darth", "dts",
  "dual", "dv", "dvd", "dvdrip", "eac3", "english", "esub", "file", "gb", "h264", "h265", "hd", "hdr", "hdrip",
  "hdhub4u", "hevc", "hindi", "hubcloud", "kbps", "mb", "mkv", "mkvcinemas", "cinemas", "moviebox", "multi",
  "original", "punjabi", "remux", "rip", "server", "stream", "tamil", "telugu", "truehd", "vader",
  "web", "webdl", "webrip", "x264", "x265", "lotusvault", "archivevault", "uhdmovies", "container"
]);

function titleTokens(value) {
  return normalizeMatchText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !MATCH_STOP_WORDS.has(token));
}

function streamEvidenceTokens(value) {
  return normalizeMatchText(value)
    .split(" ")
    .filter((token) => {
      if (token.length <= 2 || MATCH_STOP_WORDS.has(token) || STREAM_DETAIL_IGNORE_WORDS.has(token)) return false;
      if (/^\d+$/.test(token)) return false;
      if (/^(?:2160p?|1080p?|720p?|480p?|360p?|10bit|8bit)$/.test(token)) return false;
      return true;
    });
}

function streamMediaEvidence(stream) {
  return [
    stream.behaviorHints && stream.behaviorHints.filename,
    stream.title,
    stream.description
  ].filter(Boolean).join(" ");
}

function textYears(value) {
  return Array.from(new Set(String(value || "").match(/\b(?:19|20|21)\d{2}\b/g) || []));
}

function hasDifferentMovieYear(evidence, mediaInfo, parsed) {
  if (!parsed || parsed.type !== "movie" || !mediaInfo || !mediaInfo.year) {
    return false;
  }

  const years = textYears(evidence);
  return years.length > 0 && !years.includes(mediaInfo.year);
}

function requiredTitleMatches(expectedTokenCount) {
  if (expectedTokenCount <= 1) return expectedTokenCount;
  if (expectedTokenCount <= 3) return 2;
  return Math.min(expectedTokenCount, Math.ceil(expectedTokenCount * 0.5));
}

function hasExpectedEpisode(text, parsed) {
  if (!parsed || parsed.type !== "series") {
    return true;
  }

  const normalized = normalizeMatchText(text);
  const season = String(parsed.season);
  const episode = String(parsed.episode);
  const paddedSeason = season.padStart(2, "0");
  const paddedEpisode = episode.padStart(2, "0");
  const expectedPatterns = [
    `s${paddedSeason} e${paddedEpisode}`,
    `s${season} e${episode}`,
    `season ${season} episode ${episode}`,
    `season ${paddedSeason} episode ${paddedEpisode}`
  ];
  if (expectedPatterns.some((pattern) => normalized.includes(pattern))) {
    return true;
  }

  const seasonEpisodeMatch = normalized.match(/\bs\s*0?(\d+)\s*e\s*0?(\d+)\b/);
  if (seasonEpisodeMatch) {
    return Number(seasonEpisodeMatch[1]) === parsed.season && Number(seasonEpisodeMatch[2]) === parsed.episode;
  }

  return true;
}

function matchesRequestedMedia(stream, mediaInfo, parsed) {
  if (!mediaInfo || !mediaInfo.title) {
    return true;
  }

  const evidence = streamMediaEvidence(stream);
  if (!evidence) {
    return true;
  }
  if (!hasExpectedEpisode(evidence, parsed)) {
    return false;
  }

  const expectedTokens = Array.from(new Set([
    ...titleTokens(mediaInfo.title),
    ...titleTokens(mediaInfo.originalTitle)
  ]));
  if (expectedTokens.length === 0) {
    return true;
  }

  const normalizedEvidence = normalizeMatchText(evidence);
  const evidenceTokens = streamEvidenceTokens(evidence);
  if (hasDifferentMovieYear(normalizedEvidence, mediaInfo, parsed)) {
    return false;
  }

  const matchedTokens = expectedTokens.filter((token) => normalizedEvidence.includes(token));
  const requiredMatches = requiredTitleMatches(expectedTokens.length);

  if (expectedTokens.length === 1) {
    const token = expectedTokens[0];
    const hasExactToken = normalizedEvidence.split(" ").includes(token);
    if (!hasExactToken) {
      return false;
    }
    if (mediaInfo.year && normalizedEvidence.includes(mediaInfo.year)) {
      return true;
    }

    const extraTitleTokens = evidenceTokens.filter((evidenceToken) => evidenceToken !== token);
    return extraTitleTokens.length === 0;
  }

  if (matchedTokens.length >= requiredMatches) {
    return true;
  }

  if (matchedTokens.length > 0 && mediaInfo.year && normalizedEvidence.includes(mediaInfo.year)) {
    return true;
  }

  return evidenceTokens.length < 2;
}

function rawStreamText(rawStream) {
  return [
    rawStream.fileName,
    rawStream.name,
    rawStream.title,
    rawStream.description,
    rawStream.quality,
    rawStream.language,
    rawStream.size
  ].filter(Boolean).join("\n");
}

function streamFileName(rawStream) {
  const behaviorHints = rawStream.behaviorHints || {};
  const directName = rawStream.fileName || rawStream.filename || behaviorHints.filename;
  if (directName) {
    return cleanDetailText(directName);
  }

  const text = rawStreamText(rawStream);
  const fileMatch = text.match(/[^\n\r]*\.(?:mkv|mp4|m4v|webm|avi)(?:\b|$)/i);
  if (fileMatch) {
    return cleanDetailText(fileMatch[0]);
  }

  const titleLine = String(rawStream.title || rawStream.description || "")
    .split(/\r?\n/)
    .map(cleanDetailText)
    .find(Boolean);
  return titleLine || "";
}

function streamReleaseType(rawStream) {
  const text = rawStreamText(rawStream);
  const match = text.match(/\b(REMUX|WEB[-\s.]?DL|WEBRip|BluRay|BRRip|BDRip|HDRip|DVDRip|HDTV|CAM|TS|PreDVDRip)\b/i);
  if (!match) {
    return "";
  }

  return match[1]
    .replace(/web[-\s.]?dl/i, "WEB-DL")
    .replace(/webrip/i, "WEBRip")
    .replace(/bluray/i, "BluRay")
    .replace(/brrip/i, "BRRip")
    .replace(/bdrip/i, "BDRip")
    .replace(/hdrip/i, "HDRip")
    .replace(/dvdrip/i, "DVDRip")
    .replace(/hdtv/i, "HDTV")
    .replace(/predvdrip/i, "PreDVDRip")
    .toUpperCase()
    .replace("BLURAY", "BluRay")
    .replace("WEBRIP", "WEBRip")
    .replace("BRRIP", "BRRip")
    .replace("BDRIP", "BDRip")
    .replace("HDRIP", "HDRip")
    .replace("DVDRIP", "DVDRip")
    .replace("PREDVDRIP", "PreDVDRip");
}

function streamVideoDetail(rawStream) {
  const text = rawStreamText(rawStream);
  const parts = [];
  const quality = streamQualityLabel(rawStream);
  if (quality) {
    parts.push(quality);
  }

  if (/\b(?:dolby\s*vision|dovi|dv)\b/i.test(text)) {
    parts.push("Dolby Vision");
  }
  if (/\bHDR10\+?\b/i.test(text)) {
    parts.push(firstMatch(text, /\b(HDR10\+?)\b/i).toUpperCase());
  } else if (/\bHDR\b/i.test(text)) {
    parts.push("HDR");
  }
  if (/\b10\s*bit\b|\b10bit\b/i.test(text)) {
    parts.push("10bit");
  }
  if (/\bx265\b|\bhevc\b|\bh\.?265\b/i.test(text)) {
    parts.push("x265/HEVC");
  } else if (/\bx264\b|\bavc\b|\bh\.?264\b/i.test(text)) {
    parts.push("x264/AVC");
  } else if (/\bAV1\b/i.test(text)) {
    parts.push("AV1");
  }

  return Array.from(new Set(parts)).join(" | ");
}

function streamAudioDetail(rawStream) {
  const text = rawStreamText(rawStream);
  const parts = [];

  const codecPatterns = [
    /\b(TrueHD(?:\s*Atmos)?)\b/i,
    /\b(Dolby\s*Atmos|Atmos)\b/i,
    /\b(DDP?[.\s-]*5\.1|DD\+?[.\s-]*5\.1|EAC3[.\s-]*5\.1)\b/i,
    /\b(AAC[.\s-]*5\.1|AAC[.\s-]*2\.0|AAC)\b/i,
    /\b(DTS(?:-HD)?(?:\s*MA)?(?:\s*5\.1)?)\b/i,
    /\b(AC3[.\s-]*5\.1|AC3)\b/i
  ];

  for (const pattern of codecPatterns) {
    const match = firstMatch(text, pattern);
    if (match) {
      parts.push(match
        .replace(/^(DDP?|DD\+?|EAC3|AAC|AC3)[.\s-]*(\d\.\d)$/i, "$1 $2")
        .replace(/\s+/g, " ")
        .replace(/^ddp/i, "DDP")
        .replace(/^dd/i, "DD")
        .replace(/^eac3/i, "EAC3")
        .replace(/^aac/i, "AAC")
        .replace(/^ac3/i, "AC3"));
      break;
    }
  }

  const audio = audioLabelsFromText(text);
  if (audio) {
    parts.push(audio);
  }

  return Array.from(new Set(parts)).join(" | ");
}

function providerDetailName(provider) {
  return SOURCE_DETAIL_NAMES[provider.id] || (/murph/i.test(provider.name || provider.id || "") ? "Murph Streams" : "Darth Vader");
}

function detailProviderCode(provider) {
  return DETAIL_PROVIDER_CODES[provider.id] || UMBRELLA_PROVIDER_CODES[provider.id] || "";
}

function streamDetailDescription(rawStream, provider) {
  const lines = [];
  const filename = streamFileName(rawStream);
  const releaseType = streamReleaseType(rawStream);
  const videoDetail = streamVideoDetail(rawStream);
  const audioDetail = streamAudioDetail(rawStream);
  const size = formatBytes(streamSizeBytes(rawStream)) || cleanDetailText(rawStream.size);

  if (filename) lines.push(filename);
  if (releaseType) lines.push(`📀 ${releaseType}`);
  if (videoDetail) lines.push(`🎬 ${videoDetail}`);
  if (audioDetail) lines.push(`🔊 ${audioDetail}`);
  const sourceCode = detailProviderCode(provider);
  lines.push(`⚡ ${[providerDetailName(provider), sourceCode].filter(Boolean).join(" - ")}`);
  if (size) lines.push(`💾 ${size}`);

  return lines.join("\n");
}

function streamQualityLabel(rawStream) {
  const text = [
    rawStream.quality,
    rawStream.name,
    rawStream.title,
    rawStream.description,
    rawStream.behaviorHints && rawStream.behaviorHints.bingeGroup
  ].filter(Boolean).join(" ");
  const match = text.match(/\b(4k|2160p|1440p|1080p|720p|480p|360p)\b/i);
  if (!match) {
    return "";
  }

  const quality = match[1].toLowerCase();
  if (quality === "4k" || quality === "2160p") {
    return "2160p";
  }
  return quality;
}

function umbrellaProviderCode(rawStream, provider) {
  return UMBRELLA_PROVIDER_CODES[provider.id] || null;
}

function audioLabelsFromText(value) {
  const text = String(value || "");
  const labels = [];
  const seen = new Set();

  for (const label of KNOWN_AUDIO_LABELS) {
    const match = new RegExp(`\\b${label}\\b`, "i").exec(text);
    if (match && !seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase());
      labels.push({ label, index: match.index });
    }
  }

  if (labels.length > 0) {
    return labels
      .sort((a, b) => a.index - b.index)
      .map((item) => item.label)
      .join(" - ");
  }

  if (/\bmulti(?:\s*audio)?\b/i.test(text)) {
    return "Multi Audio";
  }

  return "";
}

function normalizeLanguageText(value) {
  const knownAudio = audioLabelsFromText(value);
  if (knownAudio) {
    return knownAudio;
  }

  const text = String(value || "")
    .replace(/\b4KHDHub\s+Murph\b/ig, "")
    .replace(/\b4KHDHub\s+Yoruix\b/ig, "")
    .replace(/\bHDHub4u\s+Murph\b/ig, "")
    .replace(/\bD3adlyRocket\b/ig, "")
    .replace(/\bYoruix\b/ig, "")
    .replace(/\bMurph\b/ig, "")
    .replace(/\bHDHub4u\b/ig, "")
    .replace(/\b4khdhub-tv\b/ig, "")
    .replace(/\b4KHDHub\b/ig, "")
    .replace(/\bHindMoviez\b/ig, "")
    .replace(/\bMovieBlast\b/ig, "")
    .replace(/\bMovieBox\b/ig, "")
    .replace(/\bMoviesDrive\b/ig, "")
    .replace(/\bStreamflix\b/ig, "")
    .replace(/\bFlix-Streams\b/ig, "")
    .replace(/\bMedia\s+Library\b/ig, "")
    .replace(/\bEmby\b/ig, "")
    .replace(/\bMkv\s*Cinemas\b/ig, "")
    .replace(/\bMkvCinemas\b/ig, "")
    .replace(/\bLotus\s*Vault\b/ig, "")
    .replace(/\bLotusVault\b/ig, "")
    .replace(/\bArchive\s*Vault\b/ig, "")
    .replace(/\bArchiveVault\b/ig, "")
    .replace(/\bUHD\s*Movies\b/ig, "")
    .replace(/\bUHDMovies\b/ig, "")
    .replace(/\bVegaMovies\b/ig, "")
    .replace(/\b4K\b/ig, "")
    .replace(/\b(?:2160p|1080p|720p|480p|360p|auto)\b/ig, "")
    .replace(/\b(?:fsl|pixelserver|hubcloud|hubdrive|download|file|server)\b/ig, "")
    .replace(/[|:()[\]]/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/^\s*-\s*|\s*-\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const languages = [];
  const seen = new Set();
  for (const part of text.split(/\s+-\s+|[,/]+|\s+\|\s+/)) {
    const normalized = part.trim();
    if (!normalized || /\d/.test(normalized)) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    languages.push(normalized.replace(/\b\w/g, (char) => char.toUpperCase()));
  }

  return languages.join(" - ");
}

function cleanDisplayTitle(value) {
  return String(value || "")
    .replace(/\.[a-z0-9]{2,4}$/i, "")
    .replace(/\bimdb[-_\s]*tt\d+\b/ig, "")
    .replace(/\btmdb[-_\s]*\d+\b/ig, "")
    .replace(/\b(?:2160p|1080p|720p|480p|360p|4k)\b.*$/i, "")
    .replace(/\b(?:WEB[-.\s]?DL|WEBRip|BluRay|BRRip|BDRip|HDRip|DVDRip|HDTV|REMUX)\b.*$/i, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function streamDisplayTitle(rawStream, mediaInfo) {
  const mediaTitle = cleanDisplayTitle(mediaInfo && mediaInfo.title);
  if (mediaTitle) {
    const year = mediaInfo && mediaInfo.year && !new RegExp(`\\b${mediaInfo.year}\\b`).test(mediaTitle)
      ? mediaInfo.year
      : "";
    return [mediaTitle, year].filter(Boolean).join(" ");
  }

  return cleanDisplayTitle(streamFileName(rawStream))
    || cleanDisplayTitle(rawStream.title)
    || cleanDisplayTitle(rawStream.name)
    || "Umbrella";
}

function cleanStreamName(rawStream, mediaInfo) {
  return [streamDisplayTitle(rawStream, mediaInfo), streamQualityLabel(rawStream)].filter(Boolean).join(" | ");
}

function shouldKeepProviderStream(rawStream, provider) {
  const text = [
    rawStream.name,
    rawStream.title,
    rawStream.description,
    rawStream.quality,
    rawStream.language
  ].filter(Boolean).join(" ");

  if (provider.id === "moviebox_yoruix" || provider.id === "movieboxhindi") {
    return /\b(?:hindi|english|original)\b/i.test(text);
  }

  if (provider.id === "peachify" || provider.id === "moviebox_murph") {
    return /\b(?:hindi|english)\b/i.test(text);
  }

  if (provider.id === "vidlink") {
    return /\b1080p\b/i.test(text);
  }

  if (provider.id === "vegamovies") {
    const rank = qualityRank(text);
    return rank >= 2 && rank <= 5 && /\b(?:hindi|hin|english|eng|dual|multi)\b/i.test(text);
  }

  if (provider.id !== "movieblast" && provider.id !== "movieblast_yoruix") {
    return true;
  }

  return /\bhindi\b/i.test(text);
}

function nameWithQuality(name, rawStream) {
  const quality = streamQualityLabel(rawStream);
  if (!quality || new RegExp(`\\b${quality}\\b`, "i").test(String(name || ""))) {
    return name;
  }
  return [name, quality].filter(Boolean).join(" | ");
}

function normalizeStream(rawStream, provider, mediaInfo) {
  if (!rawStream || typeof rawStream !== "object") {
    return null;
  }

  if (!shouldKeepProviderStream(rawStream, provider)) {
    return null;
  }

  const targetUrl = rawStream.url || rawStream.externalUrl;
  if (!targetUrl || typeof targetUrl !== "string") {
    return null;
  }

  const requestHeaders = normalizeHeaders(rawStream.headers);
  const quality = rawStream.quality || "";
  const nameParts = [provider.name, quality].filter(Boolean);
  const behaviorHints = Object.assign({}, rawStream.behaviorHints || {});
  const detectedSize = streamSizeBytes(rawStream);
  const detailDescription = streamDetailDescription(rawStream, provider);
  const description = detailDescription || rawStream.description || rawStream.title || nameParts.join(" | ");
  const filename = streamFileName(rawStream);

  if (filename && !behaviorHints.filename) {
    behaviorHints.filename = filename;
  }
  if (detectedSize > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = detectedSize;
  }
  if (!behaviorHints.bingeGroup) {
    behaviorHints.bingeGroup = `doomp-${provider.id}-${String(quality || "auto").toLowerCase()}`;
  }
  behaviorHints.doomProviderId = provider.id;
  if (!looksWebReady(targetUrl) || requestHeaders) {
    behaviorHints.notWebReady = true;
  }
  if (requestHeaders) {
    behaviorHints.proxyHeaders = {
      request: requestHeaders
    };
  }

  return {
    name: cleanStreamName(rawStream, mediaInfo) || nameWithQuality(rawStream.name || nameParts.join(" | ") || provider.name, rawStream),
    title: description,
    description,
    url: targetUrl,
    behaviorHints
  };
}

function dedupeStreams(streams) {
  const seen = new Set();
  return streams.filter((stream) => {
    const key = `${stream.url}|${stream.name}|${stream.description}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function withTimeout(promise, ms, label) {
  let timeout;
  const timer = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([promise, timer]);
  } finally {
    clearTimeout(timeout);
  }
}

function enrichTrustedProviderStream(rawStream, provider, mediaInfo) {
  const trustedTitleProviders = new Set([
    "moviebox",
    "movieboxhindi",
    "moviebox_yoruix",
    "movies4u",
    "movies4u_murph",
    "netmirror",
    "netmirror_yoruix",
    "flix_streams_lotusvault",
    "flix_streams_archivevault",
    "flix_streams_uhdmovies",
    "flix_streams_4khdhub",
    "flix_streams_hdhub4u",
    "flix_streams_debridvault",
    "flix_streams_other",
    "uhdmovies",
    "uhdmovies_yoruix"
  ]);
  if (!rawStream || !trustedTitleProviders.has(provider.id) || !mediaInfo || !mediaInfo.title) {
    return rawStream;
  }

  const year = mediaInfo.year ? ` ${mediaInfo.year}` : "";
  const quality = rawStream.quality ? ` ${rawStream.quality}` : "";
  return Object.assign({}, rawStream, {
    fileName: rawStream.fileName || rawStream.filename || `${mediaInfo.title}${year}${quality}`.trim()
  });
}

async function collectProviderStreams(provider, parsed, tmdbId, mediaInfo, requestContext = {}) {
  const providerGetStreams = loadProvider(provider);
  const rawStreams = await withTimeout(
    Promise.resolve(providerGetStreams(tmdbId, parsed.mediaType, parsed.season, parsed.episode, parsed.imdbId, requestContext)),
    DEFAULT_TIMEOUT_MS,
    provider.name
  );

  if (isPassthroughProvider(provider)) {
    const passthroughStreamsForProvider = (Array.isArray(rawStreams) ? rawStreams : [])
      .filter((stream) => stream && stream.url);

    if (provider.id === "mediafusion") {
      const mediaFusionStreams = passthroughStreamsForProvider.filter((stream) => {
          if (hasBlockedMediaFusionTag(stream)) {
            console.log(`[MediaFusion] Rejected blocked source tag: ${stream.name || stream.title || stream.url}`);
            return false;
          }
          if (!hasAllowedMediaFusionLanguage(stream)) {
            console.log(`[MediaFusion] Rejected non Hindi/English stream: ${stream.name || stream.title || stream.url}`);
            return false;
          }
          return true;
        });
      return (await filterMediaFusionStreams(mediaFusionStreams)).map(markPassthroughStream);
    }

    return passthroughStreamsForProvider.map(markPassthroughStream);
  }

  return (Array.isArray(rawStreams) ? rawStreams : [])
    .map((stream) => enrichTrustedProviderStream(stream, provider, mediaInfo))
    .map((stream) => normalizeStream(stream, provider, mediaInfo))
    .filter(Boolean);
}

function startProviderCollection(parsed, tmdbId, mediaInfo, entries, requestContext = {}) {
  const results = [];
  const tasks = entries.map((provider, index) => (
    collectProviderStreams(provider, parsed, tmdbId, mediaInfo, requestContext)
      .then((value) => {
        results[index] = { status: "fulfilled", value };
      })
      .catch((reason) => {
        results[index] = { status: "rejected", reason };
      })
  ));

  const donePromise = Promise.allSettled(tasks).then(() => results);
  return { results, donePromise };
}

function streamsFromProviderResults(providerResults, options = {}) {
  const logFailures = options.logFailures !== false;
  const entries = options.providerEntries || providerEntries;
  return providerResults.flatMap((result, index) => {
    if (!result) {
      return [];
    }
    if (result.status === "fulfilled") {
      return result.value;
    }
    if (logFailures) {
      const provider = entries[index] || { name: "Provider" };
      console.error(`[${provider.name}] ${result.reason.message || result.reason}`);
    }
    return [];
  });
}

function filterRequestedMediaStreams(streams, mediaInfo, parsed) {
  return streams.filter((stream) => {
    if (matchesRequestedMedia(stream, mediaInfo, parsed)) {
      return true;
    }
    console.log(`[Media match] Rejected wrong-title stream: ${stream.name}`);
    return false;
  });
}

function compareStreamSizesAscending(a, b) {
  const sizeA = streamSizeBytes(a);
  const sizeB = streamSizeBytes(b);
  if (sizeA && sizeB && sizeA !== sizeB) {
    return sizeA - sizeB;
  }
  if (sizeA && !sizeB) return -1;
  if (!sizeA && sizeB) return 1;
  return 0;
}

function sortStreams(streams, options = {}) {
  return streams.sort((a, b) => {
    const hindiA = isPassthroughStream(a) && hasHindiLanguage(a);
    const hindiB = isPassthroughStream(b) && hasHindiLanguage(b);
    if (hindiA !== hindiB) {
      return hindiB ? 1 : -1;
    }

    const rankA = streamQualityRank(a);
    const rankB = streamQualityRank(b);
    if (rankA !== rankB) {
      return rankB - rankA;
    }

    return compareStreamSizesAscending(a, b);
  });
}

async function finalizeStreams(providerResults, options = {}) {
  const streams = streamsFromProviderResults(providerResults, {
    logFailures: options.logFailures,
    providerEntries: options.providerEntries
  });
  const passthrough = streams.filter(isPassthroughStream);
  const regularStreams = streams.filter((stream) => !isPassthroughStream(stream));
  const mediaMatchedStreams = filterRequestedMediaStreams(regularStreams, options.mediaInfo, options.parsed);
  const playableStreams = await filterPlayableStreams(dedupeStreams(mediaMatchedStreams), {
    probeOnlyRequired: options.probeOnlyRequired,
    probeTimeoutMs: options.probeTimeoutMs
  });
  const qualityMatchedStreams = filterStreamsByQualityBand([...playableStreams, ...passthrough], options.qualityBand);
  return sortStreams(qualityMatchedStreams, { qualityBand: options.qualityBand });
}

async function startStreamBuild(type, id, entries, requestContext = {}) {
  const parsed = parseStremioId(type, id);
  if (!parsed) {
    return null;
  }

  let tmdbId;
  let mediaInfo = null;
  try {
    tmdbId = await resolveTmdbId(parsed.imdbId, parsed.mediaType);
    if (!tmdbId) {
      return null;
    }
    mediaInfo = await resolveMediaInfo(tmdbId, parsed.mediaType);
  } catch (error) {
    console.error(`[TMDB] ${error.message || error}`);
    return null;
  }

  return Object.assign(startProviderCollection(parsed, tmdbId, mediaInfo, entries, requestContext), { parsed, mediaInfo });
}

function providerEntriesForScope(scope) {
  if (!scope || scope === "main") {
    return providerEntries;
  }
  return addonGroupEntries[scope] || null;
}

function scopeHasProvider(scope, providerId) {
  const entries = providerEntriesForScope(scope || "main");
  return Array.isArray(entries) && entries.some((provider) => provider.id === providerId);
}

async function getStreams(type, id, options = {}) {
  const scope = options.scope || "main";
  const entries = providerEntriesForScope(scope);
  if (!entries) {
    return null;
  }
  const group = addonGroups[scope] || {};
  const qualityBand = options.qualityBand || group.qualityBand || "";
  const useFastResponse = !qualityBand;
  const cacheStreamsForScope = useFastResponse && !entries.some((provider) => provider.id === "aiostreams");

  const key = streamCacheKey(type, id, scope);
  if (cacheStreamsForScope) {
    const cached = cachedStreams(key);
    if (cached) {
      console.log(`[Stream cache] Hit for ${key} (${cached.length} streams)`);
      return cached;
    }
  }

  if (streamInflight.has(key)) {
    console.log(`[Stream cache] Joining in-flight request for ${key}`);
    const inFlight = streamInflight.get(key);
    return useFastResponse ? inFlight.fastPromise : inFlight.fullPromise;
  }

  const buildStatePromise = startStreamBuild(type, id, entries, {
    requestHeaders: options.requestHeaders || {}
  });
  const fullPromise = buildStatePromise
    .then(async (state) => {
      if (!state) {
        return [];
      }
      await state.donePromise;
      return finalizeStreams(state.results, {
        logFailures: true,
        mediaInfo: state.mediaInfo,
        parsed: state.parsed,
        providerEntries: entries,
        probeOnlyRequired: true,
        qualityBand
      });
    })
    .then((streams) => {
      if (cacheStreamsForScope) {
        rememberStreams(key, streams);
      }
      return streams;
    })
    .catch((error) => {
      console.error(`[Stream build] ${key}: ${error.message || error}`);
      return [];
    })
    .finally(() => {
      streamInflight.delete(key);
    });

  const fastPromise = buildStatePromise
    .then(async (state) => {
      if (!state) {
        return [];
      }

      await Promise.race([
        state.donePromise,
        delay(Math.max(0, STREAM_FAST_PROVIDER_WAIT_MS))
      ]);

      const providerResults = state.results.filter(Boolean);
      const fastProbeTimeoutMs = entries.some((provider) => provider.id.startsWith("flix_streams_"))
        ? STREAM_PROBE_TIMEOUT_MS
        : STREAM_FAST_PROBE_TIMEOUT_MS;
      const streams = await finalizeStreams(providerResults, {
        logFailures: false,
        mediaInfo: state.mediaInfo,
        parsed: state.parsed,
        providerEntries: entries,
        probeOnlyRequired: true,
        probeTimeoutMs: fastProbeTimeoutMs,
        qualityBand
      });

      if (streams.length > 0) {
        console.log(`[Stream fast] Returning ${streams.length} early streams for ${key}`);
        return streams;
      }

      return fullPromise;
    })
    .catch((error) => {
      console.error(`[Stream fast] ${key}: ${error.message || error}`);
      return fullPromise;
    });

  streamInflight.set(key, { fullPromise, fastPromise });
  return useFastResponse ? Promise.race([fullPromise, fastPromise]) : fullPromise;
}

module.exports = {
  manifest,
  addonManifests,
  addonGroups,
  getStreams,
  scopeHasProvider,
  parseStremioId,
  resolveTmdbId,
  normalizeStream
};
