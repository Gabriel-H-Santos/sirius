#### Build stage
FROM node:24.19.0-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/

RUN pnpm install --frozen-lockfile --filter @sirius/api

COPY tsconfig.base.json ./
COPY apps/api apps/api

RUN pnpm --filter @sirius/api build
RUN pnpm --filter @sirius/api --prod deploy --legacy /out

#### Runtime stage
FROM node:24.19.0-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /out .

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "fetch('http://localhost:3000/health').then((r) => process.exit(r.status === 200 ? 0 : 1)).catch(() => process.exit(1))"

  CMD ["node", "dist/main.js"]
