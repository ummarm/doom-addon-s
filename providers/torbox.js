"use strict";

const PROVIDER_NAME = "Torbox";
const DEFAULT_MANIFEST_URL = "https://aiostreamsfortheweebsstable.midnightignite.me/stremio/1d3081a9-8a56-4144-9e93-f878a2a491c4/eyJpIjoiellKWWVHMUxGUXdsQXpNUGxvbk8xZz09IiwiZSI6InQ4OWNlRmFPVytBTHBpa0VjeDVuSGRZYk1LMVB0YTdmVUt3QmN2NzNuUTQ9IiwidCI6ImEifQ/manifest.json";

function configuredBaseUrl() {
  const raw = process.env.TORBOX_MANIFEST_URL || process.env.TORBOX_BASE_URL || DEFAULT_MANIFEST_URL;
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

async function fetchTorboxStreams(stremioId, mediaType, season, episode) {
  const baseUrl = configuredBaseUrl();
  if (!baseUrl || !stremioId) {
    return [];
  }

  const stremioType = mediaType === "tv" ? "series" : mediaType;
  const id = streamId(stremioId, stremioType, season, episode);
  const url = `${baseUrl}/stream/${encodeURIComponent(stremioType)}/${encodeURIComponent(id)}.json`;
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Doom-addon/2.1"
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
      const streams = await fetchTorboxStreams(id, mediaType, season, episode);
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
