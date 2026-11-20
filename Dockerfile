FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

FROM nginx:stable-alpine AS production

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

USER nginx
EXPOSE 8080

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
