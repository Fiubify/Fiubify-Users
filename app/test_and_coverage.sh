#!/bin/sh -l

npm test

apk --no-cache add curl
curl -Os https://uploader.codecov.io/latest/linux/codecov
chmod +x codecov
./codecov -t ${CODECOV_TOKEN} -s ./coverage -R ./
