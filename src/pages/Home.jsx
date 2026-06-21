import HeroSection from "../components/home/HeroSection";
import IntroStrip from "../components/home/IntroStrip";
import AboutSection from "../components/home/AboutSection";
import EventsSection from "../components/home/EventsSection";
import VolunteerSection from "../components/home/VolunteerSection";
import ActionPlanSection from "../components/home/ActionPlanSection";
import GallerySection from "../components/home/GallerySection";
import NewsletterSection from "../components/home/NewsletterSection";
import SupportSection from "../components/home/SupportSection";
import PartnersSection from "../components/home/PartnersSection";
import UsefulInfoSection from "../components/home/UsefulInfoSection";
import FeaturedNewsSection from "../components/home/FeaturedNewsSection";
import SEO from "../components/seo/SEO";

export default function Home() {
  return (
    <>
  <SEO
  description="Beeston Hill Community Association supports residents through community events, volunteering opportunities, local news, neighbourhood projects and practical support across Beeston Hill, Leeds."
/>
      <HeroSection />
      <IntroStrip />
      <AboutSection />
      <EventsSection />
      <VolunteerSection />
      <FeaturedNewsSection />
      <ActionPlanSection />
      <GallerySection />
      <UsefulInfoSection/>
      <SupportSection />
      <NewsletterSection />
      <PartnersSection />
    </>
  );
}
