#!/bin/bash

# generate private key
openssl genrsa -out server.key 1024

# generate signing request
openssl req -new -sha256 -key server.key -out server.csr -subj "/CN=localhost"

# remove passphrase from key
mv server.key server.key.org
openssl rsa -in server.key.org -out server.key

# generate certificate
openssl x509 -req -in server.csr -signkey server.key -out server.crt