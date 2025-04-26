FROM node:20-alpine As development
WORKDIR /usr/src/app
ADD package*.json ./
RUN npm install
ADD . .
RUN npm run build
