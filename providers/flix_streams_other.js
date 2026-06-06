"use strict";

const PROVIDER_NAME = "Flix-Streams Other";
const DEFAULT_MANIFEST_URL = "https://flixnest.app/flix-streams/u/6p9xzp78nunz/manifest.json";

function configuredBaseUrl() {
  const raw = process.env.FLIX_STREAMS_MANIFEST_URL || process.env.FLIX_STREAMS_BASE_URL || DEFAULT_MANIFEST_URL;
  if (!raw) {
    return "";
  }
  return raw.replace(/\/manifest\.json$/i, "").replace(/\/+$/, "");
}

function streamId(tmdbId, mediaType, season, episode) {
  const baseId = `tmdb:${tmdbId}`;
  if ((mediaType === "series" || mediaType === "tv") && season != null && episode != null) {
    return `${baseId}:${season}:${episode}`;
  }
  return baseId;
}

async function fetchFlixStreams(tmdbId, mediaType, season, episode) {
  const baseUrl = configuredBaseUrl();
  if (!baseUrl) {
    return [];
  }

  const stremioType = mediaType === "tv" ? "series" : mediaType;
  const url = `${baseUrl}/stream/${encodeURIComponent(stremioType)}/${encodeURIComponent(streamId(tmdbId, stremioType, season, episode))}.json`;
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Doom-addon/1.0"
    },
    redirect: "follow"
  });
  if (!response.ok) {
    throw new Error(`${PROVIDER_NAME} returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload.streams) ? payload.streams : [];
}

function flixText(stream) {
  return [
    stream && stream.name,
    stream && stream.message,
    stream && stream.title,
    stream && stream.description,
    stream && stream.url,
    stream && stream.behaviorHints && stream.behaviorHints.filename,
    stream && stream.behaviorHints && stream.behaviorHints.bingeGroup
  ].filter(Boolean).join(" ");
}

function isKnownNamedFlixStream(stream) {
  const text = flixText(stream);
  return /\b(?:emby|medialib|media library)\b/i.test(text)
    || /\bmedia\s*lib\s*\(\s*[ej]\d*\s*\)/i.test(text)
    || /\/api\/emby\/media\b/i.test(text)
    || /\/api\/jellyfin\/media\b/i.test(text)
    || /\b(?:mkv\s*cinemas?|mkvcinemas?|mkv\s*direct)\b/i.test(text)
    || /\b(?:lotus\s*vault|lotusvault)\b/i.test(text)
    || /\b(?:archive\s*vault|archivevault)\b/i.test(text)
    || /\buhd\s*movies?\b/i.test(text)
    || /\bvega\s*movies?\b/i.test(text)
    || /\b(?:4khdhub|hdhub4u|hubdrive|hubcloud)\b/i.test(text)
    || /\/api\/(?:4khdhub|hdhub4u)\/media\b/i.test(text);
}

function isPlayableOtherCandidate(stream) {
  if (!stream || !stream.url) {
    return false;
  }

  const text = flixText(stream);
  if (/\b(?:sale|discount|legacy users?|subscribe|support)\b/i.test(text)) {
    return false;
  }

  return !isKnownNamedFlixStream(stream);
}

function normalizeFlixStream(stream) {
  if (!stream || !stream.url) {
    return null;
  }

  return {
    name: stream.name || PROVIDER_NAME,
    title: stream.title || stream.description || stream.name || PROVIDER_NAME,
    description: stream.description || stream.title || stream.name || PROVIDER_NAME,
    url: stream.url,
    quality: stream.quality,
    size: stream.size,
    videoSize: stream.videoSize || (stream.behaviorHints && stream.behaviorHints.videoSize),
    behaviorHints: stream.behaviorHints || {},
    headers: stream.headers
  };
}

async function getStreams(tmdbId, mediaType = "movie", season = null, episode = null) {
  try {
    const streams = await fetchFlixStreams(tmdbId, mediaType, season, episode);
    return streams
      .filter(isPlayableOtherCandidate)
      .map(normalizeFlixStream)
      .filter(Boolean);
  } catch (error) {
    console.error(`[${PROVIDER_NAME}] ${error.message || error}`);
    return [];
  }
}

module.exports = { getStreams };
