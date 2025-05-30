FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


#builder

FROM base as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .


ENV SKIP_ENV_VALIDATION=true

RUN npm run build

## production image runner

FROM base as runner

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Exposed port
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Run the nextjs app
CMD ["node", "server.js"]