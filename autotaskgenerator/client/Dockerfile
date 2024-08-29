FROM node:20.16-alpine3.19

WORKDIR /build

COPY package*.json .
COPY env .env

RUN npm install --omit=dev && npm cache clean --force

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
#FROM nginx:1.17.1-alpine
#COPY build/ /usr/share/nginx/html
#COPY env /usr/share/nginx/html/.env
#RUN rm /etc/nginx/conf.d/default.conf
#COPY react.conf /etc/nginx/conf.d

#CMD ["nginx","-g","daemon off;"]
