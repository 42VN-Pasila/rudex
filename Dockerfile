FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . .
RUN yarn gen && yarn build

EXPOSE 4000 4010

CMD ["yarn", "start"]
