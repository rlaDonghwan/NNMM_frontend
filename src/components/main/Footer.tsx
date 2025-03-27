import Link from 'next/link'

export default function CTASection() {
  return (
    <div className="w-full px-4 py-20 bg-gradient-to-b from-sky-300 to-neutral-200 flex flex-col items-center justify-center text-center">
      <div className="max-w-6xl mx-auto mb-16 text-black text-4xl md:text-5xl lg:text-6xl font-normal font-apple leading-tight">
        내 비즈니스에 딱 맞는, 이제껏 경험 못 했던 <br />
        쉽고 편리한 NNMM의 대시보드로
        <br />
        지속 가능성을 실현하세요!
      </div>
      <Link href="/auth/signin">
        <button className="w-64 h-16 md:w-80 md:h-20 bg-black rounded-full flex items-center justify-center text-white text-2xl md:text-4xl font-normal font-apple">
          대시보드 생성하기
        </button>
      </Link>
    </div>
  )
}
