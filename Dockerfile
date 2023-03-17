FROM node:16.13.0-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm
COPY . .
WORKDIR /web

RUN pnpm install
RUN pnpm prepare:db

EXPOSE 3001
CMD ["pnpm", "start:web"]