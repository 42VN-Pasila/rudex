ARG PORT=4000

FROM node:20.18.0-alpine AS base
WORKDIR /app