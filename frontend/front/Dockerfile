FROM node:lts-alpine as develop-stage
WORKDIR /front
COPY package*.json ./

RUN ls

RUN npm install

RUN npm install -g @vue/cli

RUN npm rebuild node-sass

COPY . .
EXPOSE 3001

# build stage
FROM develop-stage as build-stage
CMD ["npm", "run", "build"]