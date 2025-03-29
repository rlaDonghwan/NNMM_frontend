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
      <div className="relative flex w-full max-w-8xl mx-auto px-6 md:px-40">
        {/* 왼쪽 텍스트 */}
        <div className="flex flex-col justify-center w-full md:w-1/ text-left">
          <h2 className="text-indigo-700 text-2xl md:text-6xl font-apple leading-snug">
            사용자가 선택한 지표를 기반으로 <br />
            자동 생성되는 그래프와 차트
          </h2>
          <p className="text-neutral-800 text-md md:text-3xl mt-4 font-apple">
            환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
            맞춤형 대시보드를 만들어보세요.
          </p>

          {/* 버튼 */}
          <Link href="signin">
            <button className="mt-6 self-end md:self-start md:ml-[64%] w-52 h-11 bg-black rounded-full text-white text-lg md:text-xl font-apple transition">
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
    </div>
  )
}
