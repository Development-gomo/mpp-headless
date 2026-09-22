import Image from "next/image";
import {
  DEPARTMENT_LABELS,
  DEPARTMENT_ORDER,
  stripHtml,
  normalizeList,
  getImageUrl,
  getTranslation,
} from "./team-utils";

// Outer grid is 4 columns on desktop; a department block spans as many
// columns as it has members (capped at 4), matching mpp.se/medarbetare.
const SPAN_CLASSES = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

const INNER_COLS_CLASSES = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function groupByDepartment(teams = [], language) {
  const translations = getTranslation(language);
  const labels = translations.departments || DEPARTMENT_LABELS;
  const groups = new Map();

  teams.forEach((member) => {
    const departments = normalizeList(member?.acf?.core_departments);
    const keys = departments.length ? departments : ["other"];

    keys.forEach((key) => {
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(member);
    });
  });

  const orderedKeys = [
    ...DEPARTMENT_ORDER.filter((key) => groups.has(key)),
    ...Array.from(groups.keys()).filter((key) => !DEPARTMENT_ORDER.includes(key)),
  ];

  return orderedKeys.map((key) => ({
    key,
    label: labels[key] || DEPARTMENT_LABELS[key] || key,
    members: groups.get(key),
  }));
}

function DepartmentHeading({ label }) {
  return (
    <div className="mb-8 flex items-center gap-5">
      <span className="h-px flex-1 bg-black/10" />
      <h3 className="whitespace-nowrap text-[13px] font-semibold uppercase leading-6 tracking-[3.6px] text-[#585858] [font-family:var(--font-nunito-sans)]">
        {label}
      </h3>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

function EmployeeCard({ member }) {
  const acf = member?.acf || {};
  const title = member?.title?.rendered || member?.title || "";
  const image = getImageUrl(member);
  const position = acf?.position || "";
  const email = acf?.email || "";

  return (
    <article className="relative rounded-[32px] bg-white px-8 pb-8 pt-5 shadow-[0_8px_28px_rgba(7,24,56,0.05)] sm:px-10 sm:pb-10">
      <div className="mb-4 flex justify-end">
        <div className="relative -mt-[51px] h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full bg-[#EAF1FA] ring-4 ring-white">
          {image && (
            <Image
              src={image}
              alt={stripHtml(title) || "Team member"}
              fill
              sizes="100px"
              className="object-cover"
            />
          )}
        </div>
      </div>

      {title && (
        <h4
          className="text-[24px] font-medium capitalize leading-[30px] tracking-[-0.48px] text-black [font-family:var(--font-heading)]"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}

      {position && (
        <p className="mt-2 text-[16px] font-normal leading-[22px] text-[var(--color-accent)] [font-family:var(--font-nunito-sans)]">
          {position}
        </p>
      )}

      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-6 inline-flex items-center rounded-full bg-[var(--color-yellow)] px-[30px] py-4 text-[15px] font-normal leading-none text-white transition-opacity hover:opacity-90 [font-family:var(--font-nunito-sans)]"
        >
          {email}
        </a>
      )}
    </article>
  );
}

function DepartmentGroup({ group }) {
  const span = Math.min(group.members.length, 4);

  return (
    <div className={`col-span-1 sm:col-span-2 ${SPAN_CLASSES[span]}`}>
      <DepartmentHeading label={group.label} />
      <div className={`grid grid-cols-1 gap-6 ${INNER_COLS_CLASSES[span]}`}>
        {group.members.map((member, index) => (
          <EmployeeCard key={member?.id || index} member={member} />
        ))}
      </div>
    </div>
  );
}

export default function TeamGroupedSection({ data, teams = [], language }) {
  const sectionData = data || {};
  const {
    text_above_title,
    hero_title,
    hero_description,
    background_color,
    custom_class,
    custom_id,
  } = sectionData;

  const groups = groupByDepartment(teams, language).filter(
    (group) => group.members?.length
  );

  return (
    <section
      id={custom_id || undefined}
      className={`relative ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="web-width px-6 md:px-0 py-20 md:py-[110px]">
        {(text_above_title || hero_title || hero_description) && (
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
            <div>
              {text_above_title && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
                  <p className="text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A] font-body">
                    {text_above_title}
                  </p>
                </div>
              )}

              {hero_title && (
                <h2
                  className="max-w-155 text-[42px] font-normal leading-12 tracking-[-1.04px] text-black font-heading md:text-[48px] md:leading-14.5"
                  dangerouslySetInnerHTML={{ __html: hero_title }}
                />
              )}
            </div>

            <div className="flex flex-col items-start lg:pt-[54px]">
              {hero_description && (
                <div
                  className="max-w-[628px] text-[16px] font-normal leading-6 text-[#1A1A1A] font-body"
                  dangerouslySetInnerHTML={{ __html: hero_description }}
                />
              )}
            </div>
          </div>
        )}

        {groups.length > 0 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <DepartmentGroup key={group.key} group={group} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
