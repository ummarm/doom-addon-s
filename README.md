# Doom-addon

Doom-addon is a Stremio stream add-on that wraps these eight providers from
`D3adlyRocket/All-in-One-Nuvio`:

- `4KHDHub`
- `HDHub4u`
- `4khdhub-tv`
- `HindMoviez`
- `MovieBlast`
- `MovieBox`
- `MoviesDrive`
- `StreamFlix`

It exposes a Stremio-compatible `manifest.json` and a stream endpoint that calls
every enabled provider, merges the results, and returns Stremio stream objects.

## Files

- `manifest.json` - Stremio add-on manifest
- `providers.json` - Doom-addon provider registry and provider versions
- `addon.js` - Stremio request adapter around the provider modules
- `server.js` - HTTP server for Stremio
- `providers/4khdhub.js`
- `providers/4khdhub_tv.js`
- `providers/hdhub4u.js`
- `providers/hindmoviez.js`
- `providers/movieblast.js`
- `providers/moviebox.js`
- `providers/moviesdrive.js`
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

You can change the port with:

```sh
PORT=8080 npm start
```

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
```

## Notes

- The provider files were copied from the GPL-3.0 licensed upstream repo:
  `https://github.com/D3adlyRocket/All-in-One-Nuvio`
- If you keep redistributing these files, keep the original license terms and
  attribution in mind.
- `4KHDHub`, `4khdhub-tv`, and `HDHub4u` read domain data from this repo's
  `domains.json`.
- `HindMoviez` returns resolved direct URLs instead of relying on the upstream
  Cloudflare worker.
- `4KHDHub`, `4khdhub-tv`, and `HDHub4u` prefer FSL-family links first, but fall
  back to the original available links if no FSL link exists.

## Doom-plug sync

This repo includes a GitHub Actions workflow at
`.github/workflows/upstream-sync.yml`.

- Automatic Doom-plug syncing is disabled.
- Doom-addon will not update from Doom-plug unless you intentionally run the
  workflow from the GitHub Actions tab or ask for a manual sync.
- When run manually, the workflow updates Doom-addon's provider files, retargets
  domain lookups to this repo's `domains.json`, updates `providers.json`,
  `manifest.json`, and `package.json`, and commits the update directly to `main`.

## Windows auto-update

On the Windows host, schedule `scripts/update-windows.ps1` to keep the running
Docker container current with GitHub. This only pulls committed Doom-addon
changes; it does not sync from Doom-plug by itself.

```powershell
powershell.exe -ExecutionPolicy Bypass -File C:\server\Doom-addon\scripts\update-windows.ps1
```

Tracked Doom-plug provider files:

- `providers/4khdhub.js`
- `providers/4khdhub_tv.js`
- `providers/hdhub4u.js`
- `providers/hindmoviez.js`
- `providers/movieblast.js`
- `providers/moviebox.js`
- `providers/moviesdrive.js`
- `providers/streamflix.js`
