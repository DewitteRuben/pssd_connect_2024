FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb package-lock.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb package-lock.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --chown=bun:bun --from=install /temp/dev/node_modules node_modules
COPY --chown=bun:bun src src
COPY --chown=bun:bun package.json package.json
COPY --chown=bun:bun package-lock.json package-lock.json
COPY --chown=bun:bun bun.lockb bun.lockb
COPY --chown=bun:bun tsconfig.json tsconfig.json

# copy production dependencies and source code into final image
FROM base AS release
COPY --chown=bun:bun --from=install /temp/prod/node_modules node_modules
COPY --chown=bun:bun --from=prerelease /usr/src/app/src .
COPY --chown=bun:bun --from=prerelease /usr/src/app/package.json .
COPY --chown=bun:bun --from=prerelease /usr/src/app/package-lock.json .

USER bun

EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "index.ts" ]