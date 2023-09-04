FROM node:12

WORKDIR /server

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
