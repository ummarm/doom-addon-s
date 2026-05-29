# Doom-addon

Doom-addon is a Stremio stream add-on that wraps providers from the original
upstream sources directly:

- `4KHDHub`
- `HDHub4u`
- `4khdhub-tv`
- `4KHDHub Yoruix`
- `HDHub4u Murph`
- `Flix-Streams Emby`
- `Flix-Streams MkvCinemas`
- `Flix-Streams LotusVault`
- `Flix-Streams ArchiveVault`
- `Flix-Streams UHDMovies`
- `MediaFusion`
- `AIOStreams`
- `HindMoviez`
- `MovieBlast`
- `4KHDHub Murph`
- `MovieBox`
- `MoviesDrive`
- `NetMirror`
- `Peachify`

It exposes a Stremio-compatible `manifest.json` and a stream endpoint that calls
every enabled provider, merges the results, and returns Stremio stream objects.

## Files

- `manifest.json` - Stremio add-on manifest
- `providers.json` - Doom-addon provider registry and provider versions
- `addon.js` - Stremio request adapter around the provider modules
- `server.js` - HTTP server for Stremio
- `providers/4khdhub.js`
- `providers/4khdhub_tv.js`
- `providers/4khdhub_yoruix.js`
- `providers/hdhub4u.js`
- `providers/hdhub4u_murph.js`
- `providers/flix_streams_emby.js`
- `providers/flix_streams_mkvcinemas.js`
- `providers/flix_streams_lotusvault.js`
- `providers/flix_streams_archivevault.js`
- `providers/flix_streams_uhdmovies.js`
- `providers/flix_streams_vegamovies.js`
- `providers/mediafusion.js`
- `providers/aiostreams.js`
- `providers/hindmoviez.js`
- `providers/movieblast.js`
- `providers/4khdhub_murph.js`
- `providers/moviebox.js`
- `providers/moviesdrive.js`
- `providers/netmirror.js`
- `providers/peachify.js`
- `providers/streamflix.js`

## Run locally

```sh
npm install
npm start
```

The default local install URL is:

```text
http://localhost:7000/manifest.json
```

Provider-group install URLs are also exposed without changing the main add-on:

```text
http://localhost:7000/addons/murph/manifest.json        # Umbrella M
http://localhost:7000/addons/yoruix/manifest.json       # Umbrella Y
http://localhost:7000/addons/d3adlyrocket/manifest.json # Umbrella D
http://localhost:7000/addons/flixnest/manifest.json     # Umbrella F
http://localhost:7000/addons/mediafusion/manifest.json  # Umbrella MF
http://localhost:7000/addons/aiostreams/manifest.json   # Umbrella AIO
```

You can change the port with:

```sh
PORT=8080 npm start
```

Stream results are cached briefly in memory to make TV retries and repeated
opens faster. The default cache TTL is 10 minutes and can be changed with:

```sh
STREAM_CACHE_TTL_MS=600000 npm start
```

The add-on also returns a TV-safe stream batch while very slow providers keep
finishing in the background. The default provider wait is 25 seconds so the
first response includes as many streams as possible before TV clients time out:

```sh
STREAM_FAST_PROVIDER_WAIT_MS=25000 npm start
```

Flix-Streams wrappers use the configured Flix-Streams manifest URL. The checked-in
default can be overridden if the token changes:

```sh
FLIX_STREAMS_MANIFEST_URL=https://flixnest.app/flix-streams/u/<token>/manifest.json npm start
```

The Flixnest group currently wraps Emby/Media Lib, MkvCinemas, LotusVault,
ArchiveVault, and UHDMovies streams from that configured Flix-Streams URL.
VegaMovies stays registered but disabled because those links were previously
marked unreliable.

MediaFusion uses the configured MediaFusion manifest URL. The checked-in default
can be overridden if the configured add-on URL changes:

```sh
MEDIAFUSION_MANIFEST_URL=https://mediafusion.elfhosted.com/<your-id>/manifest.json npm start
```

MediaFusion streams are passed through without Umbrella card formatting,
playable probes, or de-duplication. The only MediaFusion-specific filters are
blocked source tags such as HDTC, HDTS, telesync, tele, telecine, and telecne.
MediaFusion streams must mention Hindi or English, but dual-audio streams with
other languages are kept when Hindi or English is present. MediaFusion streams
are lightly probed to remove blocked playback URLs and tiny placeholder files
that indicate a cache miss or "still downloading" response. MediaFusion streams
that cannot be verified in time are not returned. Results are ordered with
Hindi-language streams first, then quality and size sorting.

AIOStreams uses the configured AIOStreams manifest URL. The checked-in default
can be overridden if the configured add-on URL changes:

