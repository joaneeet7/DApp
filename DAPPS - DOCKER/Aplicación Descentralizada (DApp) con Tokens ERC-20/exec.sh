#!/bin/bash
docker build -t tokens:v1 .                    
docker run -p 3000:3000 tokens:v1 entrypoint.sh