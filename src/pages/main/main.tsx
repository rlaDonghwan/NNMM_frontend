import Header from '@/components/main/Header'
import DescriptionBlock from '@/components/main/DescriptionBlock'
import FeatureBlock from '@/components/main/FeatureBlock'
import Footer from '@/components/main/Footer'

export default function Home() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto bg-white overflow-hidden">
      <Header />

      <DescriptionBlock />
      <FeatureBlock />
      <Footer />
    </div>
  )
}
