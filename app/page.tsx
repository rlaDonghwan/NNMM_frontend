import Header from '@/components/main/Header'
import DescriptionBlock from '@/components/main/DescriptionBlock'
import FeatureBlock from '@/components/main/FeatureBlock'
import Footer from '@/components/main/Footer'

export default function Home() {
  return (
    <main className="w-full mx-auto bg-white overflow-hidden">
      <Header />
      <DescriptionBlock />
      <FeatureBlock />
      <Footer />
    </main>
  )
}
