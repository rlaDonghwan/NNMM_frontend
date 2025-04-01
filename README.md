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

좋아! 차트 유형별로 어떤 식으로 데이터를 입력해야 하는지 **Markdown 표 형식**으로 깔끔하게 정리해줄게. 직접 모달에서 입력하거나 CSV 준비할 때 참고하면 돼.

---

## 📊 Bar / Line 차트용 입력

> ✅ **하나의 지표에 여러 연도 데이터 입력**

| 지표      | 2022 | 2023 | 2024 |
| --------- | ---- | ---- | ---- |
| 총 임직원 | 100  | 110  | 120  |

---

## 🥧 Pie / Doughnut 차트용 입력

> ✅ **여러 지표 + 하나의 연도 데이터 입력**

| 지표             | 2023 |
| ---------------- | ---- |
| 총 임직원        | 100  |
| 여성 임직원 비율 | 35   |
| 비정규직 비율    | 15   |

---

## 🌀 PolarArea 차트용 입력

> ✅ **Pie와 동일하게 동작**  
> → **여러 지표 + 하나의 연도**

| 지표            | 2023 |
| --------------- | ---- |
| 온실가스 배출량 | 200  |
| 에너지 사용량   | 80   |
| 수자원 사용량   | 40   |

---

## 🕸️ Radar 차트용 입력

> ✅ **여러 지표 + 하나의 연도**  
> → 점수나 평가 항목 등에 적합

| 지표          | 2024 |
| ------------- | ---- |
| 환경 점수     | 85   |
| 사회 점수     | 78   |
| 지배구조 점수 | 72   |

---

## ✅ 정리 요약

| 차트 종류      | 지표 수 | 연도 수 | 사용 예시                       |
| -------------- | ------- | ------- | ------------------------------- |
| Bar / Line     | 1개     | 여러 개 | 1개 지표의 시간 흐름            |
| Pie / Doughnut | 여러 개 | 1개     | 1년 기준으로 지표 비율 비교     |
| PolarArea      | 여러 개 | 1개     | 비율형 비교 (방사형 시각화)     |
| Radar          | 여러 개 | 1개     | 평가 점수/항목 비교 (정규화 용) |

---

필요하면 이걸 CSV나 JSON 형태로도 바꿔줄 수 있어!  
추가로 차트 미리보기 전용 "샘플 자동 삽입 버튼" 같은 것도 만들까?
