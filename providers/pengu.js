"use strict";

const PROVIDER_NAME = "Pengu";

function configuredBaseUrl() {
  const manifestUrl = process.env.PENGU_MANIFEST_URL || "";
  try {
    const url = new URL(manifestUrl);
    if (url.protocol !== "https:" || url.hostname !== "pengu.uk" || !url.pathname.endsWith("/manifest.json")) {
      return "";
    }
    return url.href.slice(0, -"manifest.json".length);
  } catch {
    return "";
  }
}

async function getStreams(tmdbId, mediaType = "movie", season = null, episode = null, imdbId = "") {
  const baseUrl = configuredBaseUrl();
  if (!baseUrl || !/^tt\d+$/.test(imdbId)) {
    return [];
  }

  const type = mediaType === "tv" ? "series" : mediaType;
  const id = type === "series" ? `${imdbId}:${season}:${episode}` : imdbId;
  if (!/^(movie|series)$/.test(type) || (type === "series" && (!Number.isInteger(season) || !Number.isInteger(episode)))) {
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}stream/${type}/${encodeURIComponent(id)}.json`, {
      headers: { Accept: "application/json" },
      redirect: "follow"
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    return (Array.isArray(payload.streams) ? payload.streams : [])
      .filter((stream) => stream && typeof stream.url === "string" && /^https:\/\//i.test(stream.url))
      .map((stream) => ({
        name: stream.name || PROVIDER_NAME,
        description: stream.description,
        url: stream.url,
        quality: stream.quality,
        videoSize: stream.videoSize,
        behaviorHints: stream.behaviorHints,
        headers: stream.headers
      }));
  } catch (error) {
    console.error(`[${PROVIDER_NAME}] ${error.message || error}`);
    return [];
  }
}

module.exports = { getStreams };
