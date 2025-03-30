## ✅ App Router 방식 구조 리팩토링 기준

### 1. **`pages` 폴더 제거**

- ❌ `pages/` → ✅ `app/` 폴더 중심으로 전환
- ✅ 모든 라우트는 `app/` 폴더 하위에서 `page.tsx`, `layout.tsx` 기반으로 구성

### 2. **공통 layout.tsx는 app 루트에 위치**

```tsx
// app/layout.tsx
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
```

### 3. **`app/` 내 라우트 구조**

예시:

```
app/
├─ (auth)/
│  ├─ signin/
│  │  └─ page.tsx
│  ├─ signup/
│  │  ├─ page.tsx
│  │  └─ layout.tsx
├─ (bar)/
│  ├─ dashboard/
│  │  ├─ page.tsx
│  │  ├─ layout.tsx ← DashboardHeader + Sidebar
│  │  ├─ environmental/
│  │  │  └─ page.tsx
│  │  ├─ governance/
│  │  │  └─ page.tsx
│  │  └─ social/
│  │     └─ page.tsx
│  └─ mypage/
│     ├─ page.tsx
│     └─ layout.tsx
├─ (main)/
│  ├─ layout.tsx
│  └─ page.tsx ← 랜딩 페이지
```

---

## ✅ 글로벌 스타일 적용

- `app/globals.css` → 유지
- `tailwind.config.ts`에 전역 font, 색상 등 커스텀

```tsx
// app/layout.tsx
import './globals.css'
```

---

## ✅ `components/` 분리 가이드

- `components/ui/` → shadcn 기반 UI 요소들
- `components/layout/` → Header, Sidebar 등
- `components/dashboard/` → ESG 관련 구성요소 (ex. 카드, 그리드 등)
- `components/auth/` → 로그인/회원가입 컴포넌트

---

## ✅ 기타 경로 기준

- `/services` → API 통신 함수
- `/utils` → 인증, 날짜 등 헬퍼
- `/lib` → 전역 상태, 클래스 유틸 등
