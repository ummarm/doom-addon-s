/**
 * netmirror - Built from src/netmirror/
 * Generated: 2026-06-06T08:44:04.688Z
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/netmirror/constants.js
var TMDB_API_KEY = "1865f43a0549ca50d341dd9ab8b29f49";
var PLATFORM_MAP = {
  netflix: {
    ott: "nf",
    search: "/mobile/search.php",
    post: "/mobile/post.php",
    episodes: "/mobile/episodes.php",
    playlist: "/mobile/playlist.php",
    img: "poster/v",
    epImg: "epimg/150"
  },
  primevideo: {
    ott: "pv",
    search: "/mobile/pv/search.php",
    post: "/mobile/pv/post.php",
    episodes: "/mobile/pv/episodes.php",
    playlist: "/mobile/pv/playlist.php",
    img: "pv/v",
    epImg: "pvepimg"
  },
  hotstar: {
    ott: "hs",
    search: "/mobile/hs/search.php",
    post: "/mobile/hs/post.php",
    episodes: "/mobile/hs/episodes.php",
    playlist: "/mobile/hs/playlist.php",
    img: "hs/v",
    epImg: "hsepimg"
  },
  disney: {
    ott: "hs",
    search: "/mobile/hs/search.php",
    post: "/mobile/hs/post.php",
    episodes: "/mobile/hs/episodes.php",
    playlist: "/mobile/hs/playlist.php",
    img: "hs/v",
    epImg: "hsepimg"
  }
};
var NEW_TV_BASE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
  "X-Requested-With": "NetmirrorNewTV v1.0",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0 /OS.GatuNewTV v1.0",
  "Accept": "application/json, text/plain, */*"
};
var NEW_TV_DOMAINS = [
  "aHR0cHM6Ly9tb2JpbGVkZXRlY3RzLmNvbQ==",
  "aHR0cHM6Ly9tb2JpbGVkZXRlY3QuYXBw",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmFydA==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNj",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmNsaWNr",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lmluaw==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LmxpdmU=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnBybw==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNob3A=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNpdGU=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnNwYWNl",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnN0b3Jl",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0LnZpcA==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lndpa2k=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0Lnh5eg==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5hcnQ=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5jYw==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbmZv",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5pbms=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5saXZl",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5wcm8=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy5zdG9yZQ==",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy50b3A=",
  "aHR0cHM6Ly9tb2JpZGV0ZWN0cy54eXo="
];

