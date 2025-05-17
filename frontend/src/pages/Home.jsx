import Navbar from "../components/navbar/Navbar"
import HeroSection from "../components/heroSection/HeroSection"
import HowItWorks from "../components/howItWorks/HowItWorks"
import PopularCategories from "../components/popularCategories/PopularCategories"
export default function Home (){
  return (
    <>
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <PopularCategories />
    </>
  )
}
