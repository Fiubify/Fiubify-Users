#!/bin/sh -l

npm test --coverage

apk --no-cache add curl
curl -Os https://uploader.codecov.io/latest/alpine/codecov
chmod +x codecov
echo ${CODECOV_TOKEN}
./codecov -t ${CODECOV_TOKEN} -s ./coverage -R ./..
