const cheerio = require('cheerio-without-node-native');

const DEFAULT_BASE = 'https://fibwatch.art';
const DOMAIN_LIST = 'https://raw.githubusercontent.com/phisher98/TVVVV/refs/heads/main/domains.json';
const TMDB_KEY = '439c478a771f35c05022f9feabcca01c';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function absolute(base, value) {
  if (!value) return '';
  try { return new URL(value, base).href; } catch (_) { return value; }
}

function getBase() {
  return fetch(DOMAIN_LIST, { headers: { 'User-Agent': UA } })
    .then(r => r.ok ? r.json() : {})
    .then(data => data.fibwatch || DEFAULT_BASE)
    .catch(() => DEFAULT_BASE);
}

function tmdbDetails(id, type) {
  return fetch(`https://api.themoviedb.org/3/${type === 'tv' ? 'tv' : 'movie'}/${id}?api_key=${TMDB_KEY}`, { headers: { 'User-Agent': UA } })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(`TMDB ${r.status}`)))
    .then(data => ({ title: type === 'tv' ? data.name : data.title, year: Number(((type === 'tv' ? data.first_air_date : data.release_date) || '').slice(0, 4)) || null }));
}

function search(base, title) {
  const url = `${base}/search?keyword=${encodeURIComponent(title)}&page_id=1`;
  return fetch(url, { headers: { 'User-Agent': UA, 'Referer': `${base}/`, 'Cookie': 'pop_up_18=yes' } })
    .then(r => r.ok ? r.text() : '')
    .then(html => {
      const $ = cheerio.load(html);
      const results = [];
      $('div.video-thumb').each((_, el) => {
        const card = $(el);
        const a = card.find('a[href]').first();
        const img = card.find('img').first();
        const name = (card.find('p.hptag').text() || img.attr('alt') || '').trim();
        if (a.attr('href') && name) results.push({ url: absolute(base, a.attr('href')), title: name, image: absolute(base, img.attr('src')) });
      });
      return results;
    });
}

