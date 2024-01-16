FROM alpine:latest

WORKDIR /app

COPY . /

ENV NODE_ENV=production

RUN apk update && apk add --no-cache libstdc++ libgcc

CMD ["./app_pkg" ]

