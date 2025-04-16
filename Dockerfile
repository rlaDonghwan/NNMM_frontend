# 1단계: 빌드용
FROM node:22-alpine AS builder

WORKDIR /app

# 🔥 환경변수 전달 받을 ARG 정의
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 Next.js가 빌드 타임에 환경변수를 인식할 수 있도록
RUN npm run build

# 2단계: 실행용  
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
