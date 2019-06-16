# Use docker images for lambda(https://github.com/lambci/docker-lambda)
FROM lambci/lambda:build-nodejs10.x

# Build node-libcurl project
RUN git clone https://github.com/JCMais/node-libcurl.git && cd node-libcurl && npm install && npm run install
