#!/bin/sh
# aoox one-line installer — sets up the panel (postgres + api + web) on a
# fresh Linux VPS via Docker Compose. Mirrors `aoox install` in aoox-cli
# (../aoox-cli/src/commands/install.ts) but needs nothing but a POSIX shell —
# no Node.js required to run this script itself.
#
#   curl -fsSL https://aoox.dev/install.sh | sh
#
# With a domain + automatic HTTPS and a non-interactive owner account:
#
#   curl -fsSL https://aoox.dev/install.sh \
#     | WEB_DOMAIN=panel.example.com API_DOMAIN=api.panel.example.com \
#       ACME_EMAIL=me@example.com \
#       ADMIN_EMAIL=me@example.com ADMIN_PASSWORD='a-strong-password' \
#       sh
#
# Env vars (all optional except the WEB_DOMAIN/API_DOMAIN/ACME_EMAIL trio,
# which are required together):
#   AOOX_DIR        Install folder (default: /opt/aoox)
#   FORCE           Overwrite an existing install at AOOX_DIR (default: unset)
#   WEB_DOMAIN      Domain for the dashboard, via the built-in proxy
#   API_DOMAIN      Domain for the API, via the built-in proxy
#   ACME_EMAIL      Required with WEB_DOMAIN/API_DOMAIN — Let's Encrypt account email
#   ADMIN_EMAIL     Create the first owner account non-interactively
#   ADMIN_PASSWORD  Required with ADMIN_EMAIL (min. 8 characters)
#   ADMIN_NAME      Optional, defaults to "Admin"
#
# Without ADMIN_EMAIL, create the owner account yourself at /setup afterwards.
# Everything this script does is also available as `aoox install` from
# https://github.com/hideandseeklab/aoox-cli, which additionally prompts for
# confirmation and supports flags instead of env vars — use that instead if
# you'd rather not pipe a script straight into `sh`.

set -eu

DIR="${AOOX_DIR:-/opt/aoox}"
ASSETS_BASE="https://raw.githubusercontent.com/hideandseeklab/aoox-cli/main/assets/install"

log() { printf '==> %s\n' "$1"; }
die() { printf 'error: %s\n' "$1" >&2; exit 1; }

[ "$(uname -s)" = "Linux" ] || die "this installer is for Linux servers only."
[ "$(id -u)" = "0" ] || die "must be run as root (try: curl ... | sudo sh)."

if [ -n "${WEB_DOMAIN:-}" ] || [ -n "${API_DOMAIN:-}" ]; then
  [ -n "${WEB_DOMAIN:-}" ] && [ -n "${API_DOMAIN:-}" ] || die "WEB_DOMAIN and API_DOMAIN must be set together."
  [ -n "${ACME_EMAIL:-}" ] || die "WEB_DOMAIN/API_DOMAIN also need ACME_EMAIL (for the Let's Encrypt certificate)."
fi
if [ -n "${ADMIN_EMAIL:-}" ]; then
  [ -n "${ADMIN_PASSWORD:-}" ] || die "ADMIN_EMAIL also needs ADMIN_PASSWORD (min. 8 characters)."
fi

if [ -e "$DIR/docker-compose.dist.yml" ] && [ -z "${FORCE:-}" ]; then
  die "an install already exists at $DIR. Set FORCE=1 to overwrite it."
fi

command_exists() { command -v "$1" >/dev/null 2>&1; }

if ! command_exists docker || ! docker info >/dev/null 2>&1; then
  log "Docker not found/running — installing via https://get.docker.com"
  curl -fsSL https://get.docker.com | sh
  command_exists docker && docker info >/dev/null 2>&1 || die "Docker still isn't usable after installation. Check 'systemctl status docker' and re-run this script."
fi

log "Setting up $DIR"
mkdir -p "$DIR/secrets"
# The api container writes its terminal SSH key here as uid 1000 (the `node`
# user) — chown now so the first use of the web terminal doesn't hit EACCES.
chown 1000:1000 "$DIR/secrets" 2>/dev/null || true

curl -fsSL "$ASSETS_BASE/docker-compose.dist.yml" -o "$DIR/docker-compose.dist.yml"
DOMAIN_MODE=0
if [ -n "${WEB_DOMAIN:-}" ]; then
  DOMAIN_MODE=1
  curl -fsSL "$ASSETS_BASE/docker-compose.domain.yml" -o "$DIR/docker-compose.domain.yml"
