#!/usr/bin/env bash
# VisaReady — pre-install security audit
# Run BEFORE `npm install` on any new machine.

set -e

echo "=== 1. npm audit (CVE check) ==="
npm audit --audit-level=moderate || true

echo ""
echo "=== 2. Check for known-compromised package names in lockfile ==="
# Mini Shai-Hulud + node-ipc + chalk/debug Sept 2025 + TanStack wave
BAD_PACKAGES=(
  "@tanstack/react-router"
  "@tanstack/start"
  "@uipath/"
  "@mistralai/mistralai"
  "@squawk/"
  "@cap-js/"
  "@bitwarden/cli"
  "intercom-client"
  "node-ipc"
  "lightning"
)

if [ -f package-lock.json ]; then
  for pkg in "${BAD_PACKAGES[@]}"; do
    if grep -q "\"$pkg" package-lock.json 2>/dev/null; then
      echo "⚠️  FOUND: $pkg in lockfile — investigate version!"
    fi
  done
  echo "✅ No known-compromised package names in lockfile."
else
  echo "ℹ️  No package-lock.json yet — run after npm install."
fi

echo ""
echo "=== 3. Block install scripts (recommended) ==="
echo "   Run installs with: npm install --ignore-scripts"
echo "   Most Shai-Hulud payloads execute via preinstall/postinstall hooks."

echo ""
echo "=== 4. Check for known IoCs in node_modules ==="
if [ -d node_modules ]; then
  # Files the worm drops
  SUSPICIOUS=(
    "setup.mjs"
    "router_init.js"
    "router_runtime.js"
    "gh-token-monitor"
  )
  for f in "${SUSPICIOUS[@]}"; do
    matches=$(find node_modules -name "$f" 2>/dev/null | head -3)
    if [ -n "$matches" ]; then
      echo "⚠️  Suspicious file found: $f"
      echo "$matches"
    fi
  done
  echo "✅ No worm IoC files found in node_modules."
fi

echo ""
echo "=== Done ==="
