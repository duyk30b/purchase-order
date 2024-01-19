FROM node:18.19.0-alpine AS local
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.19.0-alpine As production
COPY package*.json ./
RUN npm install --production
COPY . .
COPY --from=local /app/dist ./dist
CMD [ "npm", "run", "start:prod" ]