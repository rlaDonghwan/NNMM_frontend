export default function FeatureBlock() {
  return (
    <>
      <div className="w-full px-6 py-12 bg-slate-100 flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
        <div className="flex-1 flex flex-col justify-center items-start gap-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                className="w-16 h-16 absolute -top-2 object-contain"
                src="/main/barChart.png"
                alt="chartIcon"
              />
            </div>
            <div className="text-indigo-700 text-3xl sm:text-4xl lg:text-5xl font-bold font-apple">
              맞춤형 대시보드 디자인
            </div>
          </div>
          <div className="text-black text-xl sm:text-2xl lg:text-3xl font-normal font-apple">
            보유한 데이터를 기반으로 자신만의 ESG 지표를 자유롭게 설정하고, 우리 기업만의
            대시보드를 구축할 수 있습니다.
          </div>
        </div>
        <img
          src="/images/dash.png"
          className="w-full max-w-2xl h-[300px] rounded-lg shadow-md"></img>
      </div>

      <div className="w-full px-6 py-12 bg-white flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
        <div className="flex-1 flex flex-col justify-center items-start gap-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                className="w-16 h-16 absolute top-0 object-contain"
                src="/main/uploadIcon.png"
                alt="uploadIcon"
              />
            </div>
            <div className="text-indigo-700 text-3xl sm:text-4xl lg:text-5xl font-bold font-apple">
              간편한 데이터 업로드
            </div>
          </div>
          <div className="text-black text-xl sm:text-2xl lg:text-3xl font-normal font-apple">
            다양한 형식의 데이터를 쉽게 업로드하고 분석에 활용할 수 있습니다.
          </div>
        </div>
        <img
          src="/images/dash.png"
          className="w-full max-w-2xl h-[300px] rounded-lg shadow-md"></img>
      </div>

      <div className="w-full px-6 py-12 bg-slate-100 flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
        <div className="flex-1 flex flex-col justify-center items-start gap-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                className="w-16 h-16 absolute top-0 object-contain"
                src="/main/lightBulb.png"
                alt="analyzeIcon"
              />
            </div>
            <div className="text-indigo-700 text-3xl sm:text-4xl lg:text-5xl font-bold font-apple">
              직관적인 분석 도구
            </div>
          </div>
          <div className="text-black text-xl sm:text-2xl lg:text-3xl font-normal font-apple">
            복잡한 데이터도 시각적으로 깔끔하게 정리하여 분석 결과를 쉽게 이해할 수
            있습니다.
          </div>
        </div>
        <img
          src="/images/dash.png"
          className="w-full max-w-2xl h-[300px] rounded-lg shadow-md"></img>
      </div>
    </>
  )
}
