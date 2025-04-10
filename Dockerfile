# 1. Node 이미지
FROM node:22

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 종속성 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스 복사
COPY . .

# 5. 빌드 (Next.js 프로덕션용 빌드)
RUN npm run build

# 6. 포트 오픈 (Next는 기본 3000)
EXPOSE 3000

# 7. 앱 실행 (SSR)
CMD ["npm", "run", "start"]
