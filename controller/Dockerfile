FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY code-challenge-fe/package.json code-challenge-fe/package-lock.json ./
RUN npm ci

COPY code-challenge-fe/ .
RUN npm run build

FROM nginx:alpine

COPY controller/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist/code-challenge-fe/browser /usr/share/nginx/html

EXPOSE 80
