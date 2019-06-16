#!/usr/bin/env bash

protocol=$1


if [[ -z "$1" ]]; then
    echo "choose either http or https"
    exit 1
fi

if [ $protocol = "http" ] 
	then
		docker run -e HTTPS=OFF --rm -v "$PWD":/var/task lambci/lambda:nodejs10.x index.handler
	else
		docker run -e HTTPS=ON --rm -v "$PWD":/var/task lambci/lambda:nodejs10.x index.handler	
fi