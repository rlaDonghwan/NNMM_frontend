import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="relative flex items-center justify-center h-[90vh] w-full bg-white">
      {/* 배경 스타일 */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 3%, 70% 50%, 100% 97%, 100% 100%, 0 100%)',
          background: 'linear-gradient(to bottom, #87CEFA, #f9f9f9)'
        }}
      />

      {/* 컨텐츠 래퍼 */}
      <div className="relative flex w-full max-w-8xl mx-auto px-6 md:px-12">
        {/* 왼쪽 텍스트 */}
        <div className="flex flex-col justify-center w-full md:w-1/2 text-left">
          <h2 className="text-indigo-700 text-2xl md:text-5xl font-apple leading-snug">
            사용자가 선택한 지표를 기반으로 <br />
            자동 생성되는 그래프와 차트
          </h2>
          <p className="text-neutral-800 text-md md:text-2xl mt-4">
            환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
            맞춤형 대시보드를 만들어보세요.
          </p>

          {/* 버튼 */}
          <Link href="signin">
            <button className="mt-6 w-52 h-14 md:w-64 md:h-16 bg-black rounded-full text-white text-lg md:text-xl font-semibold">
              대시보드 생성하기
            </button>
          </Link>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="hidden md:flex justify-end w-1/2">
          <img
            className="w-[100%] max-w-lg object-contain"
            src="/main/chart.svg"
            alt="heroImage"
          />
        </div>
      </div>

      {/* 로고 */}
      {/* <div className="absolute top-6 left-6 flex items-center">
        <img className="w-12 h-12" src="/main/logo.png" alt="NnmmLogo" />
        <span className="ml-2 text-neutral-800 text-2xl font-bold">NNMM</span>
      </div> */}
    </div>
  )
}
