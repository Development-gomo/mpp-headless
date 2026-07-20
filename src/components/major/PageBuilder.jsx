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
const HistorySection = dynamic(() => import("../sections/content-sections/HistorySection"));
const PartnerReviewSection = dynamic(() => import("../sections/content-sections/PartnerReviewSection"));
const InnerCaseStudy = dynamic(() => import("../sections/case-study/InnerCaseStudy"));
const InnerIndustry = dynamic(() => import("../sections/industry/InnerIndustry"));
const HomeServicesSection = dynamic(() => import("../sections/content-sections/HomeServicesSection")); 
const HomeFaqSection = dynamic(() => import("../sections/content-sections/HomeFaqSection"));
const HomeTankSection = dynamic(() => import("../sections/content-sections/HomeTankSection"));
const HomeExpertAdviceSection = dynamic(() => import("../sections/content-sections/HomeExpertAdviceSection"));
const ServiceOverviewSection = dynamic(() => import("../sections/content-sections/service/ServiceOverviewSection"));
const ServiceProcessSection = dynamic(() => import("../sections/content-sections/service/ServiceProcessSection"));
const ServiceWhyChooseSection = dynamic(() => import("../sections/content-sections/service/ServiceWhyChooseSection"));
const ServiceMaintenanceGuideSection = dynamic(() => import("../sections/content-sections/service/ServiceMaintenanceGuideSection"));
const FindRetailerSection = dynamic(() => import("../sections/content-sections/FindRetailerSection"));
const FullWidthContentSection = dynamic(() => import("../sections/content-sections/FullWidthContentSection"));
const ContactFormSection = dynamic(() => import("../sections/content-sections/ContactFormSection"));
const ProductSection = dynamic(() => import("../sections/content-sections/ProductSection"));
const ServicesSection = dynamic(() => import("../sections/content-sections/ServicesSection"));
const CatalogSection = dynamic(() => import("../sections/catalog/CatalogSection"));

export default function PageBuilder({
  sections = [],
  categoriesWithImages = [],
  posts = [],
  caseStudies = [],
  industries = [],
  teams = [],
  stores = [],
  themeOptions = {},
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
            return (
              <LatestBlogsSection
                key={i}
                data={block}
                posts={posts}
                language={language}
              />
            );
          case "latest_case_studies":
            return (
              <LatestCaseStudiesSection
                key={i}
                data={block}
                caseStudies={caseStudies}
                language={language}
              />
            );
          case "team_section":
            return (
              <TeamSection
                key={i}
                data={block}
                teams={teams}
                language={language}
              />
            );
          case "history_section":
            return <HistorySection key={i} data={block} />;
          case "partner_logo":
            return <PartnerReviewSection key={i} data={block} themeOptions={themeOptions} />;
          case "inner_case_studies":
            return (
              <InnerCaseStudy
                key={i}
                data={block}
                caseStudies={caseStudies}
                language={language}
              />
            );
          case "inner_industry":
          case "inner_industries":
          case "industry_listing":
            return (
              <InnerIndustry
                key={i}
                data={block}
                industries={industries}
                language={language}
              />
            );
          case "home_services_section":
            return <HomeServicesSection key={i} data={block} />;
          case "home_faq_section":
            return <HomeFaqSection key={i} data={block} />;
          case "homepage_tank_section":
            return <HomeTankSection key={i} data={block} />;
          case "home_expert_advice_section":
            return <HomeExpertAdviceSection key={i} data={block} />;
          case "service_overview_section":
            return <ServiceOverviewSection key={i} data={block} language={language} />;
          case "service_process_section":
            return <ServiceProcessSection key={i} data={block} />;
          case "service_why_choose_us_section":
            return <ServiceWhyChooseSection key={i} data={block} />;
          case "service_maintenance_guide_section":
            return (
              <ServiceMaintenanceGuideSection
                key={i}
                data={block}
                language={language}
              />
            );
          case "find_retailer_section":
            return (
              <FindRetailerSection
                key={i}
                data={block}
                stores={stores}
                language={language}
              />
            );
          // Keep the misspelled live ACF layout slug until it is corrected in WordPress.
          case "full_with_content_section":
          case "full_width_content_section":
            return <FullWidthContentSection key={i} data={block} />;
          case "contact_section":
            return <ContactFormSection key={i} data={block} language={language} />;
          case "product_section":
            return <ProductSection key={i} data={block} language={language} />;
          case "services_section":
            return <ServicesSection key={i} data={block} language={language} />;
          case "catalog":
          case "catalog_section":
            return <CatalogSection key={i} data={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
