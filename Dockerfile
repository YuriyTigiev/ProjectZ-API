FROM node:10.13.0-alpine

WORKDIR /usr/src/app
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
RUN npm install -g node-gyp node-pre-gyp @babel/core @babel/cli && \
npm rebuild bcrypt --build-from-source && \
npm cache clean --force

COPY ./package.json .
RUN npm install
COPY ./ .

CMD ["npm", "run", "serve"]
