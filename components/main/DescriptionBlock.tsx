import ChatBubble from '@/components/main/ChatBubble'

export default function DescriptionBlock() {
  return (
    <div className="w-full px-4 py-12 bg-white">
      {/* 상단 텍스트 */}
      <div className="max-w-6xl mx-auto text-center text-black text-3xl sm:text-4xl lg:text-5xl font-normal font-apple mb-12">
        ESG 대시보드, 그동안 복잡하고 불편하지 않으셨나요?
      </div>

      {/* 대화 상자 */}
      <div className="relative w-full max-w-xl min-h-[400px] mx-auto flex flex-col justify-end gap-12">
        <div className="text-xl sm:text-2xl self-start">
          <ChatBubble
            direction="left"
            text="원하지 않는 지표들까지 한꺼번에 나와요."
            avatar="/main/avatarR.svg"
          />
        </div>
        <div className="text-xl sm:text-2xl self-end">
          <ChatBubble
            direction="right"
            text="사용자가 직관적으로 이용하기 불편해요."
            avatar="/main/avatarNew.svg"
          />
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div className="max-w-6xl mx-auto mt-16 text-center text-black text-3xl sm:text-4xl lg:text-5xl font-normal font-apple [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
        NNMM의 대시보드는 사용자가 보유한 데이터를 바탕으로
        <br />
        우리 기업만의 대시보드를 손쉽게 만들 수 있는 혁신적인 도구입니다.
      </div>
    </div>
  )
}
