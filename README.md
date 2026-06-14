# Doom-addon-S

Doom-addon-S is a Stremio stream add-on that wraps providers from the original
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
- `Flix-Streams Other`
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
- `providers.json` - Doom-addon-S provider registry and provider versions
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
http://localhost:7000/addons/quality-4k/manifest.json   # UHD
http://localhost:7000/addons/quality-1080/manifest.json # FHD
http://localhost:7000/addons/quality-low/manifest.json  # HD
```

Hosted Stremio install URLs for this separated repo are:

```text
https://doom-addon-s.zxflix.com/manifest.json
https://doom-addon-s.zxflix.com/addons/quality-4k/manifest.json
https://doom-addon-s.zxflix.com/addons/quality-1080/manifest.json
https://doom-addon-s.zxflix.com/addons/quality-low/manifest.json
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

The add-on returns a first stream batch quickly while very slow providers keep
finishing in the background. The default first-batch wait is 8 seconds:

```sh
STREAM_FIRST_BATCH_WAIT_MS=8000 npm start
```

Provider-group add-ons use a 12 second fast wait by default:

```sh
STREAM_FAST_PROVIDER_WAIT_MS=12000 npm start
```

Quality add-ons wait longer for shared/direct providers before combining Torbox
results, so the first Stremio response is less likely to be Torbox-only:

```sh
STREAM_QUALITY_SHARED_WAIT_MS=25000 npm start
```

Direct playback mode keeps Stremio-facing streams as direct URLs after they pass
the add-on's playable/seekable probe. Header-only links are rejected instead of
being exposed as direct links:

```sh
STREAM_DIRECT_PLAYBACK_MODE=true npm start
```

Docker exposes this project on host port `7002` by default, while the container
continues to listen on port `7000` for the Cloudflare tunnel:

```text
http://localhost:7002/manifest.json
```

Flix-Streams wrappers use the configured Flix-Streams manifest URL. The checked-in
default can be overridden if the token changes:

```sh
FLIX_STREAMS_MANIFEST_URL=https://flixnest.app/flix-streams/u/<token>/manifest.json npm start
```

The Flixnest group currently wraps Emby/Media Lib, MkvCinemas, LotusVault,
ArchiveVault, UHDMovies, and any newly enabled Flix-Streams results that are
not already covered by a named wrapper.
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
playable probes, blocked-tag filtering, language filtering, or de-duplication.
Results use the same quality and size sorting.

Quality group add-ons are also exposed. `UHD` keeps UHD, 4K,
and 2160p streams. `FHD` keeps 1080p/FHD streams plus streams where no
quality can be detected. `HD` keeps 720p, 480p, 360p, and lower
streams. These quality groups use all enabled providers and keep the main
add-on rules, except AIOStreams remains pass-through before quality routing.

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
https://doom-addon-s.zxflix.com/manifest.json
```

The stream endpoint shape is:

```text
/stream/movie/tt0111161.json
/stream/series/tt0944947:1:1.json
/addons/murph/stream/movie/tt0111161.json
/addons/yoruix/stream/movie/tt0111161.json
/addons/d3adlyrocket/stream/movie/tt0111161.json
/addons/flixnest/stream/movie/tt0111161.json
/addons/quality-4k/stream/movie/tt0111161.json
/addons/quality-1080/stream/movie/tt0111161.json
/addons/quality-low/stream/movie/tt0111161.json
```

## Windows 11 Docker + Cloudflare Tunnel

This repo includes a Docker Compose setup for a separate `doom-addon-s`
container and a separate `doom-addon-s-tunnel` Cloudflare Tunnel container.

1. Clone the repo on the Windows host:

```powershell
cd C:\server
git clone https://github.com/ummarm/doom-addon-s.git Doom-addon-S
cd C:\server\Doom-addon-S
```

2. In Cloudflare Zero Trust, create a Cloudflare Tunnel for this repo. Add a
public hostname:

```text
Subdomain: doom-addon-s
Domain: zxflix.com
Type: HTTP
URL: http://doom-addon-s:7000
```

3. Copy the tunnel token from Cloudflare and create `.env`:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set:

```text
CLOUDFLARED_TOKEN=your-real-token-from-cloudflare
```

4. Start the app and tunnel:

```powershell
docker compose up -d --build
```

5. Check the public URLs:

```text
https://doom-addon-s.zxflix.com/manifest.json
https://doom-addon-s.zxflix.com/addons/quality-4k/manifest.json
https://doom-addon-s.zxflix.com/addons/quality-1080/manifest.json
https://doom-addon-s.zxflix.com/addons/quality-low/manifest.json
```

If your original add-on already uses a Cloudflare Tunnel, keep it as-is and
create/use a different tunnel token for `doom-addon-s`. Do not point the new
hostname at the old container.

## Notes

- Provider files sync directly from the original upstream sources:
  `https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/refs/heads/main/manifest.json`,
  `https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/manifest.json`,
  `https://flixnest.app/flix-streams/u/6p9xzp78nunz/manifest.json`, and
  `https://badboysxs-morpheus.hf.space/manifest.json`.
