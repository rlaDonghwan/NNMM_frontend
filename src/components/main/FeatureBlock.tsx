export default function FeatureBlock() {
  return (
    <>
      <div className="self-stretch h-[700px] px-20 py-12 bg-slate-100 inline-flex justify-center items-center gap-40 overflow-hidden">
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-5">
          <div className="inline-flex justify-start items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                className="w-16 h-16 absolute top-[-10px]"
                src="/main/barChart.png"
                alt="chartIcon"
              />
            </div>
            <div className="w-[606px] h-20 text-indigo-700 text-6xl font-normal font-['AppleSDGothicNeoB00']">
              맞춤형 대시보드 디자인
            </div>
          </div>
          <div className="h-36 text-black text-4xl font-normal font-['AppleSDGothicNeoB00']">
            보유한 데이터를 기반으로 자신만의 ESG 지표를 자유롭게 설정하고, 우리 기업만의
            대시보드를 구축할 수 있습니다.
          </div>
        </div>
        <div className="w-[747px] h-[553px] bg-zinc-300"></div>
      </div>
      <div className="self-stretch h-[700px] px-20 py-12 bg-white inline-flex justify-center items-center gap-40 overflow-hidden">
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-5">
          <div className="inline-flex justify-start items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                className="w-16 h-16 absolute top-0"
                src="/main/uploadIcon.png"
                alt="uploadIcon"
              />
            </div>
            <div className="w-[606px] h-20 text-indigo-700 text-6xl font-normal font-['AppleSDGothicNeoB00']">
              간편한 데이터 업로드
            </div>
          </div>
          <div className="h-36 text-black text-4xl font-normal font-['AppleSDGothicNeoB00']">
            다양한 형식의 데이터를 쉽게 업로드하고 분석에 활용할 수 있습니다.
          </div>
        </div>
        <div className="w-[747px] h-[553px] bg-zinc-300"></div>
      </div>
      <div className="self-stretch h-[700px] px-20 py-12 bg-slate-100 inline-flex justify-center items-center gap-40 overflow-hidden">
        <div className="flex-1 inline-flex flex-col justify-center items-start gap-5">
          <div className="inline-flex justify-start items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                className="w-16 h-16 absolute top-0"
                src="/main/lightBulb.png"
                alt="analyzeIcon"
              />
            </div>
            <div className="w-[606px] h-20 text-indigo-700 text-6xl font-normal font-['AppleSDGothicNeoB00']">
              직관적인 분석 도구
            </div>
          </div>
          <div className="h-36 text-black text-4xl font-normal font-['AppleSDGothicNeoB00']">
            복잡한 데이터도 시각적으로 깔끔하게 정리하여 분석 결과를 쉽게 이해할 수
            있습니다.
          </div>
        </div>
        <div className="w-[747px] h-[553px] bg-zinc-300"></div>
      </div>
    </>
  )
}
