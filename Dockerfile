FROM nginx:1.21.6

WORKDIR /usr/share/nginx/html

COPY .docker/* /
COPY ./web/ .

RUN /build.sh
