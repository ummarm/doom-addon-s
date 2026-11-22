"use strict";

const PROVIDER_NAME = "CNCVerse";
const DEFAULT_MANIFEST_URL = "https://cncverse.dpdns.org/u/p_50tqp11086ff/manifest.json";
const FETCH_TIMEOUT_MS = Number(process.env.CNCVERSE_TIMEOUT_MS || 45000);

function configuredBaseUrl() {
  const manifestUrl = process.env.CNCVERSE_MANIFEST_URL || DEFAULT_MANIFEST_URL;
  try {
    const url = new URL(manifestUrl);
    if (url.protocol !== "https:" || !url.pathname.endsWith("/manifest.json")) return "";
    return url.href.slice(0, -"manifest.json".length);
  } catch {
    return "";
  }
}

function cleanSubtitles(value) {
  return (Array.isArray(value) ? value : [])
    .filter((subtitle) => subtitle && typeof subtitle.url === "string" && /^https?:\/\//i.test(subtitle.url))
    .map((subtitle) => ({
      id: String(subtitle.id || subtitle.lang || "subtitle"),
      lang: String(subtitle.lang || "eng"),
      url: subtitle.url
    }));
}

async function getStreams(tmdbId, mediaType = "movie", season = null, episode = null, imdbId = "") {
  const baseUrl = configuredBaseUrl();
  const type = mediaType === "tv" ? "series" : mediaType;
  if (!baseUrl || !/^tt\d+$/.test(imdbId) || !/^(movie|series)$/.test(type)) return [];
  if (type === "series" && (!Number.isInteger(season) || !Number.isInteger(episode))) return [];

  const id = type === "series" ? `${imdbId}:${season}:${episode}` : imdbId;
  try {
    const response = await fetch(`${baseUrl}stream/${type}/${encodeURIComponent(id)}.json`, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Doom-addon-S/3.1"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return (Array.isArray(payload.streams) ? payload.streams : [])
      .filter((stream) => stream && typeof stream.url === "string" && /^https:\/\//i.test(stream.url))
      .map((stream) => ({
        name: stream.name || PROVIDER_NAME,
        description: stream.description || stream.title,
        url: stream.url,
        behaviorHints: stream.behaviorHints,
        subtitles: cleanSubtitles(stream.subtitles)
      }));
  } catch (error) {
    console.error(`[${PROVIDER_NAME}] ${error.message || error}`);
    return [];
  }
}

module.exports = { getStreams };
