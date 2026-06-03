"use strict";

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { manifest, addonManifests, getStreams, scopeHasProvider, parseStremioId } = require("./addon");
const aioStreamsProvider = require("./providers/aiostreams");

const PORT = Number(process.env.PORT || 7000);
const HOST = process.env.HOST || "0.0.0.0";
const ASSETS_DIR = path.join(__dirname, "assets");
const AIO_REDIRECT_TTL_MS = Number(process.env.AIO_REDIRECT_TTL_MS || 30 * 60 * 1000);
const aioRedirectEntries = new Map();

function sendJson(response, statusCode, payload, cacheSeconds = 0) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheSeconds > 0 ? `public, max-age=${cacheSeconds}` : "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  response.end(body);
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(text)
  });
  response.end(text);
}

function sendFile(response, statusCode, filePath, contentType, cacheSeconds = 0) {
  const body = fs.readFileSync(filePath);
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentType,
    "Cache-Control": cacheSeconds > 0 ? `public, max-age=${cacheSeconds}` : "no-store",
    "Content-Length": body.length
  });
  response.end(body);
}

function parseStreamPath(pathname) {
  const match = pathname.match(/^\/(?:addons\/([^/]+)\/)?stream\/([^/]+)\/(.+)\.json$/);
  if (!match) {
    return null;
  }

  return {
    scope: match[1] ? decodeURIComponent(match[1]) : "main",
    type: decodeURIComponent(match[2]),
    id: decodeURIComponent(match[3])
  };
}

