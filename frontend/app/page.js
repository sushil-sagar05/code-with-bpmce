import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import RoadmapsPreview from '@/components/sections/RoadmapsPreview';
import AchievementsMarquee from '@/components/sections/AchievementsMarquee';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import EventsPreview from '@/components/sections/EventsPreview';
import CommunityCTA from '@/components/sections/CommunityCTA';

export const metadata = {
  title: 'CodeWithBPMCE — Code. Build. Innovate.',
  description:
    'The official coding club of BP Mandal College of Engineering, Madhepura. Join 500+ members building the future with Web Dev, DSA, AI/ML and more.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <RoadmapsPreview />
      <AchievementsMarquee />
      <ProjectsPreview />
      <EventsPreview />
      <CommunityCTA />
    </>
  );
}
