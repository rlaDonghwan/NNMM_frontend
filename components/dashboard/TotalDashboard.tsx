export default function TotalDashboard() {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="grid grid-cols-3 h-full gap-4">
        <div className="bg-blue-100 p-6 rounded-xl shadow">첫 번째 칸</div>
        <div className="bg-green-100 p-6 rounded-xl shadow">두 번째 칸</div>
        <div className="bg-yellow-100 p-6 rounded-xl shadow">세 번째 칸</div>
        <div className="bg-red-100 p-6 rounded-xl shadow">네 번째 칸</div>
        <div className="bg-purple-100 p-6 rounded-xl shadow">다섯 번째 칸</div>
        <div className="bg-pink-100 p-6 rounded-xl shadow">여섯 번째 칸</div>
      </div>
      <div></div>
    </div>
  )
}
