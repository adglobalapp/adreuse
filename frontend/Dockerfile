# syntax=docker/dockerfile:1
# 1) Build: a buildgép saját architektúráján fut (gyors), a kimenet sima statikus fájl.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_REGISTRATION_ENABLED=
ENV VITE_REGISTRATION_ENABLED=$VITE_REGISTRATION_ENABLED
RUN npm run build

# 2) Kiszolgálás: nginx, ARM64-en (Raspberry Pi) és amd64-en is.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
