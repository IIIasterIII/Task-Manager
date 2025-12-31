"use client"

import Footer from "./components/ui/footer";
import GoalsSection from "./components/ui/goalsSection";
import InfoSection from "./components/ui/infoSection";
import MainSection from "./components/ui/mainSection";
import Navbar from "./components/ui/navbar";
import SecondSection from "./components/ui/secondSection";
import "./style.css"

export default function Home() {
  return (
    <div className="relative flex flex-col items-center">
      <Navbar/>
      <MainSection/>
      <SecondSection/>
      <InfoSection/>
      <GoalsSection/>
      <Footer/>
    </div>
  );
}
