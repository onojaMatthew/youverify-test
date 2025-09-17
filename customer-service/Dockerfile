
# Start the application using the pre-built version
FROM node:alpine

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

RUN npm install pm2 -g

COPY ./ ./

RUN npm run build

EXPOSE 5200

CMD ["pm2-runtime", "start", "ecosystem.config.js"]