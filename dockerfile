FROM node:16-slim

RUN apt-get update && apt-get install -y openssl libssl-dev

ENV SESSION_COOKIE_NAME=session
ENV LOG_DIRECTORY="/app/logs"
ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

RUN ls -al

COPY package*.json /app
RUN ls -al
RUN npm install
RUN ls -al
COPY . /app

RUN ls -al

RUN npm run build

EXPOSE 3000

CMD "npm" "start"