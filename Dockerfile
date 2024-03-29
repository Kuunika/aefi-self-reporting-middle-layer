FROM node:16.13.1 as building
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:16.13.1-alpine
WORKDIR /usr/src/app
COPY --from=building /usr/src/app/package*.json ./
RUN npm install --only=prod
RUN apk add nano
COPY --from=building /usr/src/app/dist ./
CMD ["node", "main.js"]