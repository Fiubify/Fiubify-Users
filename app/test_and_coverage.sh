#!/bin/sh -l

npm test

apk --no-cache add curl
curl -Os https://uploader.codecov.io/latest/linux/codecov
chmod +x codecov
CODECOV_SLUG=Fiubify/Fiubify-Users ./codecov -C ${CODECOV_SHA} -t ${CODECOV_TOKEN} -s ./coverage -R ./
