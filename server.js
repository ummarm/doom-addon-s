"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { manifest, addonManifests, getStreams, scopeHasProvider } = require("./addon");

const PORT = Number(process.env.PORT || 7000);
const HOST = process.env.HOST || "0.0.0.0";
const ASSETS_DIR = path.join(__dirname, "assets");

function sendJson(response, statusCode, payload, cacheSeconds = 0) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheSeconds > 0 ? `public, max-age=${cacheSeconds}` : "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  response.end(body);
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(text)
  });
  response.end(text);
}

function sendFile(response, statusCode, filePath, contentType, cacheSeconds = 0) {
  const body = fs.readFileSync(filePath);
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentType,
    "Cache-Control": cacheSeconds > 0 ? `public, max-age=${cacheSeconds}` : "no-store",
    "Content-Length": body.length
  });
  response.end(body);
}

function parseStreamPath(pathname) {
  const match = pathname.match(/^\/(?:addons\/([^/]+)\/)?stream\/([^/]+)\/(.+)\.json$/);
  if (!match) {
    return null;
  }

  return {
    scope: match[1] ? decodeURIComponent(match[1]) : "main",
    type: decodeURIComponent(match[2]),
    id: decodeURIComponent(match[3])
  };
}

function parseAddonManifestPath(pathname) {
  const match = pathname.match(/^\/addons\/([^/]+)\/manifest\.json$/);
  return match ? decodeURIComponent(match[1]) : null;
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      });
      response.end();
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed" });
      return;
    }

    if (url.pathname === "/" || url.pathname === "/health") {
      sendText(
        response,
        200,
        [
          "Doom-addon Stremio add-on is running.",
          `Install URL: ${url.origin}/manifest.json`,
          `Umbrella M: ${url.origin}/addons/murph/manifest.json`,
          `Umbrella Y: ${url.origin}/addons/yoruix/manifest.json`,
          `Umbrella D: ${url.origin}/addons/d3adlyrocket/manifest.json`,
          `Umbrella F: ${url.origin}/addons/flixnest/manifest.json`,
          `Umbrella MF: ${url.origin}/addons/mediafusion/manifest.json`,
          `Umbrella AIO: ${url.origin}/addons/aiostreams/manifest.json`,
          `Umbrella 4K: ${url.origin}/addons/quality-4k/manifest.json`,
          `Umbrella 1080: ${url.origin}/addons/quality-1080/manifest.json`,
          `Umbrella Low: ${url.origin}/addons/quality-low/manifest.json`,
          ""
        ].join("\n")
      );
      return;
    }

    if (url.pathname === "/assets/umbrella-icon.png") {
      sendFile(response, 200, path.join(ASSETS_DIR, "umbrella-icon.png"), "image/png", 86400);
      return;
    }

    if (url.pathname === "/manifest.json") {
      sendJson(response, 200, manifest, 3600);
      return;
    }

    const addonManifestScope = parseAddonManifestPath(url.pathname);
    if (addonManifestScope) {
      const scopedManifest = addonManifests[addonManifestScope];
      if (!scopedManifest) {
        sendJson(response, 404, { error: "Add-on group not found" });
        return;
      }
      sendJson(response, 200, scopedManifest, 3600);
      return;
    }

    const streamRequest = parseStreamPath(url.pathname);
    if (streamRequest) {
      const streams = await getStreams(streamRequest.type, streamRequest.id, {
        scope: streamRequest.scope,
        requestHeaders: request.headers
      });
      if (!streams) {
        sendJson(response, 404, { error: "Add-on group not found" });
        return;
      }
      const cacheSeconds = scopeHasProvider(streamRequest.scope, "aiostreams") ? 0 : 300;
      sendJson(response, 200, { streams }, cacheSeconds);
      return;
    }

    sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`Doom-addon Stremio add-on listening on http://${displayHost}:${PORT}`);
});
