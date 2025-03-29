import Header from '@/components/main/Header'
import DescriptionBlock from '@/components/main/DescriptionBlock'
import FeatureBlock from '@/components/main/FeatureBlock'
import Footer from '@/components/main/Footer'

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
      {/* 상단 블록: 헤더 */}
      <Header />

      {/* 중간 블록: 설명 */}
      <section className="w-full max-w-4xl p-4">
        <DescriptionBlock />
      </section>

      {/* 중간 블록: 기능 소개 */}
      <section className="w-full max-w-4xl p-4">
        <FeatureBlock />
      </section>

      {/* 하단 블록: 푸터 */}
      <Footer />
    </main>
  )
}
