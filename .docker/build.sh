#!/bin/bash

NGINX_ROOT="/usr/share/nginx/html"

set -o xtrace

cd $NGINX_ROOT

cat ./js/app/*.js > /tmp/combined.js
HASH=$(md5sum /tmp/combined.js | cut -c1-8)
JS_FILE="main.${HASH}.js"

mv /tmp/combined.js "${NGINX_ROOT}/js/${JS_FILE}"
# sed -i "s:main.js:${JS_FILE}:g" *.html
sed -i -E "s:main.([a-f0-9]{8}).js:${JS_FILE}:g" *.html
