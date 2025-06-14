FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV MY_SQL_HOST=localhost
ENV MY_SQL_USER=root
ENV MY_SQL_PASSWORD=password
ENV MY_SQL_DATABASE=my_database

CMD ["node", "index.js"]