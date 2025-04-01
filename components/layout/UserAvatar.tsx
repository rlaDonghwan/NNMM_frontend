// components/layout/UserAvatar.tsx
'use client'

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'

export default function UserAvatar() {
  // 나중에 실제 사용자 정보 반영도 가능
  return (
    <Avatar className="mr-2">
      <AvatarImage
        src="https://avatars.githubusercontent.com/u/118759932?v=4&size=64"
        alt="사용자 아바타"
      />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  )
}