function parseAddonManifestPath(pathname) {
  const match = pathname.match(/^\/addons\/([^/]+)\/manifest\.json$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function parseAioRedirectPath(pathname) {
  const match = pathname.match(/^\/aio-redirect\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function cleanupAioRedirectEntries() {
  const now = Date.now();
  for (const [token, entry] of aioRedirectEntries) {
    if (!entry || entry.expiresAt <= now) {
      aioRedirectEntries.delete(token);
    }
  }
}

function isAioPlaybackUrl(value) {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "https:"
      && parsed.hostname === "aiostreams.elfhosted.com"
      && parsed.pathname.startsWith("/playback/");
  } catch {
    return false;
  }
}

function aioStreamFingerprint(stream) {
  const hints = stream && stream.behaviorHints;
  return {
    videoHash: hints && hints.videoHash ? String(hints.videoHash) : "",
    filename: hints && hints.filename ? String(hints.filename) : "",
    videoSize: hints && hints.videoSize ? String(hints.videoSize) : "",
    name: stream && stream.name ? String(stream.name) : "",
    description: stream && stream.description ? String(stream.description) : String(stream && stream.title || "")
  };
}

function aioFingerprintScore(expected, candidate) {
  const current = aioStreamFingerprint(candidate);
  let score = 0;
  if (expected.videoHash && current.videoHash && expected.videoHash === current.videoHash) score += 100;
  if (expected.filename && current.filename && expected.filename === current.filename) score += 40;
  if (expected.videoSize && current.videoSize && expected.videoSize === current.videoSize) score += 20;
  if (expected.name && current.name && expected.name === current.name) score += 10;
  if (expected.description && current.description && expected.description === current.description) score += 5;
  return score;
}

function rememberAioRedirect(stream, streamRequest) {
  cleanupAioRedirectEntries();
  const token = crypto.randomUUID();
  aioRedirectEntries.set(token, {
    type: streamRequest.type,
    id: streamRequest.id,
    fingerprint: aioStreamFingerprint(stream),
    fallbackUrl: stream.url,
    expiresAt: Date.now() + AIO_REDIRECT_TTL_MS
  });
  return token;
}

function redirectAioStreams(streams, streamRequest, origin) {
  if (!Array.isArray(streams) || streams.length === 0) {
    return streams;
  }

  return streams.map((stream) => {
    if (!stream || typeof stream !== "object" || !isAioPlaybackUrl(stream.url)) {
      return stream;
    }

    const token = rememberAioRedirect(stream, streamRequest);
    return Object.assign({}, stream, {
      url: `${origin}/aio-redirect/${encodeURIComponent(token)}`
    });
  });
}

async function freshAioPlaybackUrl(entry) {
  const parsed = parseStremioId(entry.type, entry.id);
  if (!parsed) {
    return entry.fallbackUrl;
  }

  const streams = await aioStreamsProvider.getStreams(
    "",
    parsed.mediaType,
    parsed.season,
    parsed.episode,
    parsed.imdbId
  );
  const candidates = Array.isArray(streams) ? streams.filter((stream) => stream && stream.url) : [];
  if (candidates.length === 0) {
    return entry.fallbackUrl;
  }

  const ranked = candidates
    .map((stream) => ({ stream, score: aioFingerprintScore(entry.fingerprint, stream) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0] && ranked[0].score > 0 ? ranked[0].stream.url : candidates[0].url;
}

async function resolveAioHandoffUrl(playbackUrl) {
  if (!isAioPlaybackUrl(playbackUrl)) {
    return playbackUrl;
  }

  const response = await fetch(playbackUrl, {
    headers: {
      "Accept": "*/*",
      "Range": "bytes=0-1",
      "User-Agent": "Doom-addon/1.0"
    },
    redirect: "manual"
  });

  if (response.body && typeof response.body.cancel === "function") {
    await response.body.cancel().catch(() => {});
  }

  const location = response.headers.get("location");
  if (location && response.status >= 300 && response.status < 400) {
    return new URL(location, playbackUrl).toString();
  }

  return playbackUrl;
}

async function handleAioRedirect(response, token) {
  cleanupAioRedirectEntries();
  const entry = aioRedirectEntries.get(token);
  if (!entry) {
    sendJson(response, 410, { error: "AIO playback URL expired" });
    return;
  }

  const playbackUrl = await freshAioPlaybackUrl(entry);
  const location = await resolveAioHandoffUrl(playbackUrl);
  response.writeHead(302, {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
    "Location": location
  });
  response.end();
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      });
      response.end();
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed" });
      return;
    }

    const aioRedirectToken = parseAioRedirectPath(url.pathname);
    if (aioRedirectToken) {
      await handleAioRedirect(response, aioRedirectToken);
      return;
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      sendText(
        response,
        200,
        [
          "Doom-addon Stremio add-on is running.",
          `Install URL: ${url.origin}/manifest.json`,
          `Umbrella M: ${url.origin}/addons/murph/manifest.json`,
          `Umbrella Y: ${url.origin}/addons/yoruix/manifest.json`,
          `Umbrella D: ${url.origin}/addons/d3adlyrocket/manifest.json`,
          `Umbrella F: ${url.origin}/addons/flixnest/manifest.json`,
          `Umbrella MF: ${url.origin}/addons/mediafusion/manifest.json`,
          `Umbrella AIO: ${url.origin}/addons/aiostreams/manifest.json`,
          `Umbrella 4K: ${url.origin}/addons/quality-4k/manifest.json`,
          `Umbrella 1080: ${url.origin}/addons/quality-1080/manifest.json`,
          `Umbrella Low: ${url.origin}/addons/quality-low/manifest.json`,
          ""
        ].join("\n")
      );
      return;
    }

    if (url.pathname === "/assets/umbrella-icon.png") {
      sendFile(response, 200, path.join(ASSETS_DIR, "umbrella-icon.png"), "image/png", 86400);
      return;
    }

    if (url.pathname === "/manifest.json") {
      sendJson(response, 200, manifest, 3600);
      return;
    }

    const addonManifestScope = parseAddonManifestPath(url.pathname);
    if (addonManifestScope) {
      const scopedManifest = addonManifests[addonManifestScope];
      if (!scopedManifest) {
        sendJson(response, 404, { error: "Add-on group not found" });
        return;
      }
      sendJson(response, 200, scopedManifest, 3600);
      return;
    }

    const streamRequest = parseStreamPath(url.pathname);
    if (streamRequest) {
      const streams = await getStreams(streamRequest.type, streamRequest.id, {
        scope: streamRequest.scope,
        requestHeaders: request.headers
      });
      if (!streams) {
        sendJson(response, 404, { error: "Add-on group not found" });
        return;
      }
      const cacheSeconds = scopeHasProvider(streamRequest.scope, "aiostreams") ? 0 : 300;
      const responseStreams = scopeHasProvider(streamRequest.scope, "aiostreams")
        ? redirectAioStreams(streams, streamRequest, url.origin)
        : streams;
      sendJson(response, 200, { streams: responseStreams }, cacheSeconds);
      return;
    }

    sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`Doom-addon Stremio add-on listening on http://${displayHost}:${PORT}`);
});
