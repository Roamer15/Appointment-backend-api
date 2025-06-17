import Navbar from "../components/navbar/Navbar"
import HeroSection from "../components/homeComponents/heroSection/HeroSection/HeroSection"
import HowItWorks from "../components/homeComponents/heroSection/howItWorks/HowItWorks"
import PopularCategories from "../components/homeComponents/heroSection/popularCategories/PopularCategories"
import FinalCTA from "../components/homeComponents/heroSection/finalCTA/FinalCTA"
import Footer from "../components/footer/Footer"

export default function Home (){
  return (
    <>
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <PopularCategories />
    <FinalCTA />
    <Footer />
    </>
  )
}
