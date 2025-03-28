const ProfileImage = () => {
  return (
    <div className="relative">
      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">이미지</span>
      </div>
      <button className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1">
        ✏️
      </button>
    </div>
  )
}

export default ProfileImage
