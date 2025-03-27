import Header from '@/components/main/Header'
import HeroSection from '@/components/main/HeroSection'
import DescriptionBlock from '@/components/main/DescriptionBlock'
import FeatureBlock from '@/components/main/FeatureBlock'
import Footer from '@/components/main/Footer'

export default function Home() {
  return (
    <div className="w-[1920px] bg-white">
      <Header />
      <HeroSection />
      <DescriptionBlock />
      <FeatureBlock />
      <Footer />
    </div>
  )
}
