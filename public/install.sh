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
#   AOOX_NO_TERMINAL_AUTHORIZE  Set to 1 to skip authorizing the web terminal's SSH key for
#                      TERMINAL_SSH_USER (see below); by default the key is created in
#                      $AOOX_DIR/secrets and added to that user's ~/.ssh/authorized_keys.
#   TERMINAL_SSH_USER  SSH user the web terminal uses to reach this host. Default: the
#                      user who ran `sudo` (SUDO_USER) when it is a plain login name other
#                      than root, otherwise root. Cloud images usually refuse SSH as root,
#                      so the sudo user is the one that can actually log in. This script
#                      authorizes the platform key for that user itself; if that step prints a
#                      warning, run the command shown in Infrastructure -> Terminal on this host
#                      as that same user.
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

# Default TERMINAL_SSH_USER for this (new) install: the person who ran `sudo sh`
# (SUDO_USER). Same rule as `aoox install` (defaultTerminalSshUser in aoox-cli):
# root when there is no sudo user, SUDO_USER is root, or the value is not a plain
# login name (it is written into .env.dist, so no spaces/newlines/odd characters;
# unlike the CLI, surrounding whitespace is not trimmed, it just falls back to root).
default_terminal_ssh_user() {
  u="${SUDO_USER:-}"
  case "$u" in
    '' | root) echo root; return 0 ;;
    [A-Za-z_]*) ;;
    *) echo root; return 0 ;;
  esac
  case "$u" in
    *[!A-Za-z0-9_-]*) echo root; return 0 ;;
  esac
  if [ "${#u}" -gt 32 ]; then echo root; return 0; fi
  echo "$u"
}
# An explicit TERMINAL_SSH_USER always wins.
TERMINAL_USER="${TERMINAL_SSH_USER:-$(default_terminal_ssh_user)}"

# A plain login name: letters, digits, "_" and "-", not starting with a digit or "-", at most 32
# characters (same rule as `aoox install`: /^[a-z_][\w-]{0,31}$/i).
is_login_name() {
  case "$1" in
    [A-Za-z_]*) ;;
    *) return 1 ;;
  esac
  case "$1" in
    *[!A-Za-z0-9_-]*) return 1 ;;
  esac
  [ "${#1}" -le 32 ]
}

# Never fatal: any problem is this one warning and the install goes on (Settings > Terminal has the
# authorize button and the manual command).
terminal_warn() {
  printf 'warning: terminal key not authorized automatically; use Settings > Terminal > authorize (%s)\n' "$1" >&2
}

# The passwd line of a user: getent first (LDAP/sssd users), then /etc/passwd.
passwd_entry() {
  entry=""
  if command_exists getent; then entry="$(getent passwd "$1" 2>/dev/null || true)"; fi
  if [ -z "$entry" ]; then
    entry="$(awk -F: -v u="$1" '$1 == u { print; exit }' /etc/passwd 2>/dev/null || true)"
  fi
  printf '%s\n' "$entry"
}

