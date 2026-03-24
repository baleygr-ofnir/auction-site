# Catch args before FROM statements
ARG NODE_VERSION
ARG NGINX_VERSION

# Stage 1: Build
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# Enable corepack for native pnpm support
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

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
