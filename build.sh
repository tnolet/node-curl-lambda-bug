#!/bin/bash

# Create image from dockerfile
docker build . -t node-libcurl-amazon-build

# Create container and copy node addon
docker create --name node-libcurl-amazon-build node-libcurl-amazon-build exit
docker cp node-libcurl-amazon-build:/var/task/node-libcurl/lib/binding/node_libcurl.node ./node_modules/node-libcurl/lib/binding/node_libcurl.node

