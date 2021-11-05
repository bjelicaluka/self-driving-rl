FROM node:17-alpine

WORKDIR /app

COPY . .

RUN npm ci --production

CMD ["npm", "start"]