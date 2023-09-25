FROM oven/bun

COPY . /bot

WORKDIR /bot

RUN bun install --production

CMD ["bun", "run", "start:prod"]

