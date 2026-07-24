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
