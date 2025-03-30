'use client'

import Image from 'next/image'

interface Props {
  direction: 'left' | 'right'
  text: string
  avatar: string
}

export const ChatBubble = ({direction, text, avatar}: Props) => {
  const isLeft = direction === 'left'

  return (
    <div className={`flex items-start mb-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* 아바타 */}
      <Image
        src={avatar}
        alt="avatar"
        width={120}
        height={120}
        className="rounded-full"
      />

      {/* 말풍선 영역 */}
      <div className="max-w-[100%] mx-4">
        <div
          className={`
            relative px-4 py-3 rounded-xl text-white text-2xl leading-snug break-keep
            ${isLeft ? 'bg-[#4073a6]' : 'bg-[#588865]'}
          `}>
          {text}
          {/* 말풍선 꼬리 */}
          <span
            className={`
              absolute
              ${
                isLeft
                  ? 'left-[-8px] border-y-[8px] border-r-[8px] border-l-0 border-solid border-transparent border-r-[#4073a6]'
                  : 'right-[-8px] border-y-[8px] border-l-[8px] border-r-0 border-solid border-transparent border-l-[#588865]'
              }
            `}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