- If you keep redistributing these files, keep the original license terms and
  attribution in mind.
- `4KHDHub`, `4khdhub-tv`, and `HDHub4u` read domain data from this repo's
  `domains.json`.
- `HindMoviez` returns resolved direct URLs instead of relying on the upstream
  Cloudflare worker.
- `Flix-Streams Emby`, `Flix-Streams MkvCinemas`, `Flix-Streams LotusVault`,
  `Flix-Streams ArchiveVault`, `Flix-Streams UHDMovies`, and
  `Flix-Streams Other` wrap the configured Flix-Streams add-on URL and do not
  sync from the GitHub upstream providers.
- `Flix-Streams VegaMovies` is kept in the repo but currently disabled because
  those Flixnest links are not working reliably.
- `StreamFlix` is kept in the repo but currently disabled and paused from
  upstream sync.
- `NetMirror`, `Peachify`, `MovieBox`, and `MoviesDrive` are synced from
  `D3adlyRocket/All-in-One-Nuvio`. Peachify results are filtered to Hindi and
  English audio only.
- Provider results keep Doom-addon-S's working-and-seekable stream validation
  before results are returned to Stremio.
- `Umbrella M`, `Umbrella Y`, `Umbrella D`, and `Umbrella F` are separate
  installable provider-group manifests that reuse the same formatter, media
  matching, probing, sorting, cache, and upstream-synced provider files as the
  main add-on.

## Original upstream sync

This repo includes a GitHub Actions workflow at
`.github/workflows/upstream-sync.yml`.

- Doom-addon-S no longer syncs from Doom-plug.
- The workflow checks the original upstream sources automatically every day and
  applies real sync work according to `upstreams.json`.
- If a tracked upstream provider changes, the workflow updates Doom-addon-S's
  provider file, retargets domain lookups to this repo's `domains.json`, updates
  `providers.json`, `manifest.json`, and `package.json`, and commits the update
  directly to `main`.
- You can also run it manually from the GitHub Actions tab with `force=true`.

## Windows auto-update

On the Windows host, schedule `scripts/update-windows.ps1` to keep the running
Docker container current with GitHub. This pulls committed Doom-addon-S changes
after the GitHub workflow has synced and committed them.

```powershell
powershell.exe -ExecutionPolicy Bypass -File C:\server\Doom-addon-S\scripts\update-windows.ps1
```

To run that update automatically every 10 hours, open PowerShell as
Administrator and run:

```powershell
powershell.exe -ExecutionPolicy Bypass -File C:\server\Doom-addon-S\scripts\register-update-task.ps1
```

The task runs `git pull --ff-only` and then rebuilds/restarts the Docker Compose
stack with:

```powershell
docker compose up -d --build --remove-orphans
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
