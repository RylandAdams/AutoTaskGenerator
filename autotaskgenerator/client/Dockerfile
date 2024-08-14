FROM node:20.16-alpine3.19

WORKDIR /build

COPY package*.json .

RUN npm install --omit=dev && npm cache clean --force

COPY . .

CMD ["npm", "start"]