import ChatBubble from '@/components/common/ChatBubble'

export default function DescriptionBlock() {
  return (
    <div className="self-stretch h-[750px] relative bg-white overflow-hidden">
      {/* 상단 텍스트 */}
      <div className="w-[1766px] left-[86px] top-[89px] absolute text-center text-black text-5xl font-normal font-['AppleSDGothicNeoB00']">
        ESG 대시보드, 그동안 복잡하고 불편하지 않으셨나요?
      </div>
      {/* 대화 상자 */}
      <div className="relative w-[750px] h-[530px] mx-auto flex flex-col justify-end gap-6">
        <ChatBubble
          direction="left"
          text="원하지 않는 지표들까지 한꺼번에 나와요."
          avatar="/main/avatarR.svg"
          className="absolute left-4 top-[100px] text-2xl"
        />
        <ChatBubble
          direction="right"
          text="사용자가 직관적으로 이용하기 불편해요."
          avatar="/main/avatarNew.svg"
          className="absolute right-4 top-[480px] text-2xl"
        />
      </div>

      {/* 하단 텍스트 */}
      <div className="w-[1766px] h-48 left-[86px] top-[550px] absolute text-center text-black text-5xl font-normal font-['AppleSDGothicNeoB00'] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
        NNMM의 대시보드는 사용자가 보유한 데이터를 바탕으로
        <br />
        우리 기업만의 대시보드를 손쉽게 만들 수 있는 혁신적인 도구입니다.
      </div>
    </div>
  )
}
