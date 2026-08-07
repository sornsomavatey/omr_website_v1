# Nginx deployment

This deployment runs:

- Nginx on ports 80/443
- the SSR frontend on `127.0.0.1:3001`
- FastAPI on `127.0.0.1:8000`

The commands below assume Ubuntu/Debian, the repository is installed at
`/var/www/omr_website_phase1`, and DNS already points to the server.

## 1. Install and build

```bash
sudo apt update
sudo apt install -y nginx python3-venv

cd /var/www/omr_website_phase1/Frontend
npm ci
```

Before building, set this value in `Frontend/.env`:

```dotenv
VITE_API_URL=/api
TRUST_PROXY=true
WEBAPP_BASE_URL=https://omd.a2hosted.com
MENU_CACHE_TTL_MS=300000
```

Then build the SSR application:

```bash
npm run build

cd /var/www/omr_website_phase1/backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

Configure `backend/.env` for the real domain:

```dotenv
ENVIRONMENT=production
CORS_ORIGINS=https://example.com,https://www.example.com
ALLOWED_HOSTS=example.com,www.example.com
FORCE_HTTPS=true
TRUST_PROXY_HEADERS=true
DATABASE_URL=sqlite:///./omr_restaurant.db
```

Add the real Telegram, SMTP, and admin credentials directly on the server.
Never commit either `.env` file.

## 2. Enable the services

Replace `YOUR_LINUX_USER` and any non-default installation paths in both files
under `deployment/systemd/`, then run:

```bash
sudo cp deployment/systemd/omr-frontend.service /etc/systemd/system/
sudo cp deployment/systemd/omr-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now omr-frontend omr-backend
sudo systemctl status omr-frontend omr-backend
```

## 3. Enable Nginx

Replace `example.com` in `deployment/nginx/one-more-restaurant.conf`, then run:

```bash
sudo cp deployment/nginx/one-more-restaurant.conf /etc/nginx/sites-available/one-more-restaurant
sudo ln -s /etc/nginx/sites-available/one-more-restaurant /etc/nginx/sites-enabled/one-more-restaurant
sudo nginx -t
sudo systemctl reload nginx
```

After the HTTP site works, install a TLS certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot updates the Nginx configuration and enables HTTPS.

## Updating the deployment

```bash
cd /var/www/omr_website_phase1
git pull

cd Frontend
npm ci
npm run build

cd ../backend
.venv/bin/pip install -r requirements.txt

sudo systemctl restart omr-frontend omr-backend
sudo nginx -t
sudo systemctl reload nginx
```

Check failures with:

```bash
sudo journalctl -u omr-frontend -u omr-backend -n 100 --no-pager
sudo tail -n 100 /var/log/nginx/error.log
```
