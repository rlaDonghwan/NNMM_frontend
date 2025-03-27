import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="self-stretch h-[925px] relative overflow-hidden">
      <img
        className="w-[1920px] h-[800x] left-0 top-0 absolute"
        src="/main/banner.svg"
        alt="bannerImage"
      />
      <Link href="/auth/signin">
        <button className="w-80 h-20 py-5 left-[798px] top-[700px] absolute bg-black rounded-[80px] inline-flex justify-center items-center gap-2.5">
          <div className="text-white text-4xl font-normal font-['AppleSDGothicNeoB00']">
            대시보드 생성하기
          </div>
        </button>
      </Link>
      <img
        className="w-[700px] h-[500x] left-[1150px] top-[140px] absolute"
        src="/main/dashboard.png"
        alt="heroImage"
      />
      <div className="left-[80px] top-[510px] absolute text-neutral-800 text-5xl font-normal font-['AppleSDGothicNeoB00']">
        환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
        맞춤형 대시보드를 만들어보세요.
      </div>
      <div className="w-[1041px] h-40 left-[80px] top-[300px] absolute text-indigo-700 text-7xl font-normal font-['AppleSDGothicNeoB00']">
        사용자가 선택한 지표를 기반으로 <br />
        자동 생성되는 그래프와 차트
      </div>
      <div className="flex items-center left-[80px] top-[140px] absolute">
        <img
          className="w-[70px] h-[70px] mr-2" // Add margin-right to give space between image and text
          src="/main/logo.png"
          alt="NnmmLogo"
        />
        <div className="text-neutral-800 text-4xl font-normal font-['AppleSDGothicNeoB00']">
          NNMM
        </div>
      </div>
    </div>
  )
}
