#!/usr/bin/env python3
"""Sync Doom-addon-S providers directly from the original upstream sources.

Doom-addon-S no longer treats Doom-plug as an upstream. Provider source files are
checked against the original projects, then Doom-addon-S-specific patches are
applied for hosted Stremio use.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from urllib.error import HTTPError


REPO_ROOT = Path(__file__).resolve().parents[1]
PROVIDER_REGISTRY_PATH = REPO_ROOT / "providers.json"
STREMIO_MANIFEST_PATH = REPO_ROOT / "manifest.json"
PACKAGE_PATH = REPO_ROOT / "package.json"
PROVIDERS_DIR = REPO_ROOT / "providers"
UPSTREAMS_PATH = REPO_ROOT / "upstreams.json"
ANCHOR_DATE = date(2026, 4, 20)
CADENCE_DAYS = 1
D3ADLYROCKET_UPSTREAM_RAW_BASE = "https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/main"
D3ADLYROCKET_UPSTREAM_TREE_API = "https://api.github.com/repos/D3adlyRocket/All-in-One-Nuvio/git/trees/main?recursive=1"
D3ADLYROCKET_MANIFEST_URL = "https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/refs/heads/main/manifest.json"
YORUIX_UPSTREAM_RAW_BASE = "https://raw.githubusercontent.com/yoruix/nuvio-providers/main"
YORUIX_UPSTREAM_TREE_API = "https://api.github.com/repos/yoruix/nuvio-providers/git/trees/main?recursive=1"
YORUIX_MANIFEST_URL = "https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/manifest.json"
FLIX_STREAMS_MANIFEST_URL = "https://flixnest.app/flix-streams/u/6p9xzp78nunz/manifest.json"
MURPH_MANIFEST_URL = "https://badboysxs-morpheus.hf.space/manifest.json"
WEBSTREAMRMBG_REPOSITORY_URL = "https://github.com/newman2x/WebStreamrMBG"
WEBSTREAMRMBG_MANIFEST_URL = "https://87d6a6ef6b58-webstreamrmbg.baby-beamup.club/manifest.json"
TORBOX_MANIFEST_URL = "https://aiostreamsfortheweebsstable.midnightignite.me/stremio/4e02e39b-c022-4ce5-ad67-eeaca6b2fb5e/eyJpIjoid0k4WWxWZnQvaVhZNnkvTjZnN2sxUT09IiwiZSI6IlU4Z0tBYUp1WnQxaGJrQTgrT1FTS3Y0OWRmbG1wQVc1NzdLV1IzRGRBUWs9IiwidCI6ImEifQ/manifest.json"
ADDON_DOMAINS_URL = "https://raw.githubusercontent.com/ummarm/doom-addon-s/main/domains.json"
UPSTREAM_DOMAINS_URL = "https://raw.githubusercontent.com/phisher98/TVVVV/refs/heads/main/domains.json"
USER_AGENT = "Doom-addon-S direct upstream sync"
DEFAULT_UPSTREAMS = {
    "syncCadenceDays": CADENCE_DAYS,
    "manifests": {
        "d3adlyrocket": D3ADLYROCKET_MANIFEST_URL,
        "yoruix": YORUIX_MANIFEST_URL,
        "flixnest": FLIX_STREAMS_MANIFEST_URL,
        "murph": MURPH_MANIFEST_URL,
        "webstreamrmbg": WEBSTREAMRMBG_MANIFEST_URL,
        "torbox": TORBOX_MANIFEST_URL,
    },
    "repositories": {
        "webstreamrmbg": WEBSTREAMRMBG_REPOSITORY_URL,
    },
    "domainSources": {
        "doomAddon": ADDON_DOMAINS_URL,
        "upstream": UPSTREAM_DOMAINS_URL,
    },
}
SEEKABLE_VALIDATION_MARKER = "__DOOM_SEEKABLE_VALIDATION__"
HDHUB_TV_EPISODE_FALLBACK_MARKER = "__DOOM_HDHUB_TV_EPISODE_FALLBACK__"
NETMIRROR_DURATION_FILTER_MARKER = "__DOOM_NETMIRROR_DURATION_FILTER__"
STREAM_NORMALIZATION_MARKER = "__DOOM_STREAM_NORMALIZATION__"
SEEKABLE_VALIDATION_SNIPPET = r"""
// __DOOM_SEEKABLE_VALIDATION__
var __doomProbeCache = Object.create(null);
var __doomProbeCacheTtlMs = 10 * 60 * 1000;
var __doomProbeTimeoutMs = 6 * 1000;

function __doomMergeHeaders(base, extra) {
  var merged = {};
  var key;
  for (key in base || {}) merged[key] = base[key];
  for (key in extra || {}) merged[key] = extra[key];
  return merged;
}

