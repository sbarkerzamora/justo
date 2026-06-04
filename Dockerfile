FROM node:22-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json packages/core/package.json
COPY packages/tools/package.json packages/tools/package.json
COPY packages/pdf/package.json packages/pdf/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]