import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="w-full relative overflow-hidden bg-white px-4 py-12">
      {/* 배너 이미지 */}
      <div className="relative w-full min-h-screen md:min-h-screen rounded-3xl overflow-hidden ">
        <div
          className="absolute inset-0"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% 5%, 70% 50%, 100% 95%,100% 100%, 0 100%)',
            background: 'linear-gradient(to bottom, #87CEFA, #f9f9f9)'
          }}
        />
        {/* <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 text-left z-10"></div> */}
        {/* 차트 이미지 */}
        <div className="absolute right-4 top-20 w-screen max-w-lg md:block">
          <img
            className="w-full h-auto object-contain"
            src="/main/chart.svg"
            alt="heroImage"
          />
        </div>
        {/* 설명 텍스트 */}
        <div className="absolute left-4 md:left-12 bottom-[20%] text-neutral-800 text-xl md:text-4xl font-normal font-apple max-w-[80%]">
          환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
          맞춤형 대시보드를 만들어보세요.
        </div>
        <div className="absolute left-4 md:left-12 top-[28%] text-indigo-700 text-2xl md:text-6xl font-normal font-apple max-w-[80%]">
          사용자가 선택한 지표를 기반으로 <br />
          자동 생성되는 그래프와 차트
        </div>
        {/* 로고 및 회사명 */}
        <div className="absolute left-4 top-4 flex items-center">
          <div className="w-10 aspect-square mr-2">
            <img
              className="w-full h-full object-contain"
              src="/main/logo.png"
              alt="NnmmLogo"
            />
          </div>
          <div className="text-neutral-800 text-xl md:text-3xl font-normal font-apple">
            NNMM
          </div>
        </div>
        {/* 로그인 버튼 */}
        <Link href="/auth/signin">
          <button className="absolute left-1/2 bottom-8 transform -translate-x-1/2 w-64 h-14 md:w-80 md:h-20 bg-black rounded-full inline-flex justify-center items-center gap-2.5">
            <span className="text-white text-lg md:text-2xl font-normal font-apple">
              대시보드 생성하기
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}
