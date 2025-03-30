import Header from '@/components/main/Header'
import DescriptionBlock from '@/components/main/DescriptionBlock'
import FeatureBlock from '@/components/main/FeatureBlock'
import Footer from '@/components/main/Footer'

// 메인 페이지
export default function MainPage() {
  return (
    <main>
      <Header />
      <DescriptionBlock />
      <FeatureBlock />
      <Footer />
    </main>
  )
}