```sh
AIOSTREAMS_MANIFEST_URL=https://aiostreams.elfhosted.com/stremio/<your-id>/<config>/manifest.json npm start
```

AIOStreams streams are passed through without Umbrella card formatting,
playable probes, blocked-tag filtering, or de-duplication. The only AIOStreams
filter is Hindi/English detection, including common English/Hindi flags. Results
use the same Hindi-first quality and size sorting.

Peachify streams are language-filtered to Hindi/English and must pass the main
playback probe before they are returned, so expired proxy/error responses are
removed before Stremio receives them.

NetMirror streams are matched from the requested Stremio IMDb ID through the
addon's TMDB lookup, then enriched with that requested title/year before the
wrong-title filter runs. This keeps NetMirror's minimal `Auto` stream labels
from being rejected when the source itself does not include a filename.

## Deploy

This add-on is dynamic, so the raw GitHub URL is no longer enough for Stremio.
Deploy the repo to a Node host, then install the hosted manifest URL:

```text
https://<your-host>/manifest.json
```

The stream endpoint shape is:

```text
/stream/movie/tt0111161.json
/stream/series/tt0944947:1:1.json
/addons/murph/stream/movie/tt0111161.json
/addons/yoruix/stream/movie/tt0111161.json
/addons/d3adlyrocket/stream/movie/tt0111161.json
/addons/flixnest/stream/movie/tt0111161.json
```

## Notes

- Provider files sync directly from the original upstream sources:
  `https://github.com/D3adlyRocket/All-in-One-Nuvio`,
  `https://github.com/yoruix/nuvio-providers`, and
  `https://badboysxs-morpheus.hf.space/manifest.json`.
- If you keep redistributing these files, keep the original license terms and
  attribution in mind.
- `4KHDHub`, `4khdhub-tv`, and `HDHub4u` read domain data from this repo's
  `domains.json`.
- `HindMoviez` returns resolved direct URLs instead of relying on the upstream
  Cloudflare worker.
- `Flix-Streams Emby`, `Flix-Streams MkvCinemas`, `Flix-Streams LotusVault`,
  `Flix-Streams ArchiveVault`, and `Flix-Streams UHDMovies` wrap the configured
  Flix-Streams add-on URL and do not sync from the GitHub upstream providers.
- `Flix-Streams VegaMovies` is kept in the repo but currently disabled because
  those Flixnest links are not working reliably.
- `StreamFlix` is kept in the repo but currently disabled and paused from
  upstream sync.
- `NetMirror`, `Peachify`, `MovieBox`, and `MoviesDrive` are synced from
  `D3adlyRocket/All-in-One-Nuvio`. Peachify results are filtered to Hindi and
  English audio only.
- Provider results keep Doom-addon's working-and-seekable stream validation
  before results are returned to Stremio.
- `Umbrella M`, `Umbrella Y`, `Umbrella D`, and `Umbrella F` are separate
  installable provider-group manifests that reuse the same formatter, media
  matching, probing, sorting, cache, and upstream-synced provider files as the
  main add-on.

## Original upstream sync

This repo includes a GitHub Actions workflow at
`.github/workflows/upstream-sync.yml`.

- Doom-addon no longer syncs from Doom-plug.
- The workflow checks the original upstream sources automatically and applies
  real sync work every 2 days, anchored from `2026-04-20`.
- If a tracked upstream provider changes, the workflow updates Doom-addon's
  provider file, retargets domain lookups to this repo's `domains.json`, updates
  `providers.json`, `manifest.json`, and `package.json`, and commits the update
  directly to `main`.
- You can also run it manually from the GitHub Actions tab with `force=true`.

## Windows auto-update

On the Windows host, schedule `scripts/update-windows.ps1` to keep the running
Docker container current with GitHub. This pulls committed Doom-addon changes
after the GitHub workflow has synced and committed them.

```powershell
powershell.exe -ExecutionPolicy Bypass -File C:\server\Doom-addon\scripts\update-windows.ps1
```

Tracked upstream provider files:

- `providers/4khdhub.js`
- `providers/4khdhub_tv.js`
- `providers/4khdhub_yoruix.js`
- `providers/hdhub4u.js`
- `providers/hdhub4u_murph.js`
- `providers/flix_streams_emby.js`
- `providers/flix_streams_mkvcinemas.js`
- `providers/flix_streams_lotusvault.js`
- `providers/flix_streams_archivevault.js`
- `providers/flix_streams_uhdmovies.js`
- `providers/flix_streams_vegamovies.js`
- `providers/hindmoviez.js`
- `providers/movieblast.js`
- `providers/4khdhub_murph.js`
- `providers/moviebox.js`
- `providers/moviesdrive.js`
- `providers/netmirror.js`
- `providers/peachify.js`
