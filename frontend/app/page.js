import HeroSection from '@/components/sections/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import RoadmapsPreview from '@/components/sections/RoadmapsPreview';
import AchievementsMarquee from '@/components/sections/AchievementsMarquee';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import EventsPreview from '@/components/sections/EventsPreview';
import CommunityCTA from '@/components/sections/CommunityCTA';

export const metadata = {
  title: 'DevBuddies (CodeWithBPMCE) — Bihar\'s Premier Engineering Student Tech Community',
  description:
    'DevBuddies is the top student coding community & roadmap platform of BP Mandal College of Engineering (BPMCE), Madhepura. Learn coding, access resources, and follow AKU/BEU syllabus engineering roadmaps in Bihar.',
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
