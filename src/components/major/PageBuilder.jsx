//src/components/major/PageBuilder.jsx

import dynamic from "next/dynamic";

const HeroCenteredBg = dynamic(() => import("../sections/hero-sections/HeroCenteredBg"));
const HeroWithImage  = dynamic(() => import("../sections/hero-sections/HeroWithImage"));
const HeroBannerWithFeatures = dynamic(() => import("../sections/hero-sections/HeroBannerWithFeatures"));
const CenteredHero = dynamic(() => import("../sections/hero-sections/Centeredhero"));
const ContentMediaBlock = dynamic(() => import("../sections/content-sections/ContentMediaBlock"));
const ProductCategoriesSection = dynamic(() => import("../sections/content-sections/ProductCategoriesSection"));
const LatestBlogsSection = dynamic(() => import("../sections/content-sections/LatestBlogsSection"));
const LatestCaseStudiesSection = dynamic(() => import("../sections/content-sections/LatestCaseStudiesSection"));
const TeamSection = dynamic(() => import("../sections/content-sections/TeamSection"));
const InnerCaseStudy = dynamic(() => import("../sections/case-study/InnerCaseStudy"));
const HomeServicesSection = dynamic(() => import("../sections/content-sections/HomeServicesSection")); 
const HomeTankSection = dynamic(() => import("../sections/content-sections/HomeTankSection"));
const ServiceOverviewSection = dynamic(() => import("../sections/content-sections/service/ServiceOverviewSection"));
const ServiceProcessSection = dynamic(() => import("../sections/content-sections/service/ServiceProcessSection"));
const ServiceWhyChooseSection = dynamic(() => import("../sections/content-sections/service/ServiceWhyChooseSection"));
const ServiceMaintenanceGuideSection = dynamic(() => import("../sections/content-sections/service/ServiceMaintenanceGuideSection"));

export default function PageBuilder({
  sections = [],
  categoriesWithImages = [],
  posts = [],
  caseStudies = [],
  teams = [],
  language,
}) {
  if (!sections?.length) return null;

  return (
    <>
      {sections.map((block, i) => {
        switch (block.acf_fc_layout) {
          case "hero_centered_bg":
            return <HeroCenteredBg key={i} data={block} />;
          case "hero_with_image":
            return <HeroWithImage key={i} data={block} />; 
          case "homepage_banner_with_features":
            return <HeroBannerWithFeatures key={i} data={block} />;
          case "centered_hero":   
            return <CenteredHero key={i} data={block} />;  
          case "content_media_block":
            return <ContentMediaBlock key={i} data={block} />;
          case "home_product_categories":
            return (
              <ProductCategoriesSection
                key={i}
                data={block}
                categoriesWithImages={categoriesWithImages}
                language={language}
              />
            );
          case "latest_blogs":
            return <LatestBlogsSection key={i} data={block} posts={posts} />;
          case "latest_case_studies":
            return <LatestCaseStudiesSection key={i} data={block} caseStudies={caseStudies} />;
          case "team_section":
            return <TeamSection key={i} data={block} teams={teams} />;
          case "inner_case_studies":
            return <InnerCaseStudy key={i} data={block} caseStudies={caseStudies} />;
          case "home_services_section":
            return <HomeServicesSection key={i} data={block} />;
          case "homepage_tank_section":
            return <HomeTankSection key={i} data={block} />;
          case "service_overview_section":
            return <ServiceOverviewSection key={i} data={block} />;
          case "service_process_section":
            return <ServiceProcessSection key={i} data={block} />;
          case "service_why_choose_us_section":
            return <ServiceWhyChooseSection key={i} data={block} />;
          case "service_maintenance_guide_section":
            return <ServiceMaintenanceGuideSection key={i} data={block} />;

          default:
            return null;
        }
      })}
    </>
  );
}
