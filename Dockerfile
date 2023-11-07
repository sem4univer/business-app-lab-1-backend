FROM --platform=linux/amd64 node:18

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i
RUN npm run ci:prepare
COPY  . .

RUN npm run build

CMD [ "node", "dist/main.js" ]