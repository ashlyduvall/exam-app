#
# Makefile for local running via just `make`
#

.SILENT:

default:
	docker run -it \
		-v "$$(pwd)/.docker/:/scripts" \
		-v "$$(pwd)/nginx-conf/:/etc/nginx/conf.d" \
		-v "$$(pwd)/web/:/usr/share/nginx/html" \
		-p 8080:80 \
		nginx \
		bash /scripts/run.sh
