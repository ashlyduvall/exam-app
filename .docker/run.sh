#!/bin/bash

/scripts/build.sh
/docker-entrypoint.sh nginx -g "daemon off;"
