# 📁 Frontend 디렉토리 구조 설명

Next.js + TypeScript + TailwindCSS 기반 구조, 기능 분리 및 API 연결을 고려한 설계

---

## 📁 src

### 📁 components/auth

공통 인증 관련 UI 컴포넌트 모음

| 파일명                | 설명                                                       |
| --------------------- | ---------------------------------------------------------- |
| `AuthFormWrapper.tsx` | 로그인/회원가입 폼 레이아웃을 감싸는 공통 Wrapper 컴포넌트 |
| `SignInForm.tsx`      | 로그인 폼 기능 및 UI                                       |
| `SignUpForm.tsx`      | 회원가입 폼 기능 및 UI                                     |

---

### 📁 pages/auth

Next.js의 라우팅을 담당하는 인증 페이지

| 파일명       | 설명                                                          |
| ------------ | ------------------------------------------------------------- |
| `signin.tsx` | 로그인 페이지 (`/auth/signin`) - 내부에서 `SignInForm` 사용   |
| `signup.tsx` | 회원가입 페이지 (`/auth/signup`) - 내부에서 `SignUpForm` 사용 |

---

### 📁 pages/dashboard

로그인 성공 후 이동하는 대시보드 페이지

| 파일명      | 설명                                                             |
| ----------- | ---------------------------------------------------------------- |
| `index.tsx` | 대시보드 메인 (`/dashboard`) - 추후 주요 기능 페이지로 확장 가능 |

---

### 📄 pages/index.tsx

기본 홈(`/`) 페이지 (보통 로그인 페이지 또는 랜딩 용도로 사용)

---

### 📄 pages/\_app.tsx

글로벌 레이아웃 설정 및 글로벌 스타일 적용 지점

---

### 📁 services

API 통신 로직 모음 (프론트 → 백엔드)

| 파일명    | 설명                                                                 |
| --------- | -------------------------------------------------------------------- |
| `auth.ts` | 로그인/회원가입 관련 axios 요청 정의 (`/auth/login`, `/auth/signup`) |

---

### 📁 styles

TailwindCSS 및 전역 스타일 정의

| 파일명        | 설명                      |
| ------------- | ------------------------- |
| `globals.css` | Tailwind 및 기본 CSS 설정 |

---

## ✅ 기타

- **라우팅**: `/pages` 내부 구조가 URL 경로를 자동으로 정의
- **코드분리**: UI는 `components`, API는 `services`, 페이지는 `pages`에 나눔
- **Tailwind**: 모든 컴포넌트는 `globals.css`에서 설정된 Tailwind를 사용
- **API 연동**: `services/auth.ts` → Nest 백엔드의 `/auth/*`로 요청

---
