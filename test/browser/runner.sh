#!/bin/bash

ROOT="$(dirname $0)/../../node_modules/.bin"

# spin up the server
npm start & NODE=$!
sleep 3

# run tests
$ROOT/protractor "$(dirname $0)/config.js"
EXIT=$?

# cleanup
kill $NODE &>/dev/null || true

# exit with test status
exit $EXIT