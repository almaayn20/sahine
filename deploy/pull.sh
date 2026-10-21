#!/bin/bash
# Run by cron on the host (every minute). Pulls the pre-built `deploy` branch
# and only restarts the Node app when backend files actually changed — a
# frontend-only change goes live with no restart, because serve.mjs reads
# dist/ from disk on every request.
#
#   * * * * * /home/shahinte/shahin1/deploy/pull.sh
#
# Override paths with APP_DIR / VENV_ACTIVATE if the layout differs.
set -u

# Everything lives in main() and the file ends with `main; exit`, so bash has
# parsed the whole script before git can replace this file mid-run.
main() {
APP_DIR="${APP_DIR:-$HOME/shahin1}"
VENV_ACTIVATE="${VENV_ACTIVATE:-$HOME/nodevenv/shahin1/20/bin/activate}"
BRANCH="${BRANCH:-deploy}"

cd "$APP_DIR" || exit 1
mkdir -p tmp
LOG="$APP_DIR/tmp/deploy.log"

# one run at a time
exec 9>"$APP_DIR/tmp/deploy.lock"
flock -n 9 || exit 0

git fetch -q origin "$BRANCH" 2>>"$LOG" || { echo "$(date -u +%FT%TZ) fetch failed" >>"$LOG"; exit 1; }

NEW=$(git rev-parse "origin/$BRANCH")
OLD=$(git rev-parse HEAD 2>/dev/null || echo none)
[ "$OLD" = "$NEW" ] && exit 0

CHANGED=$(git diff --name-only "$OLD" "$NEW" 2>/dev/null || true)

# -f: the first run replaces the hand-uploaded dist/ that is in the way
git checkout -q -f -B "$BRANCH" "$NEW" 2>>"$LOG" || { echo "$(date -u +%FT%TZ) checkout failed" >>"$LOG"; exit 1; }

if echo "$CHANGED" | grep -qE '^package(-lock)?\.json$'; then
  # shellcheck disable=SC1090
  source "$VENV_ACTIVATE" && npm install --omit=dev --no-audit --no-fund >>"$LOG" 2>&1
fi

RESTART=no
if [ "$OLD" = none ] || echo "$CHANGED" | grep -qE '^(serve|mailer|snap)\.mjs$|^src/data\.mjs$|^package(-lock)?\.json$'; then
  touch tmp/restart.txt
  # On this host (CloudLinux/LiteSpeed "lsnode") restart.txt alone is NOT
  # honoured, so stop the running app; it is started again, with the new
  # code, by the next request — which we make right away.
  pkill -u "$(id -un)" -f "lsnode:$APP_DIR/" 2>>"$LOG"
  sleep 2
  curl -s -m 60 -o /dev/null "${WARM_URL:-https://shahin.bh/}" 2>>"$LOG"
  RESTART=yes
fi

echo "$(date -u +%FT%TZ) deployed ${NEW:0:7} (was ${OLD:0:7}) restart=$RESTART" >>"$LOG"
}

main "$@"
exit $?