fi

log "Detecting the server's public IP"
PUBLIC_IP="$(curl -fsSL --max-time 5 https://api.ipify.org 2>/dev/null || true)"
case "$PUBLIC_IP" in
  ''|*[!0-9.]*) PUBLIC_IP="" ;; # not a bare IPv4 — an HTML error page, most likely
esac

if [ "$DOMAIN_MODE" = "1" ]; then
  WEB_ORIGIN="https://$WEB_DOMAIN"
  PUBLIC_API_URL="https://$API_DOMAIN"
else
  WEB_ORIGIN="http://${PUBLIC_IP:-localhost}:3000"
  PUBLIC_API_URL="http://${PUBLIC_IP:-localhost}:3001"
fi

random_hex32() {
  # openssl is near-universal, but fall back to /dev/urandom if it's missing.
  if command_exists openssl; then
    openssl rand -hex 32
  else
    od -An -tx1 -N32 /dev/urandom | tr -d ' \n'
  fi
}

DOCKER_GID="$(stat -c %g /var/run/docker.sock 2>/dev/null || echo 0)"

# Same keys `aoox install`'s buildEnvFile writes (aoox-cli/src/lib/install-env.ts)
# — a fresh file, not a fill-in of the commented .env.dist.example template.
cat > "$DIR/.env.dist" <<EOF
# Written by install.sh. Secrets below are generated — keep this file private.

POSTGRES_PASSWORD=$(random_hex32)
JWT_SECRET=$(random_hex32)
ENCRYPTION_KEY=$(random_hex32)

WEB_PORT=3000
API_PORT=3001
WEB_ORIGIN=$WEB_ORIGIN
PUBLIC_API_URL=$PUBLIC_API_URL
COOKIE_SECURE=
PUBLIC_IP=$PUBLIC_IP
STORAGE_PATH=
INSTALL_DIR=$DIR

WEB_DOMAIN=${WEB_DOMAIN:-}
API_DOMAIN=${API_DOMAIN:-}
PROXY_ACME_EMAIL=${ACME_EMAIL:-}
PROXY_ACME_STAGING=false

ADMIN_EMAIL=${ADMIN_EMAIL:-}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-}
ADMIN_NAME=${ADMIN_NAME:-}

TERMINAL_SSH_HOST=host.docker.internal
TERMINAL_SSH_PORT=22
TERMINAL_SSH_USER=
TERMINAL_SSH_PRIVATE_KEY_FILE=
TERMINAL_SSH_PASSPHRASE=
TERMINAL_SSH_PASSWORD=

DOCKER_GID=$DOCKER_GID

REGISTRY_PORT=5000
REGISTRY_PUBLIC_HOST=localhost

PROXY_HTTP_PORT=80
PROXY_HTTPS_PORT=443

CONTAINER_LOG_MAX_SIZE=10m
CONTAINER_LOG_MAX_FILE=3
METRICS_RETENTION_DAYS=30

RAILPACK_VERSION=0.39.0
BUILDKIT_VERSION=v0.27.0
BUILDKIT_CACHE_KEEP_GB=10
EOF
chmod 600 "$DIR/.env.dist"

log "Running docker compose up -d"
cd "$DIR"
if [ "$DOMAIN_MODE" = "1" ]; then
  docker compose -f docker-compose.dist.yml -f docker-compose.domain.yml --env-file .env.dist up -d
else
  docker compose -f docker-compose.dist.yml --env-file .env.dist up -d
fi

log "Waiting for the API to be ready"
i=0
while [ "$i" -lt 60 ]; do
  if curl -fsS --max-time 3 http://localhost:3001/auth/setup-status >/dev/null 2>&1; then
    break
  fi
  i=$((i + 1))
  sleep 2
done
if [ "$i" -ge 60 ]; then
  printf 'warning: the API did not answer in time — check `docker compose logs api` in %s\n' "$DIR" >&2
fi

printf '\naoox installed into %s.\nOpen: %s\n' "$DIR" "$WEB_ORIGIN"
[ -n "${ADMIN_EMAIL:-}" ] || printf 'Create the first owner account at /setup.\n'
