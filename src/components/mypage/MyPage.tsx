import ProfileImage from '@/components/mypage/ProfileImage'
import PasswordInput from '@/components/mypage/PasswordInput'
import InfoRow from '@/components/mypage/InfoRow'

export const MyPage = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Left Section */}
      <div className="w-1/3 bg-gradient-to-b from-blue-200 to-blue-300 flex items-center justify-center">
        <ProfileImage />
      </div>

      {/* Right Section */}
      <div className="w-2/3 bg-white p-10">
        <div className="space-y-6">
          {/* ID Field (Disabled) */}
          <div className="flex items-center">
            <label className="w-32 text-gray-600">아이디</label>
            <input
              type="text"
              className="flex-1 bg-gray-100 rounded-lg px-4 py-2"
              disabled
            />
          </div>

          {/* Password Fields */}
          <PasswordInput label="새 비밀번호" />
          <PasswordInput label="새 비밀번호 확인" />

          {/* Name & Company */}
          <InfoRow label="이름" buttonText="변경" />
          <InfoRow label="회사명" buttonText="변경" />

          {/* Verification Button */}
          <div className="flex items-center">
            <label className="w-32 text-gray-600">본인인증</label>
            <button className="bg-gray-200 px-4 py-2 rounded-lg">재인증</button>
          </div>
        </div>
      </div>
    </div>
  )
}
