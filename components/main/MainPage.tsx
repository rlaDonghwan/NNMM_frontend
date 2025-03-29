import type {NextPage} from 'next'
import Link from 'next/link'

const Frame: NextPage = () => {
  //변수선언 로직
  return (
    <div className="w-full h-[5258px] relative bg-white">
      <div className="w-full h-[1080px] left-0 top-0 absolute inline-flex flex-col justify-start items-start gap-0.5">
        <div className="self-stretch px-10 py-8 inline-flex justify-between items-center">
          <div className="flex justify-start items-center gap-[5px]">
            <img className="w-16 h-16" src="https://placehold.co/70x70" />
            <div className="w-32 h-10 text-center justify-center text-black text-4xl font-normal font-['AppleSDGothicNeoB00']">
              NNMM
            </div>
          </div>
          <div className="flex justify-start items-center gap-11">
            <div className="w-20 h-20 p-5 bg-slate-100 rounded-[40px] shadow-[4px_4px_18px_-2px_rgba(231,228,232,0.80)] flex justify-center items-center gap-2.5">
              <div className="w-10 h-10 relative">
                <div className="w-10 h-10 left-0 top-0 absolute bg-slate-400"></div>
                <div className="w-4 h-4 left-[11.30px] top-[11.30px] absolute bg-slate-400"></div>
              </div>
            </div>
            <div className="w-20 h-20 px-4 py-3 bg-slate-100 rounded-[40px] shadow-[4px_4px_18px_-2px_rgba(231,228,232,0.80)] inline-flex flex-col justify-center items-center gap-2.5">
              <div className="w-10 h-10 relative">
                <div className="w-3 h-2 left-[12.06px] top-[32.50px] absolute bg-red-400"></div>
                <div className="w-8 h-7 left-[1.64px] top-[5px] absolute bg-red-400"></div>
                <div className="w-4 h-4 left-[21.64px] top-0 absolute bg-red-400"></div>
              </div>
            </div>
            <div className="w-20 h-20 bg-stone-300 rounded-full"></div>
            <img className="w-48 h-32" src="https://placehold.co/185x123" />
          </div>
        </div>
        <div className="self-stretch h-[925px] relative">
          <div className="w-full h-[925px] left-0 top-0 absolute bg-gradient-to-b from-sky-300 to-neutral-200 rounded-[40px]"></div>
          <Link href="/auth/signin">
            <button className="w-80 h-20 py-5 left-[799px] top-[767px] absolute bg-black rounded-[80px] inline-flex justify-center items-center gap-2.5">
              <div className="justify-start text-white text-4xl font-['AppleSDGothicNeoB00']">
                대시보드 생성하기
              </div>
            </button>
          </Link>
          <img
            className="w-[825px] h-[644px] left-[1062px] top-[140px] absolute"
            src="https://placehold.co/825x644"
          />
          <div className="left-[80px] top-[510px] absolute justify-start text-neutral-800 text-5xl font-normal font-['AppleSDGothicNeoB00']">
            환경, 사회, 거버넌스 지표를 자유롭게 구성하고 <br />
            맞춤형 대시보드를 만들어보세요.{' '}
          </div>
          <div className="w-[1041px] h-40 left-[80px] top-[275px] absolute justify-start text-indigo-700 text-7xl font-normal font-['AppleSDGothicNeoB00']">
            사용자가 선택한 지표를 기반으로 <br />
            자동 생성되는 그래프와 차트{' '}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Frame
