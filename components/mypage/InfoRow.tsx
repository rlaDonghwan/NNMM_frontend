const InfoRow = ({label, buttonText}: {label: string; buttonText: string}) => {
  return (
    <div className="flex items-center">
      <label className="w-32 text-gray-600">{label}</label>
      <input type="text" className="flex-1 bg-gray-100 rounded-lg px-4 py-2" />
      <button className="ml-4 bg-gray-200 px-4 py-2 rounded-lg">{buttonText}</button>
    </div>
  )
}

export default InfoRow
