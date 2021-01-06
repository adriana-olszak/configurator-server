FROM node:14-slim As development

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python

COPY package*.json ./
COPY prisma ./

RUN npm install

COPY . .

RUN npm run prisma:generate

RUN npm run build

## PROD
FROM node:14-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python

COPY package*.json ./
COPY prisma ./

RUN npm install --only=production

COPY . .

RUN npm run prisma:generate

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/src/main"]