function normalize(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function bestMatch(results, title, year) {
  const target = normalize(title);
  let best = null, bestScore = 0;
  for (const item of results) {
    const candidate = normalize(item.title);
    let score = candidate === target ? 2 : (candidate.includes(target) || target.includes(candidate) ? 1 : 0);
    const y = Number((item.title.match(/\b(19|20)\d{2}\b/) || [])[0]);
    if (year && y) score += y === year ? 0.3 : -0.2;
    if (score > bestScore) { best = item; bestScore = score; }
  }
  return bestScore >= 1 ? best : null;
}

function findVideoId($) {
  return $('#video-id').attr('value') || $('input#video-id').val() || '';
}

function extractPageStreams(base, pageUrl, title) {
  return fetch(pageUrl, { headers: { 'User-Agent': UA, 'Referer': `${base}/`, 'Cookie': 'pop_up_18=yes' } })
    .then(r => r.ok ? r.text() : '')
    .then(html => {
      const $ = cheerio.load(html);
      const pageTitle = $('meta[property="og:title"]').attr('content') || title;
      const videoId = findVideoId($);
      if (!videoId) {
        const direct = [];
        const videoUrl = html.match(/var\s+VIDEO_URL\s*=\s*["']([^"']+)["']/i);
        if (videoUrl) direct.push({ name: 'FibWatch', title: pageTitle, url: absolute(base, videoUrl[1]), quality: 'Auto', headers: { Referer: pageUrl } });
        return direct;
      }
      return fetch(`${base}/ajax/resolution_switcher.php?video_id=${encodeURIComponent(videoId)}`, { headers: { 'User-Agent': UA, 'Referer': pageUrl, 'X-Requested-With': 'XMLHttpRequest', 'Cookie': 'pop_up_18=yes' } })
        .then(r => r.ok ? r.text() : '')
        .then(data => {
          const out = [];
          const text = typeof data === 'string' ? data : JSON.stringify(data);
          const push = (url, label) => {
            const absoluteUrl = absolute(base, url);
            if (/^https?:/i.test(absoluteUrl) && !out.some(s => s.url === absoluteUrl)) out.push({ name: 'FibWatch', title: label || pageTitle, url: absoluteUrl, quality: (label || absoluteUrl).match(/(2160p|1080p|720p|480p|360p|4k)/i)?.[0] || 'Auto', headers: { Referer: pageUrl } });
          };
          try {
            const json = JSON.parse(text);
            const walk = obj => {
              if (!obj) return;
              if (typeof obj === 'string' && /^(https?:)?\/\//i.test(obj) && /\.(m3u8|mp4|mkv)(\?|$)/i.test(obj)) push(obj);
              else if (Array.isArray(obj)) obj.forEach(walk);
              else if (typeof obj === 'object') Object.keys(obj).forEach(k => walk(obj[k]));
            };
            walk(json);
          } catch (_) {
            const re = /(?:https?:)?\\?\/?\\?["']?([^\s"'<>]+\.(?:m3u8|mp4|mkv)(?:\?[^\s"'<>]*)?)/gi;
            let m;
            while ((m = re.exec(text))) push(m[1].replace(/\\\//g, '/'));
          }
          return out;
        });
  });
}

function episodePage(base, seriesUrl, season, episode) {
  return fetch(seriesUrl, { headers: { 'User-Agent': UA, 'Referer': `${base}/`, 'Cookie': 'pop_up_18=yes' } })
    .then(r => r.ok ? r.text() : '')
    .then(html => {
      const $ = cheerio.load(html);
      const videoId = findVideoId($);
      if (!videoId) return null;
      return fetch(`${base}/ajax/episodes.php?video_id=${encodeURIComponent(videoId)}`, {
        headers: { 'User-Agent': UA, 'Referer': seriesUrl, 'Cookie': 'pop_up_18=yes', 'X-Requested-With': 'XMLHttpRequest' }
      }).then(r => r.ok ? r.text() : '').then(body => {
        let data;
        try { data = JSON.parse(body); } catch (_) { data = null; }
        const items = data && (data.episodes || data.data || data.items);
        const episodeText = `s${String(season).padStart(2, '0')}e${String(episode).padStart(2, '0')}`;
        if (Array.isArray(items)) {
          const found = items.find(item => {
            const text = `${item.display || ''} ${item.title || ''}`.toLowerCase();
            const match = text.match(/s\s*(\d{1,2})\s*e\s*(\d{1,3})/i);
            if (match) return Number(match[1]) === Number(season) && Number(match[2]) === Number(episode);
            const seasonMatch = text.match(/\bseason\s*(\d+)\b/i);
            const episodeMatch = text.match(/\bepisode\s*(\d+)\b/i);
            return Number(seasonMatch && seasonMatch[1]) === Number(season) && Number(episodeMatch && episodeMatch[1]) === Number(episode);
          });
          if (found && found.url) return absolute(base, found.url);
        }
        const $episodes = cheerio.load(body);
        let href = null;
        $episodes('a[href], .video-wrapper a[href]').each((_, el) => {
          if (href) return;
          const text = `${$episodes(el).text()} ${$episodes(el).attr('title') || ''}`.toLowerCase();
          const match = text.match(/s\s*(\d{1,2})\s*e\s*(\d{1,3})/i);
          const seasonMatch = text.match(/\bseason\s*(\d+)\b/i);
          const episodeMatch = text.match(/\bepisode\s*(\d+)\b/i);
          if ((match && Number(match[1]) === Number(season) && Number(match[2]) === Number(episode)) ||
              (Number(seasonMatch && seasonMatch[1]) === Number(season) && Number(episodeMatch && episodeMatch[1]) === Number(episode))) href = $episodes(el).attr('href');
        });
        return href ? absolute(base, href) : null;
      });
    });
}

function getStreams(tmdbId, mediaType = 'movie', season, episode) {
  return Promise.all([getBase(), tmdbDetails(tmdbId, mediaType)])
    .then(([base, media]) => search(base, media.title).then(results => ({ base, media, results })))
    .then(({ base, media, results }) => {
      const match = bestMatch(results, media.title, media.year);
      if (!match) return [];
      if (mediaType === 'tv' && season != null && episode != null) {
        return episodePage(base, match.url, season, episode)
          .then(url => url ? extractPageStreams(base, url, `${match.title} S${season}E${episode}`) : []);
      }
      return extractPageStreams(base, match.url, match.title);
    })
    .catch(error => { console.error('[FibWatch] Stream lookup failed:', error.message); return []; });
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
