# Deploying `ampd` behind a webserver

Here are some example configurations if you like to run `ampd` behind another webserver via reverse proxy.

## Apache

Accessing `ampd` via `http://your-server/ampd`

```apache
<VirtualHost *:80>
    ServerName your-server
    Include /etc/apache2/vhosts.d/default_vhost.include

    ProxyPass           "/ampd" "http://127.0.0.1:8080/"
    ProxyPassReverse    "/ampd" "http://127.0.0.1:8080/"
    RewriteEngine       On
    RewriteCond         %{HTTP:Upgrade} websocket [NC]
    RewriteCond         %{HTTP:Connection} upgrade [NC]
    RewriteRule         ^/ampd?(.*) "ws://127.0.0.1:8080/$1" [P,L]
</VirtualHost>
```

## Nginx

Accessing `ampd` via `http://ampd.your-server/`

```nginx
server {
    listen 80;
    server_name ampd.your-server;
    server_name_in_redirect off;
    location / {
        sendfile off;
        proxy_pass http://127.0.0.1:8080;
        proxy_redirect default;
        proxy_http_version 1.1;
    
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Upgrade $http_upgrade;
    
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_max_temp_file_size 0;
    
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
        proxy_read_timeout 90;
        proxy_buffering off;
        proxy_request_buffering off; # Required for HTTP CLI commands
        proxy_set_header Connection ""; # Clear for keepalive
    }
}
```
