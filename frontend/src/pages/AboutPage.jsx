import Navbar from "../components/navbar/Navbar";
import OurStory from "../components/about/ourStory/OurStory";
import Timeline from "../components/about/timeline/Timeline";
import MissionValues from "../components/about/missionValues/MissionValues";
import Team from "../components/about/team/Team";
import Stats from "../components/about/stats/Stats";
import CTA from "../components/about/cta/CTA";
import Footer from "../components/footer/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <OurStory />
      <Timeline />
      <MissionValues />
      <Team />
      <Stats />
      <CTA />
      <Footer />
    </>
  );
}