# Lets the web terminal log in to this host without the manual step. Same behavior, names, modes
# and messages as `aoox install` (aoox-cli/src/lib/terminal-key.ts, "Terminal key" in its
# AGENTS.md) — change both together:
#  1. $DIR/secrets: chown 1000:1000 (the api container's `node` user), chmod 700;
#  2. no terminal_ssh_key yet: ssh-keygen ed25519, comment aoox-terminal; private 600, .pub 644,
#     both 1000:1000. An existing key is never replaced;
#  3. key line = first non-empty line of the .pub, one `ssh-<type> <base64> [comment]` line;
#  4. uid/gid/home of the user from passwd; home absolute, not "/", no ".." (plus: it must exist,
#     this script never creates a home directory);
#  5. ~/.ssh (700) and ~/.ssh/authorized_keys (600) created if needed, loose modes tightened,
#     both chown uid:gid (not recursive); refused when either is a symlink (this runs as root, so
#     never follow a link the account owner controls);
#  6. the line is added only when no identical line exists (own line, newline added if missing).
authorize_terminal_key() {
  user="$1"
  keydir="$DIR/secrets"
  key="$keydir/terminal_ssh_key"
  mkdir -p "$keydir" 2>/dev/null || { terminal_warn "cannot create $keydir"; return 0; }
  chown 1000:1000 "$keydir" 2>/dev/null || true
  chmod 700 "$keydir" 2>/dev/null || true
  if [ ! -f "$key" ]; then
    if ! command_exists ssh-keygen; then terminal_warn "ssh-keygen not found"; return 0; fi
    if ! ssh-keygen -q -t ed25519 -N "" -C aoox-terminal -f "$key" >/dev/null 2>&1; then
      terminal_warn "ssh-keygen failed"
      return 0
    fi
    chmod 600 "$key" 2>/dev/null || true
    chmod 644 "$key.pub" 2>/dev/null || true
    chown 1000:1000 "$key" "$key.pub" 2>/dev/null || true
  fi
  pub="$(sed -n 's/^[[:space:]]*//;s/[[:space:]]*$//;/./{p;q;}' "$key.pub" 2>/dev/null || true)"
  if ! printf '%s\n' "$pub" | grep -Eq '^ssh-[a-z0-9-]+ [A-Za-z0-9+/=]+( [!-~]+)?$'; then
    terminal_warn "unreadable public key"
    return 0
  fi
  entry="$(passwd_entry "$user")"
  uid="$(printf '%s' "$entry" | cut -d: -f3)"
  gid="$(printf '%s' "$entry" | cut -d: -f4)"
  home="$(printf '%s' "$entry" | cut -d: -f6)"
  case "$uid:$gid" in
    '' | *[!0-9:]* | :* | *:) terminal_warn "no usable home for $user"; return 0 ;;
  esac
  case "$home" in
    /) terminal_warn "no usable home for $user"; return 0 ;;
    /*) ;;
    *) terminal_warn "no usable home for $user"; return 0 ;;
  esac
  case "$home/" in
    */../*) terminal_warn "no usable home for $user"; return 0 ;;
  esac
  if [ ! -d "$home" ]; then terminal_warn "no usable home for $user"; return 0; fi
  sshdir="$home/.ssh"
  auth="$sshdir/authorized_keys"
  for path in "$sshdir" "$auth"; do
    if [ -L "$path" ]; then terminal_warn "$path is a symlink"; return 0; fi
  done
  mkdir -p "$sshdir" 2>/dev/null || { terminal_warn "cannot create $sshdir"; return 0; }
  chmod 700 "$sshdir" 2>/dev/null || { terminal_warn "cannot set permissions on $sshdir"; return 0; }
  if [ ! -e "$auth" ]; then
    : > "$auth" 2>/dev/null || { terminal_warn "cannot create $auth"; return 0; }
  fi
  chmod 600 "$auth" 2>/dev/null || { terminal_warn "cannot set permissions on $auth"; return 0; }
  if grep -qxF "$pub" "$auth" 2>/dev/null; then
    added=0
  else
    # A file that does not end in a newline would swallow the key onto its last line.
    if [ -s "$auth" ] && [ "$(tail -c 1 "$auth" | wc -l)" -eq 0 ]; then
      printf '\n' >> "$auth" 2>/dev/null || { terminal_warn "cannot write $auth"; return 0; }
    fi
    printf '%s\n' "$pub" >> "$auth" 2>/dev/null || { terminal_warn "cannot write $auth"; return 0; }
    added=1
  fi
  if ! chown "$uid:$gid" "$sshdir" "$auth" 2>/dev/null; then
    terminal_warn "cannot change the owner of $sshdir"
    return 0
  fi
  if [ "$added" = "1" ]; then
    log "terminal key authorized for $user"
  else
    log "terminal key already authorized for $user"
  fi
  return 0
}

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
TERMINAL_SSH_USER=$TERMINAL_USER
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

# Authorize the web terminal's key for TERMINAL_USER, unless asked not to, the user is not a plain
# login name, or a terminal key file/password is configured. Failures only warn.
if [ "${AOOX_NO_TERMINAL_AUTHORIZE:-}" != "1" ] && is_login_name "$TERMINAL_USER" \
  && [ -z "${TERMINAL_SSH_PRIVATE_KEY_FILE:-}${TERMINAL_SSH_PASSWORD:-}" ]; then
  authorize_terminal_key "$TERMINAL_USER" || true
fi

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
