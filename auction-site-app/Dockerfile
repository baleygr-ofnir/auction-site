# Catch args before FROM statements
ARG NODE_VERSION
ARG NGINX_VERSION

# Stage 1: Build
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# Enable corepack for native pnpm support
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build 

# Stage 2: Serve
FROM nginx:${NGINX_VERSION}
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Catch the port arg for the final stage
ARG APP_PORT
EXPOSE ${APP_PORT}

CMD ["nginx", "-g", "daemon off;"]
