#!/bin/sh
# aoox CLI installer — standalone tarball (bundles its own Node.js runtime), no
# system Node.js required to install or run `aoox`. Mirrors the packaging done
# by `oclif pack tarballs` in aoox-cli (see aoox-cli/package.json's
# `oclif.update.node` block) and the release assets uploaded by
# .github/workflows/release-tarballs.yml there.
#
#   curl -fsSL https://aoox.dev/install-cli.sh | sh
#
# This only supports Linux (glibc) and macOS on x64/arm64 — see "aoox install"
# below for the panel itself, which is unrelated to this script. Alpine/musl,
# Windows, and any other architecture need the npm package instead:
#
#   npm install -g @hideandseeklab/aoox@alpha   # needs Node.js 22+
#
# Env vars (all optional):
#   AOOX_VERSION       Pin a specific CLI version, e.g. "0.1.0-alpha.3"
#                       (default: the latest GitHub release, prereleases
#                       included — the CLI hasn't had a stable release yet).
#   AOOX_CLI_BASE_URL  Fetch assets from this base URL instead of GitHub
#                       Releases (for local testing against a private mirror;
#                       skips the "find latest version" GitHub API call).
#   AOOX_INSTALL_DIR   Where to unpack the CLI (default: see below). The
#                       `aoox` symlink still goes to the usual bin directory
#                       next to it, not inside this path.
#
# Install location: /usr/local/lib/aoox + a symlink at /usr/local/bin/aoox
# when run as root (or with passwordless sudo available); otherwise
# ~/.local/lib/aoox + ~/.local/bin/aoox, since a `curl | sh` pipe can't
# safely relay an interactive sudo password prompt (stdin is already the
# script itself). Re-running this script upgrades: the old install directory
# is replaced, not merged.
#
# Uninstall: rm -rf <install dir> <bin dir>/aoox — printed at the end.

set -eu

REPO="hideandseeklab/aoox-cli"
GITHUB_RELEASES_API="https://api.github.com/repos/$REPO/releases"
GITHUB_DOWNLOAD_BASE="https://github.com/$REPO/releases/download"

log() { printf '==> %s\n' "$1"; }
die() { printf 'error: %s\n' "$1" >&2; exit 1; }
command_exists() { command -v "$1" >/dev/null 2>&1; }

# --- downloader (curl or wget) ---------------------------------------------
if command_exists curl; then
  fetch_to_stdout() { curl -fsSL "$1"; }
  fetch_to_file() { curl -fsSL "$1" -o "$2"; }
elif command_exists wget; then
  fetch_to_stdout() { wget -qO- "$1"; }
  fetch_to_file() { wget -q "$1" -O "$2"; }
else
  die "need curl or wget to download the CLI."
fi

command_exists tar || die "need tar to extract the CLI."

# --- checksum tool ----------------------------------------------------------
if command_exists sha256sum; then
  sha256_of() { sha256sum "$1" | awk '{print $1}'; }
elif command_exists shasum; then
  sha256_of() { shasum -a 256 "$1" | awk '{print $1}'; }
else
  die "need sha256sum or shasum to verify the download's checksum."
fi

# --- OS/arch detection -------------------------------------------------------
case "$(uname -s)" in
  Linux) PLATFORM=linux ;;
  Darwin) PLATFORM=darwin ;;
  *) die "unsupported OS: $(uname -s). Install via npm instead: npm install -g @hideandseeklab/aoox@alpha (needs Node.js 22+)." ;;
esac

case "$(uname -m)" in
  x86_64 | amd64) ARCH=x64 ;;
  aarch64 | arm64) ARCH=arm64 ;;
  *) die "unsupported architecture: $(uname -m). Install via npm instead: npm install -g @hideandseeklab/aoox@alpha (needs Node.js 22+)." ;;
esac

# --- musl detection (e.g. Alpine) -------------------------------------------
# The bundled Node.js binary in the tarball is built against glibc; it will
# not run on a musl libc system (Alpine's default). `ldd --version` prints
# "musl libc" on such systems (to stderr, and often with a non-zero exit —
# both are fine, we only care about the text); /etc/alpine-release is a
# second, even cheaper signal in case `ldd` itself is unavailable/different.
if [ "$PLATFORM" = "linux" ]; then
  is_musl=0
  if command_exists ldd && ldd --version 2>&1 | grep -qi musl; then
    is_musl=1
  elif [ -f /etc/alpine-release ]; then
    is_musl=1
  fi
  if [ "$is_musl" = "1" ]; then
    die "musl libc detected (e.g. Alpine Linux) — this prebuilt CLI needs glibc. Install via npm instead: npm install -g @hideandseeklab/aoox@alpha (needs Node.js 22+, available via 'apk add nodejs npm')."
  fi
fi

# --- archive format: prefer .tar.xz (smaller), fall back to .tar.gz --------
if command_exists xz || command_exists unxz; then
  EXT=tar.xz
else
  EXT=tar.gz
fi

# --- resolve version + asset base URL ---------------------------------------
if [ -n "${AOOX_CLI_BASE_URL:-}" ]; then
  # Local/CI test mode: assets are served flat (no per-version path) from a
  # private mirror, so there is nothing to ask the GitHub API for.
  ASSET_BASE="$AOOX_CLI_BASE_URL"
  VERSION="${AOOX_VERSION:-dev}"
elif [ -n "${AOOX_VERSION:-}" ]; then
  VERSION="${AOOX_VERSION#v}"
  ASSET_BASE="$GITHUB_DOWNLOAD_BASE/v$VERSION"
