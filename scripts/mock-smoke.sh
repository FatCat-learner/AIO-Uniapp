#!/usr/bin/env bash
set -u
cd F:/Code/AIOSport/aio-uni-app-x
rm -f /tmp/dev2.log
pnpm dev:h5 > /tmp/dev2.log 2>&1 &
DEV=$!
for i in $(seq 1 40); do
  grep -q "ready in" /tmp/dev2.log 2>/dev/null && break
  grep -qiE "failed to load config|EPERM" /tmp/dev2.log 2>/dev/null && break
  sleep 2
done
PORT=$(grep -E "Local:" /tmp/dev2.log | tail -1 | grep -oE "[0-9]{4,5}/" | tr -d "/")
echo "PORT=$PORT  (pid $DEV)"
netstat -ano | grep -E ":${PORT}\s" | head -5
echo "--- direct 127.0.0.1 ---"
curl -s -o /dev/null -w "%{http_code}\n" -m 8 --noproxy '*' "http://127.0.0.1:${PORT}/api/home"
echo "--- localhost ---"
curl -s -o /dev/null -w "%{http_code}\n" -m 8 --noproxy '*' "http://localhost:${PORT}/api/home"
echo "--- ipv6 ---"
curl -s -o /dev/null -w "%{http_code}\n" -m 8 -g --noproxy '*' "http://[::1]:${PORT}/api/home"
echo "--- 9527 known alive ---"
curl -s -o /dev/null -w "%{http_code}\n" -m 5 --noproxy '*' "http://127.0.0.1:9527/__mcp/sse"
echo "--- body via localhost ---"
curl -s -m 8 --noproxy '*' "http://localhost:${PORT}/api/home" | head -c 300
echo
kill $DEV 2>/dev/null
sleep 2
echo killed
