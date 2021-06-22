#!/bin/sh -

set -o errexit

# mkdir -p /run/nginx

# @TODO replace with envsubst

# --- Start Insert ENV to JS bundle ---
# Remember to also update webpack.config.js, Dockerfile and config.js
# echo "== Inserting env variables =="
for file in /usr/share/nginx/html/*.js
do
  echo "== ENV sub for $file =="
  cat $file | sed 's,REPLACE_KEYCLOAK_AUTH_URL,'${KEYCLOAK_AUTH_URL}',g' > $file
  cat $file | sed 's,REPLACE_KEYCLOAK_CLIENT_ID,'${KEYCLOAK_CLIENT_ID}',g' > $file
  cat $file | sed 's,REPLACE_KEYCLOAK_REALM,'${KEYCLOAK_REALM}',g' > $file
  cat $file | sed 's,REPLACE_FORM_API_URL,'${FORM_API_URL}',g' > $file
  cat $file | sed 's,REPLACE_REFDATA_API_URL,'${REFDATA_API_URL}',g' > $file
done
# echo "== Finished ENV sub =="
# --- End Insert ENV to JS bundle ---


# echo "== Starting nginx using a config file =="
# sed -i 's,REPLACE_CERBERUS_API_URL,'${CERBERUS_API_URL}',g' ${NGINX_CONFIG_FILE}
# export CERBERUS_API_SERVER=`echo ${CERBERUS_API_URL} | awk -F/ '{print $3}'`
# sed -i 's,REPLACE_CERBERUS_API_SERVER,'${CERBERUS_API_SERVER}',g' ${NGINX_CONFIG_FILE}
# nginx -g 'daemon off;' -c ${NGINX_CONFIG_FILE}

# /docker-entrypoint.sh