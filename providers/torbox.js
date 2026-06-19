"use strict";

const PROVIDER_NAME = "Torbox";
const DEFAULT_MANIFEST_URL = "https://aiostreams.fortheweak.cloud/stremio/0f2abcc3-6334-4dc1-8852-4f1f54ee0ede/eyJpIjoiQndmYWI3aEpnUVpRZWtpZzhxaWNqdz09IiwiZSI6ImkySnV3U1p6cEtYSzZQWS9keStNYTFXdHdHdzRGMHpNRGlYTUQwRUxCWXM9IiwidCI6ImEifQ/manifest.json";
const BACKUP_MANIFEST_URL = "https://aiostreamsfortheweebsstable.midnightignite.me/stremio/1d3081a9-8a56-4144-9e93-f878a2a491c4/eyJpIjoiellKWWVHMUxGUXdsQXpNUGxvbk8xZz09IiwiZSI6InQ4OWNlRmFPVytBTHBpa0VjeDVuSGRZYk1LMVB0YTdmVUt3QmN2NzNuUTQ9IiwidCI6ImEifQ/manifest.json";

function normalizeBaseUrl(raw) {
  return String(raw || "").replace(/\/manifest\.json$/i, "").replace(/\/+$/, "");
}

function configuredBaseUrls() {
  const override = process.env.TORBOX_MANIFEST_URL || process.env.TORBOX_BASE_URL;
  if (override) {
    return [normalizeBaseUrl(override)].filter(Boolean);
  }
  return [DEFAULT_MANIFEST_URL, BACKUP_MANIFEST_URL].map(normalizeBaseUrl).filter(Boolean);
}

function streamId(baseId, mediaType, season, episode) {
  if ((mediaType === "series" || mediaType === "tv") && season != null && episode != null) {
    return `${baseId}:${season}:${episode}`;
  }
  return baseId;
}

async function fetchTorboxStreams(stremioId, mediaType, season, episode) {
  const baseUrls = configuredBaseUrls();
  if (!baseUrls.length || !stremioId) {
    return [];
  }

  const stremioType = mediaType === "tv" ? "series" : mediaType;
  const id = streamId(stremioId, stremioType, season, episode);
  let lastError = null;
  for (const baseUrl of baseUrls) {
    const url = `${baseUrl}/stream/${encodeURIComponent(stremioType)}/${encodeURIComponent(id)}.json`;
    try {
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
      const streams = Array.isArray(payload.streams) ? payload.streams : [];
      if (streams.length > 0 || baseUrl === baseUrls[baseUrls.length - 1]) {
        return streams;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  return [];
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
