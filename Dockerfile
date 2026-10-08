# --- BUILD STAGE ---
FROM node:20-alpine AS builder

WORKDIR /app

# npm yerine package.json ve yarn.lock dosyalarını kopyalıyoruz
COPY package.json yarn.lock ./

# Yarn ile güvenilir ve kilitli kurulum (npm ci karşılığı)
RUN yarn install --frozen-lockfile

# Tüm kaynak kodunu içeri alıyoruz
COPY . .

# NestJS projesini Yarn ile derliyoruz
RUN yarn build

# --- PRODUCTION STAGE ---
FROM node:20-alpine

WORKDIR /app

# Docker'ın verdiği legacy uyarısını '=' ekleyerek çözdük
ENV NODE_ENV=production

# Güvenlik Adımı: Root yerine yetkisi kısıtlı 'node' kullanıcısı
USER node

# Sadece derlenmiş kodları ve bağımlılıkları alıyoruz
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Uygulamanın çalışacağı port
EXPOSE 3000

# Uygulamayı başlatıyoruz
CMD ["yarn", "start:prod"]