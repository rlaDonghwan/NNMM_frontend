import Link from 'next/link'

export default function CTASection() {
  return (
    <div className="self-stretch h-[720px] relative">
      <div className="w-[1920px] h-[720px] absolute bg-gradient-to-b from-sky-300 to-neutral-200" />
      <Link href="/auth/signin">
        <button className="w-80 h-20 py-5 left-[798px] top-[500px] absolute bg-black rounded-[80px] inline-flex justify-center items-center gap-2.5">
          <div className="text-white text-4xl font-normal font-['AppleSDGothicNeoB00']">
            대시보드 생성하기
          </div>
        </button>
      </Link>
      <div className="w-[1755px] h-72 left-[82px] top-[150px] absolute text-center text-black text-6xl font-normal font-['AppleSDGothicNeoB00'] leading-[70PX]">
        내 비즈니스에 딱 맞는, 이제껏 경험 못 했던 <br />
        쉽고 편리한 NNMM의 대시보드로
        <br />
        지속 가능성을 실현하세요!
      </div>
    </div>
  )
}