// src/netmirror/utils.js
var resolvedApiUrl = "";
function safeAtob(encoded) {
  if (typeof atob === "function") {
    return atob(encoded);
  }
  return Buffer.from(encoded, "base64").toString("binary");
}
function resolveApiUrl() {
  return __async(this, null, function* () {
    if (resolvedApiUrl)
      return resolvedApiUrl;
    for (const encoded of NEW_TV_DOMAINS) {
      const base = safeAtob(encoded).replace(/\/$/, "");
      try {
        const response = yield fetch(`${base}/checknewtv.php`, {
          headers: __spreadProps(__spreadValues({}, NEW_TV_BASE_HEADERS), { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" })
        });
        const data = yield response.json();
        const tokenHash = data.token_hash;
        if (tokenHash) {
          resolvedApiUrl = safeAtob(tokenHash).replace(/\/$/, "");
          return resolvedApiUrl;
        }
      } catch (error) {
      }
    }
    throw new Error("Failed to resolve NewTV API base URL");
  });
}
function buildNewTvHeaders(ott, extra = {}) {
  return __spreadValues(__spreadProps(__spreadValues({}, NEW_TV_BASE_HEADERS), {
    "Ott": ott
  }), extra);
}

// src/netmirror/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      const tmdbType = mediaType === "tv" ? "tv" : "movie";
      const tmdbResp = yield fetch(`https://api.themoviedb.org/3/${tmdbType}/${tmdbId}?api_key=${TMDB_API_KEY}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          "Accept": "application/json"
        }
      });
      const tmdbData = yield tmdbResp.json();
      const title = mediaType === "tv" ? tmdbData.name : tmdbData.title;
      if (!title)
        throw new Error("Could not fetch title from TMDB");
      const platforms = ["netflix", "primevideo", "hotstar", "disney"];
      for (const platformKey of platforms) {
        try {
          const streams = yield fetchFromPlatform(platformKey, title, mediaType, season, episode);
          if (streams && streams.length > 0)
            return streams;
        } catch (e) {
        }
      }
      return [];
    } catch (error) {
      return [];
    }
  });
}
function fetchFromPlatform(platformKey, title, mediaType, season, episode) {
  return __async(this, null, function* () {
    const platform = PLATFORM_MAP[platformKey];
    const apiBase = yield resolveApiUrl();
    const searchUrl = `${apiBase}/newtv/search.php?s=${encodeURIComponent(title)}`;
    const searchResp = yield fetch(searchUrl, {
      headers: buildNewTvHeaders(platform.ott)
    });
    const searchData = yield searchResp.json();
    if (!searchData.searchResult || searchData.searchResult.length === 0)
      return null;
    const result = searchData.searchResult[0];
    const contentId = result.id;
    const postUrl = `${apiBase}/newtv/post.php?id=${contentId}`;
    const postResp = yield fetch(postUrl, {
      headers: buildNewTvHeaders(platform.ott, { Lastep: "", Usertoken: "" })
    });
    const postData = yield postResp.json();
    let targetId = contentId;
    if (mediaType === "tv") {
      const episodes = yield getAllEpisodes(contentId, postData, platform, apiBase);
      const targetEp = episodes.find((ep) => ep && ep.s === season && ep.ep === episode);
      if (targetEp) {
        targetId = targetEp.id;
      } else {
        return null;
      }
    } else {
      const isSeries = postData.type === "t" || postData.episodes && postData.episodes.filter((e) => e !== null).length > 0;
      if (isSeries)
        return null;
      targetId = postData.main_id || contentId;
    }
    const playerUrl = `${apiBase}/newtv/player.php?id=${targetId}`;
    const playerResp = yield fetch(playerUrl, {
      headers: buildNewTvHeaders(platform.ott, { "Usertoken": "" })
    });
    const response = yield playerResp.json();
    if (response.status === "ok" && response.video_link) {
      return [{
        name: `NetMirror (${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)})`,
        title: `${title}`,
        url: response.video_link,
        quality: "Auto",
        headers: {
          Referer: response.referer || apiBase
        }
      }];
    }
    return null;
  });
}
function getAllEpisodes(contentId, postData, platform, apiBase) {
  return __async(this, null, function* () {
    const episodes = [];
    const selectedSeasonIdx = postData.season ? postData.season.findIndex((s) => s.selected === true) : -1;
    const selectedSeasonId = selectedSeasonIdx >= 0 ? postData.season[selectedSeasonIdx].id : postData.nextPageSeason;
    const selectedSeasonNumber = selectedSeasonIdx >= 0 ? selectedSeasonIdx + 1 : null;
    if (postData.episodes) {
      postData.episodes.filter((e) => e !== null).forEach((ep) => {
        const epNum = ep.ep ? parseInt(ep.ep) : ep.epNum ? parseInt(ep.epNum.replace("E", "")) : null;
        const sNum = selectedSeasonNumber || (ep.sNum ? parseInt(ep.sNum.replace("S", "")) : null);
        episodes.push({
          id: ep.id,
          s: sNum,
          ep: epNum
        });
      });
    }
    if (postData.nextPageShow === 1 && selectedSeasonId) {
      const more = yield fetchEpisodesPage(contentId, selectedSeasonId, 2, selectedSeasonNumber, platform, apiBase);
      episodes.push(...more);
    }
    if (postData.season) {
      for (let index = 0; index < postData.season.length; index++) {
        const season = postData.season[index];
        if (season.id !== selectedSeasonId && season.id) {
          const more = yield fetchEpisodesPage(contentId, season.id, 1, index + 1, platform, apiBase);
          episodes.push(...more);
        }
      }
    }
    return episodes;
  });
}
function fetchEpisodesPage(contentId, seasonId, page, seasonNumber, platform, apiBase) {
  return __async(this, null, function* () {
    const episodes = [];
    let pg = page;
    while (true) {
      const url = `${apiBase}/newtv/episodes.php?id=${seasonId}&page=${pg}`;
      const resp = yield fetch(url, {
        headers: buildNewTvHeaders(platform.ott)
      });
      const data = yield resp.json();
      if (data.episodes) {
        data.episodes.filter((e) => e !== null).forEach((ep) => {
          const epNum = ep.ep ? parseInt(ep.ep) : ep.epNum ? parseInt(ep.epNum.replace("E", "")) : null;
          const sNum = seasonNumber || (ep.sNum ? parseInt(ep.sNum.replace("S", "")) : null);
          episodes.push({
            id: ep.id,
            s: sNum,
            ep: epNum
          });
        });
      }
      if (data.nextPageShow !== 1)
        break;
      pg++;
    }
    return episodes;
  });
}
module.exports = { getStreams };

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
  if (!behaviorHints.bingeGroup || behaviorHints.bingeGroup === "doom-addon") {
    var providerId = typeof PLUGIN_TAG !== "undefined" ? PLUGIN_TAG : (typeof TAG !== "undefined" ? TAG : "doom-addon-s");
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
