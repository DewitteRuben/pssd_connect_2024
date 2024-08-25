FROM oven/bun:1 AS base

WORKDIR /usr/src/app

COPY --chown=bun:bun src src

COPY --chown=bun:bun package.json package.json

COPY --chown=bun:bun package-lock.json package-lock.json

COPY --chown=bun:bun bun.lockb bun.lockb

COPY --chown=bun:bun tsconfig.json tsconfig.json

RUN bun install --frozen-lockfile --production

RUN chown -R bun:bun /usr/src/app/node_modules

USER bun

EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "src/index.ts" ]