function __doomWithTimeout(promise, timeoutMs) {
  return new Promise(function(resolve, reject) {
    var settled = false;
    var timer = setTimeout(function() {
      if (settled) return;
      settled = true;
      reject(new Error("timeout"));
    }, timeoutMs);

    Promise.resolve(promise).then(function(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    }, function(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}

function __doomLooksLikeHls(url, contentType) {
  var normalizedUrl = String(url || "").toLowerCase();
  var normalizedType = String(contentType || "").toLowerCase();
  return normalizedUrl.indexOf(".m3u8") !== -1
    || normalizedType.indexOf("mpegurl") !== -1
    || normalizedType.indexOf("application/x-mpegurl") !== -1
    || normalizedType.indexOf("vnd.apple.mpegurl") !== -1;
}

function __doomBuildProbeCacheKey(stream) {
  var headers = stream && stream.headers ? stream.headers : {};
  return [
    stream && stream.url ? stream.url : "",
    headers.Referer || headers.referer || "",
    headers.Origin || headers.origin || ""
  ].join("|");
}

function __doomGetCachedProbeResult(cacheKey) {
  var entry = __doomProbeCache[cacheKey];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > __doomProbeCacheTtlMs) {
    delete __doomProbeCache[cacheKey];
    return null;
  }
  return entry.ok;
}

function __doomSetCachedProbeResult(cacheKey, ok) {
  __doomProbeCache[cacheKey] = {
    ok: !!ok,
    timestamp: Date.now()
  };
}

function __doomResponseIsSeekable(response, url) {
  if (!response || !response.ok) return false;
  var headers = response.headers;
  var contentType = headers && headers.get ? headers.get("content-type") || "" : "";
  if (__doomLooksLikeHls(url, contentType)) return true;
  var acceptRanges = headers && headers.get ? headers.get("accept-ranges") || "" : "";
  var contentRange = headers && headers.get ? headers.get("content-range") || "" : "";
  return response.status === 206
    || /bytes/i.test(acceptRanges)
    || /^bytes\s+/i.test(contentRange);
}

function __doomProbeStream(stream) {
  if (!stream || !stream.url || typeof fetch !== "function") {
    return Promise.resolve(false);
  }

  var cacheKey = __doomBuildProbeCacheKey(stream);
  var cached = __doomGetCachedProbeResult(cacheKey);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  var url = stream.url;
  var isHls = __doomLooksLikeHls(url, "");
  var baseHeaders = __doomMergeHeaders({}, stream.headers || {});
  var rangedHeaders = __doomMergeHeaders({}, baseHeaders);
  if (!isHls && !rangedHeaders.Range && !rangedHeaders.range) {
    rangedHeaders.Range = "bytes=0-1";
  }

  var attempts = [
    { method: "GET", headers: isHls ? baseHeaders : rangedHeaders, redirect: "follow" },
    { method: "HEAD", headers: baseHeaders, redirect: "follow" }
  ];

  function tryAttempt(index) {
    if (index >= attempts.length) return Promise.resolve(false);
    return __doomWithTimeout(fetch(url, attempts[index]), __doomProbeTimeoutMs)
      .then(function(response) {
        if (__doomResponseIsSeekable(response, url)) return true;
        return tryAttempt(index + 1);
      })
      .catch(function() {
        return tryAttempt(index + 1);
      });
  }

  return tryAttempt(0).then(function(ok) {
    __doomSetCachedProbeResult(cacheKey, ok);
    return ok;
  });
}

function __doomFilterSeekableStreams(streams, providerLabel) {
  if (!Array.isArray(streams) || streams.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(streams.map(function(stream) {
    return __doomProbeStream(stream)
      .then(function(ok) { return { stream: stream, ok: ok }; })
      .catch(function() { return { stream: stream, ok: false }; });
  })).then(function(results) {
    var filtered = results.filter(function(item) { return item.ok; }).map(function(item) { return item.stream; });
    var label = providerLabel || "[Doom-addon-S]";
    if (filtered.length === 0) {
      console.log(label + " Seekable filter kept 0/" + streams.length + " streams; returning original streams as fallback");
      return streams;
    }
    console.log(label + " Seekable filter kept " + filtered.length + "/" + streams.length + " streams");
    return filtered;
  });
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomSeekableWrapped) {
    return;
  }

  var __doomOriginalGetStreams = getStreams;
  var __doomProviderLabel = typeof PLUGIN_TAG !== "undefined"
    ? PLUGIN_TAG
    : (typeof TAG !== "undefined" ? TAG : "[Doom-addon-S]");

  var __doomWrappedGetStreams = function() {
    return Promise.resolve(__doomOriginalGetStreams.apply(this, arguments))
      .then(function(streams) {
        return __doomFilterSeekableStreams(streams, __doomProviderLabel);
      })
      .catch(function(error) {
        var message = error && error.message ? error.message : String(error);
        console.error(__doomProviderLabel + " Seekable validation failed: " + message);
        return [];
      });
  };

  __doomWrappedGetStreams.__doomSeekableWrapped = true;
  getStreams = __doomWrappedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();
"""
HDHUB_TV_EPISODE_FALLBACK_SNIPPET = r"""
// __DOOM_HDHUB_TV_EPISODE_FALLBACK__
function __doomHtmlDecode(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, "-")
    .replace(/&#(\d+);/g, function(_, code) {
      return String.fromCharCode(Number(code));
    });
}

function __doomPlainText(html) {
  return __doomHtmlDecode(String(html || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function __doomResolveHdhubUrl(href, pageUrl) {
  if (!href) return "";
  try {
    return new URL(__doomHtmlDecode(href), pageUrl).toString();
  } catch (_) {
    return __doomHtmlDecode(href);
  }
}

function __doomQualityFromText(text) {
  var normalized = String(text || "").toLowerCase();
  if (/\b(?:4k|2160p)\b/.test(normalized)) return "4K";
  if (/\b1080p\b/.test(normalized)) return "1080p";
  if (/\b720p\b/.test(normalized)) return "720p";
  if (/\b480p\b/.test(normalized)) return "480p";
  if (/\b360p\b/.test(normalized)) return "360p";
  return "Unknown";
}

function __doomQualityRank(quality) {
  var normalized = String(quality || "").toLowerCase();
  if (normalized.indexOf("4k") !== -1 || normalized.indexOf("2160") !== -1) return 4;
  if (normalized.indexOf("1080") !== -1) return 3;
  if (normalized.indexOf("720") !== -1) return 2;
  if (normalized.indexOf("480") !== -1) return 1;
  return 0;
}

function __doomSearchCandidates(mediaInfo, season) {
  var title = mediaInfo && mediaInfo.title ? mediaInfo.title : "";
  var candidates = [];
  if (title && season) {
    candidates.push(title + " Season " + season);
    candidates.push(title + " S" + String(season).padStart(2, "0"));
  }
  if (title) candidates.push(title);
  return candidates.filter(function(value, index, list) {
    return value && list.indexOf(value) === index;
  });
}

function __doomPickHdhubSearchResult(mediaInfo, results, mediaType, season) {
  if (!Array.isArray(results) || results.length === 0) return null;
  if (typeof findBestTitleMatch === "function") {
    var best = findBestTitleMatch(mediaInfo, results, mediaType, season);
    if (best) return best;
  }
  return results[0];
}

function __doomExtractHdhubEpisodeLinksFromPage(html, pageUrl, wantedEpisode) {
  var sections = [];
  var headingRe = /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi;
  var headingMatch;
  var episodeHeading = null;

  while ((headingMatch = headingRe.exec(html)) !== null) {
    var headingText = __doomPlainText(headingMatch[0]);
    var epMatch = headingText.match(/(?:episode|epi?sode)\s*0*(\d+)|\bE(?:P)?\s*0*(\d+)\b/i);
    if (epMatch && Number(epMatch[1] || epMatch[2]) === Number(wantedEpisode)) {
      episodeHeading = {
        start: headingMatch.index,
        end: headingRe.lastIndex
      };
      break;
    }
  }

  if (!episodeHeading) return sections;

  var nextEpisodeRe = /<h[1-6][^>]*>[\s\S]*?(?:episode|epi?sode)\s*\d+[\s\S]*?<\/h[1-6]>/gi;
  nextEpisodeRe.lastIndex = episodeHeading.end;
  var nextEpisodeMatch = nextEpisodeRe.exec(html);
  var segmentEnd = nextEpisodeMatch ? nextEpisodeMatch.index : html.length;
  var segment = html.slice(episodeHeading.end, segmentEnd);
  var anchorRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  var anchorMatch;
  var seen = Object.create(null);

  function looksLikeDownloadHref(href, text) {
    var value = String(href || "").toLowerCase();
    var label = String(text || "").toLowerCase();
    if (!value || value.indexOf("#") === 0 || value.indexOf("javascript:") === 0) return false;
    if (/hubcloud|hubdrive|hubcdn|hubstream|hblinks|hdstream4u|vidstack|pixeldrain|streamtape|techyboy|gadgetsweb|cryptoinsights|bloggingvector|ampproject|homelander|workers\.dev/.test(value)) return true;
    if (/\.(mkv|mp4|m3u8)(?:[?#]|$)/i.test(value)) return true;
    if (/(drive|instant|watch|download|hubcloud|hubdrive)/i.test(label)) return true;
    return false;
  }

  while ((anchorMatch = anchorRe.exec(segment)) !== null) {
    var rawHref = anchorMatch[1];
    var anchorText = __doomPlainText(anchorMatch[2]);
    var contextStart = Math.max(0, anchorMatch.index - 800);
    var contextEnd = Math.min(segment.length, anchorRe.lastIndex + 800);
    var context = __doomPlainText(segment.slice(contextStart, contextEnd));
    var href = __doomResolveHdhubUrl(rawHref, pageUrl);
    if (!looksLikeDownloadHref(href, anchorText)) continue;
    if (seen[href]) continue;
    seen[href] = true;
    sections.push({
      href: href,
      quality: __doomQualityFromText(context),
      label: context || anchorText
    });
  }

  return sections;
}

async function __doomHdhubTvEpisodeFallback(tmdbId, mediaType, season, episode) {
  if (mediaType !== "tv" && mediaType !== "series") return [];
  if (!season || !episode) return [];
  if (typeof getTMDBDetails !== "function" || typeof search !== "function" || typeof loadExtractor !== "function") {
    return [];
  }

  var mediaInfo = await getTMDBDetails(tmdbId, mediaType);
  var candidates = __doomSearchCandidates(mediaInfo, season);
  var selectedMedia = null;

  for (var i = 0; i < candidates.length && !selectedMedia; i += 1) {
    var results = await search(candidates[i]);
    selectedMedia = __doomPickHdhubSearchResult(mediaInfo, results, mediaType, season);
  }

  if (!selectedMedia || !selectedMedia.url) return [];

  var domain = typeof getCurrentDomain === "function" ? await getCurrentDomain() : "";
  var pageUrl = selectedMedia.url;
  if (domain && /hdhub4u\./i.test(pageUrl)) {
    try {
      var parsedPage = new URL(pageUrl);
      var parsedDomain = new URL(domain);
      parsedPage.hostname = parsedDomain.hostname;
      pageUrl = parsedPage.toString();
    } catch (_) {}
  }

  var response = await fetch(pageUrl, {
    headers: typeof __spreadProps === "function" && typeof __spreadValues === "function"
      ? __spreadProps(__spreadValues({}, HEADERS || {}), { Referer: domain ? domain + "/" : pageUrl })
      : (HEADERS || {})
  });
  if (!response || !response.ok) return [];

  var html = await response.text();
  var sections = __doomExtractHdhubEpisodeLinksFromPage(html, pageUrl, episode);
  if (sections.length === 0) return [];

  var extractedGroups = await Promise.all(sections.map(function(section) {
    return Promise.resolve(loadExtractor(section.href, pageUrl))
      .then(function(links) {
        return (Array.isArray(links) ? links : []).map(function(link) {
          var quality = link.quality && link.quality !== "Unknown" ? link.quality : section.quality;
          return Object.assign({}, link, {
            quality: quality,
            episode: Number(episode),
            fileName: link.fileName || mediaInfo.title + " S" + String(season).padStart(2, "0") + "E" + String(episode).padStart(2, "0")
          });
        });
      })
      .catch(function() { return []; });
  }));

  var seen = Object.create(null);
  return extractedGroups.flat().filter(function(link) {
    if (!link || !link.url || String(link.url).indexOf(".zip") !== -1) return false;
    if (seen[link.url]) return false;
    seen[link.url] = true;
    return true;
  }).map(function(link) {
    var serverName = typeof extractServerName === "function" ? extractServerName(link.source) : (link.source || "HDHub4u");
    var quality = link.quality || "Unknown";
    return {
      name: "HDHub4u " + serverName,
      title: link.fileName || mediaInfo.title + " S" + String(season).padStart(2, "0") + "E" + String(episode).padStart(2, "0"),
      url: link.url,
      quality: quality,
      size: typeof formatBytes === "function" ? formatBytes(link.size) : link.size,
      headers: link.headers || HEADERS,
      provider: "hdhub4u"
    };
  }).sort(function(a, b) {
    return __doomQualityRank(b.quality) - __doomQualityRank(a.quality);
  });
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomHdhubTvFallbackWrapped) return;

  var __doomOriginalHdhubGetStreams = getStreams;
  var __doomWrappedHdhubGetStreams = function(tmdbId, mediaType, season, episode) {
    var args = arguments;
    return Promise.resolve(__doomOriginalHdhubGetStreams.apply(this, args))
      .then(function(streams) {
        if (Array.isArray(streams) && streams.length > 0) return streams;
        return __doomHdhubTvEpisodeFallback(tmdbId, mediaType, season, episode);
      })
      .catch(function() {
        return __doomHdhubTvEpisodeFallback(tmdbId, mediaType, season, episode);
      });
  };

  __doomWrappedHdhubGetStreams.__doomHdhubTvFallbackWrapped = true;
  getStreams = __doomWrappedHdhubGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();
"""
NETMIRROR_DURATION_FILTER_SNIPPET = r"""
// __DOOM_NETMIRROR_DURATION_FILTER__
var __doomNetMirrorMinDurationSeconds = 10 * 60;
var __doomNetMirrorDurationTimeoutMs = 5 * 1000;

function __doomNetMirrorParseDuration(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" && isFinite(value) && value > 0) {
    return value > 24 * 60 * 60 ? Math.round(value / 1000) : Math.round(value);
  }

  var text = String(value || "").trim().toLowerCase();
  if (!text) return null;
  var colon = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colon) {
    var parts = text.split(":").map(function(part) { return Number(part); });
    return parts.length === 3
      ? parts[0] * 3600 + parts[1] * 60 + parts[2]
      : parts[0] * 60 + parts[1];
  }

  var hours = text.match(/([\d.]+)\s*(?:h|hr|hrs|hour|hours)\b/);
  var minutes = text.match(/([\d.]+)\s*(?:m|min|mins|minute|minutes)\b/);
  var seconds = text.match(/([\d.]+)\s*(?:s|sec|secs|second|seconds)\b/);
  var total = 0;
  if (hours) total += Number(hours[1]) * 3600;
  if (minutes) total += Number(minutes[1]) * 60;
  if (seconds) total += Number(seconds[1]);
  if (total > 0) return Math.round(total);

  var numeric = text.match(/^\d+(?:\.\d+)?$/);
  if (numeric) {
    var amount = Number(text);
    return amount > 24 * 60 * 60 ? Math.round(amount / 1000) : Math.round(amount);
  }
  return null;
}

function __doomNetMirrorKnownDuration(stream) {
  var hints = stream && stream.behaviorHints ? stream.behaviorHints : {};
  var values = [
    stream && stream.duration,
    stream && stream.runtime,
    stream && stream.length,
    stream && stream.videoDuration,
    stream && stream.durationSeconds,
    hints.duration,
    hints.runtime,
    hints.videoDuration
  ];
  for (var index = 0; index < values.length; index += 1) {
    var parsed = __doomNetMirrorParseDuration(values[index]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function __doomNetMirrorResolveUrl(baseUrl, nextUrl) {
  try {
    return new URL(nextUrl, baseUrl).toString();
  } catch (error) {
    return nextUrl;
  }
}

function __doomNetMirrorFetchText(url, headers) {
  if (typeof fetch !== "function") return Promise.resolve(null);
  return __doomWithTimeout(fetch(url, {
    method: "GET",
    headers: headers || {},
    redirect: "follow"
  }), __doomNetMirrorDurationTimeoutMs)
    .then(function(response) {
      if (!response || !response.ok || !response.text) return null;
      return response.text();
    })
    .catch(function() {
      return null;
    });
}

function __doomNetMirrorPlaylistDuration(stream, depth) {
  if (!stream || !stream.url || !__doomLooksLikeHls(stream.url, "")) {
    return Promise.resolve(null);
  }
  if (depth > 1) return Promise.resolve(null);

  var headers = __doomMergeHeaders({}, stream.headers || {});
  return __doomNetMirrorFetchText(stream.url, headers).then(function(text) {
    if (!text) return null;

    var total = 0;
    var extinfPattern = /#EXTINF:([\d.]+)/g;
    var match;
    while ((match = extinfPattern.exec(text)) !== null) {
      total += Number(match[1]) || 0;
    }
    if (total > 0) return Math.round(total);

    if (/#EXT-X-STREAM-INF/i.test(text)) {
      var lines = text.split(/\r?\n/);
      for (var index = 0; index < lines.length; index += 1) {
        if (!/^#EXT-X-STREAM-INF/i.test(lines[index])) continue;
        for (var next = index + 1; next < lines.length; next += 1) {
          var line = lines[next].trim();
          if (!line || line.charAt(0) === "#") continue;
          var childStream = Object.assign({}, stream, {
            url: __doomNetMirrorResolveUrl(stream.url, line)
          });
          return __doomNetMirrorPlaylistDuration(childStream, depth + 1);
        }
      }
    }
    return null;
  });
}

function __doomNetMirrorDurationSeconds(stream) {
  var known = __doomNetMirrorKnownDuration(stream);
  if (known !== null) return Promise.resolve(known);
  return __doomNetMirrorPlaylistDuration(stream, 0);
}

function __doomNetMirrorFilterShortStreams(streams) {
  if (!Array.isArray(streams) || streams.length === 0) return Promise.resolve([]);

  return Promise.all(streams.map(function(stream) {
    return __doomNetMirrorDurationSeconds(stream)
      .then(function(seconds) { return { stream: stream, seconds: seconds }; })
      .catch(function() { return { stream: stream, seconds: null }; });
  })).then(function(results) {
    return results.filter(function(item) {
      if (item.seconds === null || item.seconds === undefined) return true;
      if (item.seconds >= __doomNetMirrorMinDurationSeconds) return true;
      console.log("[NetMirror Yoruix] Rejected short video stream under 10 minutes (" + item.seconds + "s)");
      return false;
    }).map(function(item) {
      return item.stream;
    });
  });
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomNetMirrorDurationWrapped) return;

  var __doomNetMirrorOriginalGetStreams = getStreams;
  var __doomNetMirrorWrappedGetStreams = function() {
    return Promise.resolve(__doomNetMirrorOriginalGetStreams.apply(this, arguments))
      .then(__doomNetMirrorFilterShortStreams);
  };

  __doomNetMirrorWrappedGetStreams.__doomNetMirrorDurationWrapped = true;
  getStreams = __doomNetMirrorWrappedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();
"""
STREAM_NORMALIZATION_SNIPPET = r"""
// __DOOM_STREAM_NORMALIZATION__
function __doomNormalizeHeaders(headers) {
  if (!headers || typeof headers !== "object") return null;
  var normalized = {};
  var key;
  for (key in headers) {
    if (headers[key] !== undefined && headers[key] !== null && headers[key] !== "") {
      normalized[key] = String(headers[key]);
    }
  }
  return Object.keys(normalized).length ? normalized : null;
}

function __doomLooksWebReady(url) {
  var normalized = String(url || "").toLowerCase();
  return normalized.indexOf("https://") === 0
    && (normalized.indexOf(".mp4") !== -1 || normalized.indexOf("format=mp4") !== -1);
}

function __doomNormalizeStream(rawStream) {
  if (!rawStream || typeof rawStream !== "object") return null;
  var targetUrl = rawStream.url || rawStream.externalUrl;
  if (!targetUrl || typeof targetUrl !== "string") return null;

  var requestHeaders = __doomNormalizeHeaders(rawStream.headers);
  var behaviorHints = {};
  var key;
  for (key in rawStream.behaviorHints || {}) behaviorHints[key] = rawStream.behaviorHints[key];

  if (rawStream.fileName && !behaviorHints.filename) behaviorHints.filename = rawStream.fileName;
  if (typeof rawStream.size === "number" && rawStream.size > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = rawStream.size;
  }
  if (typeof rawStream.videoSize === "number" && rawStream.videoSize > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = rawStream.videoSize;
  }
  if (!behaviorHints.bingeGroup) {
    var providerId = typeof PLUGIN_TAG !== "undefined" ? PLUGIN_TAG : (typeof TAG !== "undefined" ? TAG : "doom-addon");
    behaviorHints.bingeGroup = String(providerId).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  }
  if (!__doomLooksWebReady(targetUrl) || requestHeaders) behaviorHints.notWebReady = true;
  if (requestHeaders) behaviorHints.proxyHeaders = { request: requestHeaders };

  var description = rawStream.description || rawStream.title || rawStream.name || "Doom-addon-S stream";
  return {
    name: rawStream.name || "Doom-addon-S",
    title: description,
    description: description,
    url: targetUrl,
    behaviorHints: behaviorHints
  };
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomNormalizedWrapped) return;

  var __doomOriginalGetStreamsForNormalization = getStreams;
  var __doomNormalizedGetStreams = function() {
    return Promise.resolve(__doomOriginalGetStreamsForNormalization.apply(this, arguments))
      .then(function(streams) {
        if (!Array.isArray(streams)) return [];
        return streams.map(__doomNormalizeStream).filter(Boolean);
      });
  };

  __doomNormalizedGetStreams.__doomNormalizedWrapped = true;
  getStreams = __doomNormalizedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();
"""


@dataclass(frozen=True)
class Provider:
    scraper_id: str
    upstream_paths: tuple[str, ...]
    local_path_str: str
    discovery_terms: tuple[str, ...] = ()
    upstream_raw_base: str = D3ADLYROCKET_UPSTREAM_RAW_BASE
    upstream_tree_api: str = D3ADLYROCKET_UPSTREAM_TREE_API

    @property
    def local_path(self) -> Path:
        return REPO_ROOT / self.local_path_str


@dataclass(frozen=True)
class ResolvedProvider:
    provider: Provider
    upstream_path: str

    @property
    def scraper_id(self) -> str:
        return self.provider.scraper_id

    @property
    def upstream_url(self) -> str:
        return f"{self.provider.upstream_raw_base}/{self.upstream_path}"


PROVIDERS = (
    Provider("4khdhub", ("providers/4khdhub.js", "providers/4khdhubtest.js"), "providers/4khdhub.js", ("4khdhub", "hubcloud")),
    Provider("4khdhubtv", ("providers/4khdhub_tv.js",), "providers/4khdhub_tv.js"),
    Provider("hdhub4u", ("providers/hdhub4u.js", "src/hdhub4u/index.js"), "providers/hdhub4u.js", ("hdhub4u",)),
    Provider("hindmoviez", ("providers/hindmoviez.js",), "providers/hindmoviez.js", ("hindmoviez",)),
    Provider("movieblast", ("providers/movieblast.js",), "providers/movieblast.js", ("movieblast",)),
    Provider("moviebox", ("providers/moviebox.js",), "providers/moviebox.js", ("moviebox",)),
    Provider("movieboxhindi", ("providers/movieboxhindi.js",), "providers/movieboxhindi.js", ("movieboxhindi", "moviebox")),
    Provider("movies4u", ("providers/movies4u.js",), "providers/movies4u.js", ("movies4u",)),
    Provider("netmirror", ("providers/netmirror.js",), "providers/netmirror.js", ("netmirror",)),
    Provider("peachify", ("providers/peachify.js",), "providers/peachify.js", ("peachify",)),
    Provider("vegamovies", ("providers/vegamovies.js",), "providers/vegamovies.js", ("vegamovies", "hubcloud")),
    Provider("vidlink", ("providers/vidlink.js",), "providers/vidlink.js", ("vidlink",)),
    Provider("uhdmovies", ("providers/uhdmovies.js",), "providers/uhdmovies.js", ("uhdmovies",)),
    Provider("4khdhubnew", ("providers/4khdhubnew.js",), "providers/4khdhubnew.js", ("4khdhubnew", "4khdhub", "hubcloud")),
    Provider("4khdhub_yoruix", ("providers/4khdhub.js",), "providers/4khdhub_yoruix.js", ("4khdhub", "hubcloud", "yoruix"), YORUIX_UPSTREAM_RAW_BASE, YORUIX_UPSTREAM_TREE_API),
    Provider("hdhub4u_yoruix", ("providers/hdhub4u.js", "src/hdhub4u/index.js"), "providers/hdhub4u_yoruix.js", ("hdhub4u", "yoruix"), YORUIX_UPSTREAM_RAW_BASE, YORUIX_UPSTREAM_TREE_API),
    Provider("moviebox_yoruix", ("providers/moviebox.js",), "providers/moviebox_yoruix.js", ("moviebox", "yoruix"), YORUIX_UPSTREAM_RAW_BASE, YORUIX_UPSTREAM_TREE_API),
    Provider("netmirror_yoruix", ("providers/netmirror.js",), "providers/netmirror_yoruix.js", ("netmirror", "yoruix"), YORUIX_UPSTREAM_RAW_BASE, YORUIX_UPSTREAM_TREE_API),
    Provider("uhdmovies_yoruix", ("providers/uhdmovies.js",), "providers/uhdmovies_yoruix.js", ("uhdmovies", "yoruix"), YORUIX_UPSTREAM_RAW_BASE, YORUIX_UPSTREAM_TREE_API),
    Provider("movieblast_yoruix", ("providers/movieblast.js",), "providers/movieblast_yoruix.js", ("movieblast", "yoruix"), YORUIX_UPSTREAM_RAW_BASE, YORUIX_UPSTREAM_TREE_API),
    Provider("moviesdrive", ("src/providers/moviesdrive.js", "providers/moviesdrive.js"), "providers/moviesdrive.js", ("moviesdrive",)),
    Provider("streamflix", ("providers/streamflix.js",), "providers/streamflix.js", ("streamflix",)),
)
MURPH_WRAPPER_IDS = {"4khdhub_murph", "hdhub4u_murph", "moviebox_murph", "movies4u_murph"}
PAUSED_UPSTREAM_PROVIDER_IDS = {"streamflix"}
LOCAL_VARIANT_UPSTREAM_PATHS = {
    # D3 does not publish a separate 4khdhub-tv provider file. Keep Doom-addon-S's
    # local variant, but verify the upstream family file still exists each sync.
    "4khdhubtv": "providers/4khdhub.js",
    # MovieBox-Hindi is a Doom-addon-S variant layered on the D3 MovieBox family.
    "movieboxhindi": "providers/moviebox.js",
}


def write_output(name: str, value: str) -> None:
    github_output = os.environ.get("GITHUB_OUTPUT")
    if not github_output:
        return
    with open(github_output, "a", encoding="utf-8") as fh:
        fh.write(f"{name}={value}\n")


def write_summary(lines: list[str]) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    with open(summary_path, "a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


def fetch_text(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def fetch_json(url: str, accept: str = "application/json") -> object:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": accept},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def fetch_upstream_tree_paths(tree_api: str) -> list[str]:
    payload = fetch_json(tree_api, "application/vnd.github+json")
    tree = payload["tree"]
    return [item["path"] for item in tree if item.get("type") == "blob"]


def fetch_upstream_manifest_paths(manifest_url: str) -> list[str]:
    payload = fetch_json(manifest_url)
    scrapers = payload.get("scrapers", []) if isinstance(payload, dict) else []
    paths: list[str] = []
    for scraper in scrapers:
        if not isinstance(scraper, dict):
            continue
        filename = scraper.get("filename")
        if isinstance(filename, str) and filename.endswith(".js"):
            paths.append(filename)
    return paths


def load_upstreams() -> dict:
    upstreams = json.loads(json.dumps(DEFAULT_UPSTREAMS))
    if not UPSTREAMS_PATH.exists():
        return upstreams

    try:
        configured = json.loads(UPSTREAMS_PATH.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"Warning: upstream config could not be read, using defaults: {exc}")
        return upstreams

    if not isinstance(configured, dict):
        print("Warning: upstream config was not an object, using defaults.")
        return upstreams

    for section in ("manifests", "repositories", "domainSources"):
        current = upstreams.setdefault(section, {})
        incoming = configured.get(section)
        if isinstance(incoming, dict):
            for key, value in incoming.items():
                if isinstance(value, str) and value:
                    current[key] = value

    cadence = configured.get("syncCadenceDays")
    if isinstance(cadence, int) and cadence > 0:
        upstreams["syncCadenceDays"] = cadence
    return upstreams


def manifest_url_for_provider(provider: Provider, upstreams: dict) -> str:
    manifests = upstreams.get("manifests", {}) if isinstance(upstreams, dict) else {}
    if provider.upstream_raw_base == YORUIX_UPSTREAM_RAW_BASE:
        return manifests.get("yoruix", YORUIX_MANIFEST_URL)
    if provider.upstream_raw_base == D3ADLYROCKET_UPSTREAM_RAW_BASE:
        return manifests.get("d3adlyrocket", D3ADLYROCKET_MANIFEST_URL)
    return ""


def normalize_token(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def score_discovered_path(provider: Provider, path: str) -> int:
    normalized_path = normalize_token(path)
    normalized_name = normalize_token(Path(path).stem)
    normalized_id = normalize_token(provider.scraper_id)
    score = 0

    if normalized_name == normalized_id:
        score += 100
    elif normalized_id and normalized_id in normalized_name:
        score += 50

    for term in provider.discovery_terms:
        normalized_term = normalize_token(term)
        if not normalized_term:
            continue
        if normalized_term in normalized_name:
            score += 30
        elif normalized_term in normalized_path:
            score += 12

    if path.startswith("providers/"):
        score += 5
    elif path.startswith("src/providers/"):
        score += 3

    return score


def candidate_upstream_paths(provider: Provider, upstream_tree_paths: list[str]) -> list[str]:
    ordered: list[str] = []
    seen: set[str] = set()
    tree_set = set(upstream_tree_paths)

    for path in provider.upstream_paths:
        if path in tree_set and path not in seen:
            ordered.append(path)
            seen.add(path)

    scored_paths = [
        (score_discovered_path(provider, path), path)
        for path in upstream_tree_paths
        if path.endswith(".js")
    ]
    scored_paths.sort(key=lambda item: (-item[0], item[1]))

    for score, path in scored_paths:
        if score < 40 or path in seen:
            continue
        ordered.append(path)
        seen.add(path)

    for path in provider.upstream_paths:
        if path not in seen:
            ordered.append(path)
            seen.add(path)

    return ordered


def patch_domain_source(text: str) -> str:
    updated, count = re.subn(
        r"""DOMAINS_URL\s*=\s*(?:"[^"]+"|'[^']+'|_0x[a-fA-F0-9]+\([^)]*\))""",
        f'DOMAINS_URL = "{ADDON_DOMAINS_URL}"',
        text,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Could not retarget DOMAINS_URL to Doom-addon-S domains.json")
    return updated


def patch_vegamovies_domain_source(text: str) -> str:
    updated, count = re.subn(
        r"""DOMAINS_JSON_URL\s*=\s*(?:"[^"]+"|'[^']+'|_0x[a-fA-F0-9]+\([^)]*\))""",
        f'DOMAINS_JSON_URL = "{ADDON_DOMAINS_URL}"',
        text,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Could not retarget DOMAINS_JSON_URL to Doom-addon-S domains.json")
    return updated


def patch_moviesdrive_domain_source(text: str) -> str:
    if "DOMAIN_JSON_URL" in text:
        updated, count = re.subn(
            r"""DOMAIN_JSON_URL\s*=\s*["'][^"']+["']""",
            f'DOMAIN_JSON_URL = "{ADDON_DOMAINS_URL}"',
            text,
            count=1,
        )
        if count != 1:
            raise RuntimeError("Could not retarget DOMAIN_JSON_URL to Doom-addon-S domains.json")
        old_block = """if (data && data[PROVIDER_KEY] && data[PROVIDER_KEY].url) {
          moviesDriveDomain = data[PROVIDER_KEY].url.replace(/\\/$/, "");
          domainCacheTimestamp = now;
          console.log(`[MoviesDrive] Domain set to: ${moviesDriveDomain}`);
        }
"""
        new_block = """if (data) {
          const resolvedDomain = data.Moviesdrive || (typeof data[PROVIDER_KEY] === "string" ? data[PROVIDER_KEY] : data[PROVIDER_KEY] && data[PROVIDER_KEY].url);
          if (resolvedDomain) {
            moviesDriveDomain = resolvedDomain.replace(/\\/$/, "");
            domainCacheTimestamp = now;
            console.log(`[MoviesDrive] Domain set to: ${moviesDriveDomain}`);
          }
        }
"""
        if old_block not in updated:
            raise RuntimeError("Could not adapt MoviesDrive domain reader to Doom-addon-S domains.json")
        return updated.replace(old_block, new_block, 1)

    if "DOMAINS_URL" in text:
        return patch_domain_source(text)

    return text


def patch_yoruix_hdhub4u_source(text: str) -> str:
    return text.replace("https://search.hdhub4u.glass", "https://search.pingora.fyi")


def patch_hindmoviez_source(text: str) -> str:
    text = re.sub(
        r"// ── Cloudflare Worker proxy[\s\S]*?const DEFAULT_HEADERS = \{",
        "const DEFAULT_HEADERS = {",
        text,
        count=1,
    )
    text, call_count = re.subn(r"(:\s*)hmProxyUrl\(([^)]+)\)", r"\1\2", text)
    text, assign_count = re.subn(
        r"((?:var|const|let)\s+proxiedUrl\s*=\s*)hmProxyUrl\(([^)]+)\);",
        r"\1\2;",
        text,
    )
    return text


def patch_seekable_validation(text: str) -> str:
    if SEEKABLE_VALIDATION_MARKER in text:
        return text
    return text.rstrip("\n") + "\n\n" + SEEKABLE_VALIDATION_SNIPPET.strip("\n") + "\n"


def patch_hdhub_tv_episode_fallback(text: str) -> str:
    if HDHUB_TV_EPISODE_FALLBACK_MARKER in text:
        return text
    return text.rstrip("\n") + "\n\n" + HDHUB_TV_EPISODE_FALLBACK_SNIPPET.strip("\n") + "\n"


def patch_netmirror_duration_filter(text: str) -> str:
    if NETMIRROR_DURATION_FILTER_MARKER in text:
        return text
    return text.rstrip("\n") + "\n\n" + NETMIRROR_DURATION_FILTER_SNIPPET.strip("\n") + "\n"


def patch_stream_normalization(text: str) -> str:
    if STREAM_NORMALIZATION_MARKER in text:
        return text
    return text.rstrip("\n") + "\n\n" + STREAM_NORMALIZATION_SNIPPET.strip("\n") + "\n"


def patch_moviebox_crypto_source(text: str) -> str:
    if "CryptoJS" not in text or "crypto-js" in text:
        return text
    return 'var CryptoJS = require("crypto-js");\n' + text.lstrip("\n")


def transform_source(provider: Provider, text: str) -> str:
    if provider.scraper_id in {"4khdhub", "4khdhubtv", "4khdhubnew", "hdhub4u", "4khdhub_yoruix", "hdhub4u_yoruix"} and "DOMAINS_URL" in text:
        text = patch_domain_source(text)
    elif provider.scraper_id == "vegamovies":
        text = patch_vegamovies_domain_source(text)
    elif provider.scraper_id == "moviesdrive":
        text = patch_moviesdrive_domain_source(text)
    if provider.scraper_id in {"moviebox", "movieboxhindi", "moviebox_yoruix"}:
        text = patch_moviebox_crypto_source(text)
    if provider.scraper_id == "hdhub4u_yoruix":
        text = patch_yoruix_hdhub4u_source(text)
    if provider.scraper_id == "hindmoviez":
        text = patch_hindmoviez_source(text)
    if provider.scraper_id in {"hdhub4u", "hdhub4u_yoruix"}:
        text = patch_hdhub_tv_episode_fallback(text)
    text = patch_seekable_validation(text)
    if provider.scraper_id == "netmirror_yoruix":
        text = patch_netmirror_duration_filter(text)
    text = patch_stream_normalization(text)
    return "\n".join(line.rstrip() for line in text.rstrip("\n").splitlines()) + "\n"


def bump_patch(version: str) -> str:
    parts = version.split(".")
    if len(parts) != 3 or not all(part.isdigit() for part in parts):
        raise ValueError(f"Expected semantic version x.y.z, got {version!r}")
    major, minor, patch = (int(part) for part in parts)
    return f"{major}.{minor}.{patch + 1}"


def load_provider_registry() -> dict:
    return json.loads(PROVIDER_REGISTRY_PATH.read_text(encoding="utf-8"))


def write_json_if_changed(path: Path, payload: dict) -> bool:
    next_text = json.dumps(payload, indent=2) + "\n"
    current_text = path.read_text(encoding="utf-8") if path.exists() else ""
    if current_text == next_text:
        return False
    path.write_text(next_text, encoding="utf-8")
    return True


def normalize_domain_value(value: object) -> str:
    if isinstance(value, str):
        return value.rstrip("/")
    if isinstance(value, dict):
        nested = value.get("url") or value.get("domain")
        if isinstance(nested, str):
            return nested.rstrip("/")
    return ""


def extract_first_domain(text: str, contains: str) -> str:
    pattern = re.compile(r"""https?://[^'"`\s)]+""")
    for match in pattern.finditer(text):
        value = match.group(0).rstrip("/")
        if contains.lower() in value.lower():
            return value
    return ""


def domain_patterns_by_local_key() -> dict[str, tuple[str, ...]]:
    return {
        "4khdhub": ("4khdhub",),
        "HDHUB4u": ("hdhub4u",),
        "vegamovies": ("vegamovies",),
        "hubcloud": ("hubcloud",),
        "Moviesdrive": ("moviesdrive", "moviesdrives"),
    }


def raw_domain_candidates_by_local_key(upstream_tree_cache: dict[str, list[str]]) -> tuple[dict[str, list[str]], list[str]]:
    candidates: dict[str, list[str]] = {key: [] for key in domain_patterns_by_local_key()}
    warnings: list[str] = []

    for provider in PROVIDERS:
        if provider.scraper_id in PAUSED_UPSTREAM_PROVIDER_IDS:
            continue
        try:
            upstream_tree_paths = upstream_tree_cache.get(provider.upstream_tree_api)
            if upstream_tree_paths is None:
                upstream_tree_paths = fetch_upstream_tree_paths(provider.upstream_tree_api)
                upstream_tree_cache[provider.upstream_tree_api] = upstream_tree_paths
        except Exception as exc:
            upstream_tree_paths = []
            warnings.append(f"Domain sync could not list raw paths for `{provider.scraper_id}`: {exc}")

        for upstream_path in candidate_upstream_paths(provider, upstream_tree_paths):
            try:
                text = fetch_text(f"{provider.upstream_raw_base}/{upstream_path}")
                break
            except HTTPError as exc:
                if exc.code == 404:
                    continue
                warnings.append(f"Domain sync could not inspect `{provider.scraper_id}` raw path `{upstream_path}`: {exc}")
                text = ""
                break
            except Exception as exc:
                warnings.append(f"Domain sync could not inspect `{provider.scraper_id}` raw path `{upstream_path}`: {exc}")
                text = ""
                break
        else:
            text = ""

        if not text:
            continue

        for local_key, patterns in domain_patterns_by_local_key().items():
            for pattern in patterns:
                value = extract_first_domain(text, pattern)
                if value and value not in candidates[local_key]:
                    candidates[local_key].append(value)

    return candidates, warnings


def preferred_raw_domain_defaults(upstream_tree_cache: dict[str, list[str]]) -> tuple[dict[str, str], list[str]]:
    defaults: dict[str, str] = {}
    candidates, warnings = raw_domain_candidates_by_local_key(upstream_tree_cache)
    for local_key, values in candidates.items():
        if not values:
            continue
        if local_key == "4khdhub":
            preferred = next((value for value in values if "4khdhub.click" in value), values[0])
        elif local_key == "HDHUB4u":
            preferred = next((value for value in values if "new6.hdhub4u.fo" in value), values[0])
        else:
            preferred = values[0]
        defaults[local_key] = preferred
    return defaults, warnings


def sync_domains(upstream_tree_cache: dict[str, list[str]] | None = None) -> tuple[set[str], list[str]]:
    warnings: list[str] = []
    upstream_tree_cache = upstream_tree_cache if upstream_tree_cache is not None else {}
    try:
        upstream = fetch_json(UPSTREAM_DOMAINS_URL)
    except Exception as exc:
        return set(), [f"Domain sync failed: {exc}"]

    if not isinstance(upstream, dict):
        return set(), ["Domain sync failed: upstream domains payload was not an object."]

    provider_defaults, provider_domain_warnings = preferred_raw_domain_defaults(upstream_tree_cache)
    warnings.extend(provider_domain_warnings)

    local = json.loads((REPO_ROOT / "domains.json").read_text(encoding="utf-8"))
    domain_map = {
        "4khdhub": ("4khdhub", {"4khdhub", "4khdhubtv", "4khdhub_yoruix", "4khdhubnew"}),
        "HDHUB4u": ("HDHUB4u", {"hdhub4u", "hdhub4u_yoruix"}),
        "vegamovies": ("vegamovies", {"vegamovies"}),
        "hubcloud": ("hubcloud", {"vegamovies", "4khdhub", "4khdhubnew", "4khdhub_yoruix"}),
        "Moviesdrive": ("moviesdrive", {"moviesdrive"}),
    }

    changed_ids: set[str] = set()
    for local_key, (upstream_key, affected_ids) in domain_map.items():
        next_value = normalize_domain_value(
            provider_defaults.get(local_key)
            or upstream.get(upstream_key)
            or upstream.get(local_key)
        )
        if not next_value:
            warnings.append(f"Domain sync did not find `{upstream_key}` in upstream domains.")
            continue
        if local.get(local_key) != next_value:
            local[local_key] = next_value
            changed_ids.update(affected_ids)

    if changed_ids:
        write_json_if_changed(REPO_ROOT / "domains.json", local)

    return changed_ids, warnings


def provider_names(registry: dict) -> list[str]:
    return [scraper["name"] for scraper in registry.get("scrapers", []) if scraper.get("enabled", True)]


def addon_description(names: list[str]) -> str:
    return "A Stremio stream add-on wrapping the Doom-addon-S provider set: " + ", ".join(names) + "."


def package_description(names: list[str]) -> str:
    return "Doom-addon-S: a Stremio stream add-on with " + ", ".join(names) + "."


def update_versions(changed_ids: set[str]) -> tuple[bool, list[str], dict]:
    registry = load_provider_registry()
    if not changed_ids:
        return False, [], registry

    changes: list[str] = []
    old_repo_version = registry["version"]
    registry["version"] = bump_patch(old_repo_version)
    changes.append(f"Doom-addon-S providers: `{old_repo_version}` -> `{registry['version']}`")

    for scraper in registry.get("scrapers", []):
        if scraper.get("id") not in changed_ids:
            continue
        old_version = scraper["version"]
        scraper["version"] = bump_patch(old_version)
        changes.append(f"{scraper['name']}: `{old_version}` -> `{scraper['version']}`")

    return write_json_if_changed(PROVIDER_REGISTRY_PATH, registry), changes, registry


def update_stremio_manifest(registry: dict) -> bool:
    stremio_manifest = json.loads(STREMIO_MANIFEST_PATH.read_text(encoding="utf-8"))
    names = provider_names(registry)
    stremio_manifest["version"] = registry["version"]
    stremio_manifest["id"] = "community.doomplug.s"
    stremio_manifest["name"] = "Doom-addon-S"
    stremio_manifest["logo"] = "https://doom-addon-s.zxflix.com/assets/umbrella-icon.png"
    stremio_manifest["description"] = addon_description(names)
    return write_json_if_changed(STREMIO_MANIFEST_PATH, stremio_manifest)


def update_package(registry: dict) -> bool:
    package_json = json.loads(PACKAGE_PATH.read_text(encoding="utf-8"))
    names = provider_names(registry)
    package_json["version"] = registry["version"]
    package_json["description"] = package_description(names)
    return write_json_if_changed(PACKAGE_PATH, package_json)


def check_manifest_available(label: str, manifest_url: str) -> list[str]:
    try:
        manifest = fetch_json(manifest_url)
    except Exception as exc:
        return [f"{label} manifest check failed: {exc}"]

    if not isinstance(manifest, dict):
        return [f"{label} manifest check failed: payload was not an object."]

    resources = manifest.get("resources", [])
    has_stream = "stream" in resources
    if isinstance(resources, list):
        has_stream = has_stream or any(
            isinstance(resource, dict) and resource.get("name") == "stream"
            for resource in resources
        )
    if not has_stream:
        return [f"{label} manifest did not expose a stream resource during this check."]
    return []


def check_murph_manifest(manifest_url: str) -> list[str]:
    warnings: list[str] = []
    try:
        manifest = fetch_json(manifest_url)
    except Exception as exc:
        return [f"Murph manifest check failed: {exc}"]

    manifest_text = json.dumps(manifest).lower()
    for label in ("4khdhub", "hdhub4u"):
        if label not in manifest_text:
            warnings.append(f"Murph manifest did not expose `{label}` text during this check.")
    return warnings


def is_due_to_run(today_utc: date, force: bool, cadence_days: int = CADENCE_DAYS) -> bool:
    if force:
        return True
    delta_days = (today_utc - ANCHOR_DATE).days
    return delta_days >= 0 and delta_days % cadence_days == 0


def main() -> int:
    force = os.environ.get("FORCE_SYNC", "false").lower() == "true"
    today_utc = datetime.now(timezone.utc).date()
    upstreams = load_upstreams()
    cadence_days = int(upstreams.get("syncCadenceDays") or CADENCE_DAYS)
    manifests = upstreams.get("manifests", {}) if isinstance(upstreams, dict) else {}

    if not is_due_to_run(today_utc, force, cadence_days):
        write_output("changed", "false")
        write_output("skipped", "true")
        write_summary([
            "## Doom-addon-S direct upstream sync",
            "",
            f"Skipped on `{today_utc.isoformat()}` UTC because the {cadence_days}-day cadence is anchored to `{ANCHOR_DATE.isoformat()}`.",
        ])
        print(f"Not on the {cadence_days}-day sync cadence; skipping.")
        return 0

    changed_providers: list[ResolvedProvider] = []
    sync_warnings: list[str] = []
    upstream_tree_cache: dict[str, list[str]] = {}
    upstream_manifest_cache: dict[str, list[str]] = {}
    changed_domain_ids, domain_warnings = sync_domains(upstream_tree_cache)
    sync_warnings.extend(domain_warnings)

    for provider in PROVIDERS:
        if provider.scraper_id in PAUSED_UPSTREAM_PROVIDER_IDS:
            print(f"Info: `{provider.scraper_id}` upstream sync is paused.")
            continue

        manifest_url = manifest_url_for_provider(provider, upstreams)
        if manifest_url:
            try:
                upstream_tree_paths = upstream_manifest_cache.get(manifest_url)
                if upstream_tree_paths is None:
                    upstream_tree_paths = fetch_upstream_manifest_paths(manifest_url)
                    upstream_manifest_cache[manifest_url] = upstream_tree_paths
            except Exception as exc:
                upstream_tree_paths = []
                warning = (
                    f"Manifest discovery failed for `{provider.scraper_id}` from `{manifest_url}`, so Doom-addon-S "
                    f"fell back to static paths: {exc}"
                )
                sync_warnings.append(warning)
                print(f"Warning: {warning}")
                try:
                    upstream_tree_paths = upstream_tree_cache.get(provider.upstream_tree_api)
                    if upstream_tree_paths is None:
                        upstream_tree_paths = fetch_upstream_tree_paths(provider.upstream_tree_api)
                        upstream_tree_cache[provider.upstream_tree_api] = upstream_tree_paths
                except Exception as tree_exc:
                    upstream_tree_paths = []
                    tree_warning = (
                        f"Upstream tree fallback also failed for `{provider.scraper_id}`, so Doom-addon-S "
                        f"fell back to static paths: {tree_exc}"
                    )
                    sync_warnings.append(tree_warning)
                    print(f"Warning: {tree_warning}")
        else:
            try:
                upstream_tree_paths = upstream_tree_cache.get(provider.upstream_tree_api)
                if upstream_tree_paths is None:
                    upstream_tree_paths = fetch_upstream_tree_paths(provider.upstream_tree_api)
                    upstream_tree_cache[provider.upstream_tree_api] = upstream_tree_paths
            except Exception as exc:
                upstream_tree_paths = []
                warning = (
                    f"Upstream tree discovery failed for `{provider.scraper_id}`, so Doom-addon-S "
                    f"fell back to static paths: {exc}"
                )
                sync_warnings.append(warning)
                print(f"Warning: {warning}")

        resolved_provider = None
        upstream_text = None

        for upstream_path in candidate_upstream_paths(provider, upstream_tree_paths):
            try:
                upstream_text = fetch_text(f"{provider.upstream_raw_base}/{upstream_path}")
                resolved_provider = ResolvedProvider(provider, upstream_path)
                if upstream_path != provider.upstream_paths[0]:
                    print(f"Info: `{provider.scraper_id}` auto-followed upstream path `{upstream_path}`.")
                break
            except HTTPError as exc:
                if exc.code == 404:
                    continue
                raise

        if resolved_provider is None or upstream_text is None:
            variant_path = LOCAL_VARIANT_UPSTREAM_PATHS.get(provider.scraper_id)
            if variant_path:
                try:
                    fetch_text(f"{provider.upstream_raw_base}/{variant_path}")
                    print(
                        f"Info: `{provider.scraper_id}` is an intentional Doom-addon-S local variant "
                        f"tracked against upstream `{variant_path}`."
                    )
                    continue
                except Exception as exc:
                    warning = (
                        f"`{provider.scraper_id}` local variant could not verify upstream `{variant_path}`: {exc}"
                    )
                    sync_warnings.append(warning)
                    print(f"Warning: {warning}")
                    continue
            warning = f"`{provider.scraper_id}` was skipped because no compatible upstream provider file could be found automatically."
            sync_warnings.append(warning)
            print(f"Warning: {warning}")
            continue

        try:
            transformed_text = transform_source(provider, upstream_text)
        except RuntimeError as exc:
            warning = f"`{provider.scraper_id}` was skipped because Doom-addon-S patching failed: {exc}"
            sync_warnings.append(warning)
            print(f"Warning: {warning}")
            continue

        local_text = provider.local_path.read_text(encoding="utf-8") if provider.local_path.exists() else ""
        if transformed_text != local_text:
            provider.local_path.parent.mkdir(parents=True, exist_ok=True)
            provider.local_path.write_text(transformed_text, encoding="utf-8")
            changed_providers.append(resolved_provider)

    flixnest_manifest_url = manifests.get("flixnest", FLIX_STREAMS_MANIFEST_URL)
    murph_manifest_url = manifests.get("murph", MURPH_MANIFEST_URL)
    webstreamrmbg_manifest_url = manifests.get("webstreamrmbg", WEBSTREAMRMBG_MANIFEST_URL)
    torbox_manifest_url = manifests.get("torbox", TORBOX_MANIFEST_URL)
    sync_warnings.extend(check_manifest_available("Flixnest", flixnest_manifest_url))
    sync_warnings.extend(check_manifest_available("WebStreamrMBG", webstreamrmbg_manifest_url))
    sync_warnings.extend(check_manifest_available("Torbox", torbox_manifest_url))
    sync_warnings.extend(check_murph_manifest(murph_manifest_url))

    changed_ids = {provider.scraper_id for provider in changed_providers} | changed_domain_ids
    registry_changed, version_changes, registry = update_versions(changed_ids)
    changed_files: list[str] = [provider.provider.local_path_str for provider in changed_providers]
    if changed_domain_ids:
        changed_files.append("domains.json")

    if changed_ids:
        if registry_changed:
            changed_files.append("providers.json")
        if update_stremio_manifest(registry):
            changed_files.append("manifest.json")
        if update_package(registry):
            changed_files.append("package.json")

    changed = bool(changed_files)
    changed_names = ",".join(sorted(changed_ids))
    write_output("changed", "true" if changed else "false")
    write_output("skipped", "false")
    write_output("changed_scrapers", changed_names)

    summary_lines = [
        "## Doom-addon-S direct upstream sync",
        "",
        f"Checked original upstreams on `{today_utc.isoformat()}` UTC.",
        f"Changed: `{'true' if changed else 'false'}`",
        "",
        "Sources:",
        f"- `{manifests.get('d3adlyrocket', D3ADLYROCKET_MANIFEST_URL)}`",
        f"- `{manifests.get('yoruix', YORUIX_MANIFEST_URL)}`",
        f"- `{flixnest_manifest_url}`",
        f"- `{UPSTREAM_DOMAINS_URL}`",
        f"- `{murph_manifest_url}`",
        f"- `{webstreamrmbg_manifest_url}`",
        f"- `{upstreams.get('repositories', {}).get('webstreamrmbg', WEBSTREAMRMBG_REPOSITORY_URL)}`",
        f"- `{torbox_manifest_url}`",
    ]
    if changed_ids:
        summary_lines.extend(["", f"Updated scrapers: `{changed_names}`", "", "Version bumps:"])
        summary_lines.extend(f"- {item}" for item in version_changes)
        summary_lines.extend(["", "Changed files:"])
        summary_lines.extend(f"- `{path}`" for path in changed_files)
    else:
        summary_lines.extend(["", "No upstream provider file changes were applied."])
    if sync_warnings:
        summary_lines.extend(["", "Warnings:"])
        summary_lines.extend(f"- {item}" for item in sync_warnings)
    write_summary(summary_lines)

    if changed:
        print("Updated from original upstreams:")
        for path in changed_files:
            print(f"- {path}")
    else:
        print("No original upstream provider changes detected.")
    if sync_warnings:
        print("Warnings:")
        for warning in sync_warnings:
            print(f"- {warning}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
