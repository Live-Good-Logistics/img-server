#!/bin/bash
set -e
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y nginx git

git clone https://github.com/Live-Good-Logistics/img-server /opt/img-server

cat > /etc/nginx/sites-available/img-server <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /opt/img-server/images;
    autoindex on;
    location / {
        add_header Cache-Control "public, max-age=300";
        add_header Access-Control-Allow-Origin "*";
        try_files $uri $uri/ =404;
    }
}
EOF
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/img-server /etc/nginx/sites-enabled/img-server
systemctl restart nginx

echo '* * * * * root git -C /opt/img-server pull --quiet' > /etc/cron.d/img-server-pull
