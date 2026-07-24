# img-server

Dead-simple image server. No dependencies — just Node. Serves everything in
`images/` over plain HTTP.

## Run

```bash
node server.mjs            # http://localhost:8080
PORT=3000 node server.mjs  # custom port
```

- `GET /` — HTML listing of all images
- `GET /<filename>` — serves the image (jpg, png, gif, webp, svg, avif, ico, bmp, tiff)

Drop files into `images/` and they're served immediately — no restart needed.

Responses include `Access-Control-Allow-Origin: *` and one-hour caching.
Listens on `0.0.0.0`, so it's reachable from other machines on the network.

## Production (ShipStation packing-slip logos)

Served over **plain HTTP** (ShipStation packing slips won't load HTTPS images)
from a Digital Ocean droplet:

- Droplet: `img-server` (personal DO account, NYC3, $4/mo, IP `45.55.65.208`)
- nginx serves `/opt/img-server/images` on port 80
- A root cron job runs `git pull` every minute, so **pushing an image to
  `main` makes it live at `http://45.55.65.208/<filename>` within ~1 minute** —
  no SSH needed
- SSH access: `ssh root@45.55.65.208` (macbook key)

Stable URLs (A record `img` → `45.55.65.208` in GoDaddy DNS — plain DNS,
no HTTPS-forcing proxy, or packing slips break):

- http://img.livegoodlogistics.com/Kabloom.png
- http://img.livegoodlogistics.com/plantseed.png
- http://img.livegoodlogistics.com/yardwork.png

The droplet was provisioned with the cloud-init script in `deploy/cloud-init.sh`.