else
  # `/releases/latest` only ever returns the newest *non-prerelease* — aoox
  # has never had one, so that endpoint is useless here. `/releases` (plural)
  # lists every release newest-first regardless of prerelease status; taking
  # the first "tag_name" field is enough without a JSON parser, since GitHub
  # guarantees that ordering. This is the one network call in this script
  # that isn't a plain file download, and the only place a GitHub API rate
  # limit could bite (60 unauthenticated requests/hour per IP) — pin
  # AOOX_VERSION to skip it entirely.
  log "Looking up the latest aoox release (pre-releases included)"
  releases_json="$(fetch_to_stdout "$GITHUB_RELEASES_API")" ||
    die "could not reach the GitHub API to find the latest release. Set AOOX_VERSION=<version> to install a specific version instead."
  tag="$(printf '%s' "$releases_json" | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name":[[:space:]]*"([^"]+)".*/\1/')"
  [ -n "$tag" ] || die "could not determine the latest release tag from the GitHub API response."
  VERSION="${tag#v}"
  ASSET_BASE="$GITHUB_DOWNLOAD_BASE/$tag"
fi

log "Installing aoox $VERSION ($PLATFORM-$ARCH, $EXT)"

# --- download + verify + extract --------------------------------------------
ASSET="aoox-${PLATFORM}-${ARCH}.${EXT}"
CHECKSUM_ASSET="$ASSET.sha256"

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT INT TERM

log "Downloading $ASSET"
fetch_to_file "$ASSET_BASE/$ASSET" "$TMPDIR/$ASSET" || die "download failed: $ASSET_BASE/$ASSET"

log "Downloading checksum"
fetch_to_file "$ASSET_BASE/$CHECKSUM_ASSET" "$TMPDIR/$CHECKSUM_ASSET" || die "download failed: $ASSET_BASE/$CHECKSUM_ASSET"

log "Verifying checksum"
expected="$(awk '{print $1}' "$TMPDIR/$CHECKSUM_ASSET")"
actual="$(sha256_of "$TMPDIR/$ASSET")"
[ -n "$expected" ] || die "checksum file $CHECKSUM_ASSET was empty or malformed."
if [ "$expected" != "$actual" ]; then
  die "checksum mismatch for $ASSET (expected $expected, got $actual) — the download may be corrupted or tampered with. Not installing."
fi

log "Extracting"
# The tarball's single top-level directory is named after the CLI's oclif
# `bin` ("aoox"), not the version — read it from the archive itself instead
# of hardcoding it, so this keeps working if that ever changes upstream.
top_dir="$(tar -tf "$TMPDIR/$ASSET" | head -1 | cut -d/ -f1)"
[ -n "$top_dir" ] || die "could not read the tarball's contents."
tar -xf "$TMPDIR/$ASSET" -C "$TMPDIR"
[ -d "$TMPDIR/$top_dir" ] || die "extraction did not produce the expected $top_dir directory."

# --- pick an install location ------------------------------------------------
DEFAULT_LIB_DIR="/usr/local/lib/aoox"
DEFAULT_BIN_DIR="/usr/local/bin"
USER_LIB_DIR="${HOME:-/root}/.local/lib/aoox"
USER_BIN_DIR="${HOME:-/root}/.local/bin"

SUDO=""
if [ -n "${AOOX_INSTALL_DIR:-}" ]; then
  LIB_DIR="$AOOX_INSTALL_DIR"
  BIN_DIR="$DEFAULT_BIN_DIR"
  if [ "$(id -u)" != "0" ] && command_exists sudo && sudo -n true 2>/dev/null; then
    SUDO="sudo"
  fi
elif [ "$(id -u)" = "0" ]; then
  LIB_DIR="$DEFAULT_LIB_DIR"
  BIN_DIR="$DEFAULT_BIN_DIR"
elif command_exists sudo && sudo -n true 2>/dev/null; then
  # Only use sudo non-interactively (`-n`): this script is commonly run via
  # `curl ... | sh`, where stdin is the script's own source — an interactive
  # sudo password prompt would either hang or read garbage from the pipe.
  LIB_DIR="$DEFAULT_LIB_DIR"
  BIN_DIR="$DEFAULT_BIN_DIR"
  SUDO="sudo"
else
  LIB_DIR="$USER_LIB_DIR"
  BIN_DIR="$USER_BIN_DIR"
  log "no root and no passwordless sudo — installing to $LIB_DIR instead (use sudo yourself, or set AOOX_INSTALL_DIR, for a system-wide install)"
fi

log "Installing to $LIB_DIR"
$SUDO rm -rf "$LIB_DIR"
$SUDO mkdir -p "$(dirname "$LIB_DIR")" "$BIN_DIR"
$SUDO mv "$TMPDIR/$top_dir" "$LIB_DIR"
$SUDO ln -sf "$LIB_DIR/bin/aoox" "$BIN_DIR/aoox"

case ":${PATH:-}:" in
  *":$BIN_DIR:"*) ;;
  *)
    printf 'warning: %s is not on your PATH. Add this to your shell profile:\n' "$BIN_DIR" >&2
    printf '  export PATH="%s:$PATH"\n' "$BIN_DIR" >&2
    ;;
esac

log "Verifying installation"
"$BIN_DIR/aoox" --version || die "installed but 'aoox --version' failed — check $LIB_DIR/bin/aoox directly."

if [ "$(id -u)" != "0" ] && [ -n "$SUDO" ]; then
  uninstall_hint="sudo rm -rf $LIB_DIR $BIN_DIR/aoox"
else
  uninstall_hint="rm -rf $LIB_DIR $BIN_DIR/aoox"
fi
printf '\naoox %s installed. Run: %s/aoox --help\n' "$VERSION" "$BIN_DIR"
printf 'Uninstall: %s\n' "$uninstall_hint"
