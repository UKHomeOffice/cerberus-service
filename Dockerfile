FROM node:10-alpine as builder

RUN apk update && apk upgrade && apk add --no-cache git
RUN mkdir -p /src

WORKDIR /src

COPY package*.json ./
RUN npm install
COPY . /src

# This allows to pass env vars on runtime
# Remember to also update run.sh, webpack.config.js and config.js
ENV KEYCLOAK_AUTH_URL=REPLACE_KEYCLOAK_AUTH_URL \
    KEYCLOAK_CLIENT_ID=REPLACE_KEYCLOAK_CLIENT_ID \
    KEYCLOAK_REALM=REPLACE_KEYCLOAK_REALM \
    FORM_API_URL=REPLACE_FORM_API_URL \
    REFDATA_API_URL=REPLACE_REFDATA_API_URL

RUN npm run build

# Now build teh final image based on nginx
FROM alpine:3.7

ENV NGINX_CONFIG_FILE=/etc/nginx/nginx.conf

RUN apk upgrade --no-cache && \
    apk add --no-cache nginx bash nginx-mod-http-lua && \
    install -d -g nginx -o nginx /run/nginx && \
    chown -R nginx:nginx /etc/nginx /var/log/nginx

COPY --from=builder /src/dist/ /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=100 /nginx/run.sh /run.sh

RUN chmod 700 /run.sh
RUN chown nginx /usr/share/nginx/html

# UID for ngnix user
USER 100

EXPOSE 8080

ENTRYPOINT ["/run.sh"]

