FROM node:18.8.0-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm
COPY . .
WORKDIR /web

ENV DATABASE_URL "postgresql://postgres:MshlQCXOk1R3OIMR6OJL@containers-us-west-89.railway.app:6034/reddam-pokemon-go"

RUN pnpm install
RUN pnpm prepare:db

EXPOSE 3001
CMD ["pnpm", "start:ws"]