"use strict";

const PROVIDER_NAME = "AIOStreams";
const DEFAULT_MANIFEST_URL = "https://aiostreams.elfhosted.com/stremio/2bd9ad98-8ca6-4804-9663-ff88baf8ecca/eyJpIjoia0NIZGVINjNlODIwQ2szbHJZMWllQT09IiwiZSI6IlpzZVBFQ3NRcVVKRnhQcWJJa2pudUV1N1ZQckdXUlh5bmtaRW1YNlBLNFk9IiwidCI6ImEifQ/manifest.json";

function configuredBaseUrl() {
  const raw = process.env.AIOSTREAMS_MANIFEST_URL || process.env.AIOSTREAMS_BASE_URL || DEFAULT_MANIFEST_URL;
  if (!raw) {
    return "";
  }
  return raw.replace(/\/manifest\.json$/i, "").replace(/\/+$/, "");
}

function streamId(baseId, mediaType, season, episode) {
  if ((mediaType === "series" || mediaType === "tv") && season != null && episode != null) {
    return `${baseId}:${season}:${episode}`;
  }
  return baseId;
}

function headerValue(headers, name) {
  if (!headers || typeof headers !== "object") {
    return "";
  }
  return headers[name] || headers[name.toLowerCase()] || "";
}

function aioRequestHeaders(requestContext = {}) {
  const clientHeaders = requestContext.requestHeaders || {};
  const headers = {
    "Accept": "application/json",
    "User-Agent": headerValue(clientHeaders, "user-agent") || "Doom-addon/1.0"
  };

  for (const [source, target] of [
    ["accept-language", "Accept-Language"],
    ["cf-connecting-ip", "CF-Connecting-IP"],
    ["x-forwarded-for", "X-Forwarded-For"],
    ["x-real-ip", "X-Real-IP"]
  ]) {
    const value = headerValue(clientHeaders, source);
    if (value) {
      headers[target] = value;
    }
  }

  return headers;
}

async function fetchAioStreams(stremioId, mediaType, season, episode, requestContext = {}) {
  const baseUrl = configuredBaseUrl();
  if (!baseUrl) {
    return [];
  }

  const stremioType = mediaType === "tv" ? "series" : mediaType;
  const id = streamId(stremioId, stremioType, season, episode);
  const url = `${baseUrl}/stream/${encodeURIComponent(stremioType)}/${encodeURIComponent(id)}.json`;
  const response = await fetch(url, {
    headers: aioRequestHeaders(requestContext),
    redirect: "follow"
  });
  if (!response.ok) {
    throw new Error(`${PROVIDER_NAME} returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload.streams) ? payload.streams : [];
}

async function getStreams(tmdbId, mediaType = "movie", season = null, episode = null, imdbId = "", requestContext = {}) {
  const ids = [
    imdbId,
    tmdbId ? `tmdb:${tmdbId}` : ""
  ].filter(Boolean);

  for (const id of ids) {
    try {
      const streams = await fetchAioStreams(id, mediaType, season, episode, requestContext);
      if (streams.length > 0) {
        return streams.filter((stream) => stream && stream.url);
      }
    } catch (error) {
      console.error(`[${PROVIDER_NAME}] ${id}: ${error.message || error}`);
    }
  }

  return [];
}

module.exports = { getStreams };
