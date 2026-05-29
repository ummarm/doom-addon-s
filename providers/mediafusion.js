"use strict";

const PROVIDER_NAME = "MediaFusion";
const DEFAULT_MANIFEST_URL = "https://mediafusion.elfhosted.com/U-9ec0cde3-8d91-4448-9523-20cc86d363ea/manifest.json";

function configuredBaseUrl() {
  const raw = process.env.MEDIAFUSION_MANIFEST_URL || process.env.MEDIAFUSION_BASE_URL || DEFAULT_MANIFEST_URL;
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

async function fetchMediaFusionStreams(stremioId, mediaType, season, episode) {
  const baseUrl = configuredBaseUrl();
  if (!baseUrl) {
    return [];
  }

  const stremioType = mediaType === "tv" ? "series" : mediaType;
  const id = streamId(stremioId, stremioType, season, episode);
  const url = `${baseUrl}/stream/${encodeURIComponent(stremioType)}/${encodeURIComponent(id)}.json`;
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

async function getStreams(tmdbId, mediaType = "movie", season = null, episode = null, imdbId = "") {
  const ids = [
    imdbId,
    tmdbId ? `tmdb:${tmdbId}` : ""
  ].filter(Boolean);

  for (const id of ids) {
    try {
      const streams = await fetchMediaFusionStreams(id, mediaType, season, episode);
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
