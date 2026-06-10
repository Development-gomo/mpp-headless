"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DEPARTMENT_LABELS = {
  management: "Management",
  finance: "Finance",
  purchasing: "Purchasing",
  "design-engineering": "Design & Engineering",
  "operations-production-support": "Operations & Production Support",
  "technical-support": "Technical Support",
  sales: "Sales",
};

const DEPARTMENT_VALUES = Object.entries(DEPARTMENT_LABELS).reduce(
  (acc, [value, label]) => ({
    ...acc,
    [label.toLowerCase()]: value,
  }),
  {}
);

function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function normalizeDepartmentKey(value = "") {
  const normalized = String(value).trim();
  const lower = normalized.toLowerCase();

  return DEPARTMENT_VALUES[lower] || lower.replace(/&/g, "and").replace(/\s+/g, "-");
}

function normalizeList(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];

  return list
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.value || item?.slug || item?.name || item?.label || "";
    })
    .map(normalizeDepartmentKey)
    .filter(Boolean);
}

function getSelectedDepartments(data = {}) {
  return normalizeList(
    data.selected_core_departments ||
      data.select_core_departments ||
      data.core_departments ||
      data.departments ||
      data.department_filter
  );
}

function getImageUrl(item) {
  return (
    item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    item?.featured_image ||
    item?.featured_image_url ||
    ""
  );
}

function getButtonHref(button = {}) {
  if (typeof button.button_link === "string") return button.button_link;
  return button.button_link?.url || button.link?.url || "#";
}

function getButtonLabel(button = {}) {
  return button.button_label || button.button_link?.title || button.link?.title || "";
}

function getDepartmentOptions(teams = [], allowedDepartments = []) {
  const foundDepartments = new Set();

  teams.forEach((member) => {
    normalizeList(member?.acf?.core_departments).forEach((department) => {
      foundDepartments.add(department);
    });
  });

  const source =
    allowedDepartments.length > 0
      ? allowedDepartments
      : Object.keys(DEPARTMENT_LABELS);

  return source
    .filter((department) => DEPARTMENT_LABELS[department])
    .map((department) => ({
      value: department,
      label: DEPARTMENT_LABELS[department],
      hasMembers: foundDepartments.has(department),
    }));
}

function hasDepartmentData(teams = []) {
  return teams.some(
    (member) => normalizeList(member?.acf?.core_departments).length > 0
  );
}

function TeamCard({ member }) {
  const acf = member?.acf || {};
  const title = member?.title?.rendered || member?.title || "";
  const image = getImageUrl(member);
  const position = acf?.position || "";
  const email = acf?.email || "";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-black/10 bg-white p-4 shadow-[0_8px_28px_rgba(7,24,56,0.04)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[1/1.05] overflow-hidden rounded-[8px] bg-[#EAF1FA]">
        {image && (
          <Image
            src={image}
            alt={stripHtml(title) || "Team member"}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            aria-label={`Email ${stripHtml(title) || "team member"}`}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-[var(--color-accent)]"
          >
            <Image
              src="/email.svg"
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] brightness-0 invert"
            />
          </a>
        )}
      </div>

      <div className="flex min-h-[96px] flex-1 flex-col items-start px-1 pb-1 pt-5 text-left">
        {title && (
          <h3
            className="text-[24px] font-medium capitalize leading-[30px] tracking-[-0.48px] text-black [font-family:var(--font-heading)]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {position && (
          <p className="mt-2 text-[13px] font-normal uppercase leading-[20px] tracking-[0.52px] text-[var(--color-accent)] [font-family:var(--font-nunito-sans)]">
            {position}
          </p>
        )}
      </div>
    </article>
  );
}

export default function TeamSection({ data, teams = [] }) {
  const [activeDepartment, setActiveDepartment] = useState("all");
  const sectionData = data || {};

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    background_color,
    custom_class,
    custom_id,
  } = sectionData;

  const selectedDepartments = getSelectedDepartments(sectionData);
  const departmentOptions = useMemo(
    () => getDepartmentOptions(teams, selectedDepartments),
    [teams, selectedDepartments]
  );

  const allowedSet = useMemo(
    () => new Set(departmentOptions.map((department) => department.value)),
    [departmentOptions]
  );
  const canFilterByDepartment = useMemo(() => hasDepartmentData(teams), [teams]);

  const filteredTeams = useMemo(
    () => {
      if (!canFilterByDepartment) return teams;

      return teams.filter((member) => {
        const memberDepartments = normalizeList(member?.acf?.core_departments);

        if (
          allowedSet.size > 0 &&
          !memberDepartments.some((department) => allowedSet.has(department))
        ) {
          return false;
        }

        if (activeDepartment === "all") return true;

        return memberDepartments.includes(activeDepartment);
      });
    },
    [activeDepartment, allowedSet, canFilterByDepartment, teams]
  );

  return (
    <section
      id={custom_id || undefined}
      className={`relative bg-[#F1F1F3] ${custom_class || ""}`}
      style={background_color ? { backgroundColor: background_color } : {}}
    >
      <div className="web-width px-6 py-20 md:py-[110px]">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-20">
          <div>
            {text_above_title && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-[16px] w-[2px] bg-[var(--color-yellow)]" />
                <p className="text-[14px] font-medium uppercase leading-6 tracking-[0.56px] text-[#1A1A1A] font-body">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="max-w-[620px] text-[42px] font-normal leading-[48px] tracking-[-1.04px] text-black font-heading md:text-[52px] md:leading-[60px]"
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

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {button_row?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {button_row.map((btn, i) => {
                const label = getButtonLabel(btn);
                if (!label) return null;

                return (
                  <Link
                    key={i}
                    href={getButtonHref(btn)}
                    target={btn.button_target || btn.button_link?.target || undefined}
                    className="group inline-flex items-center gap-4 rounded-sm bg-[image:var(--mpp-gradient)] py-1.5 pr-1.5 pl-6 text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90 font-heading"
                  >
                    <span>{label}</span>
                    <Image
                      src="/black-white-arrow.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-[40px] object-contain transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          {departmentOptions.length > 0 && (
            <label className="relative w-full md:ml-auto md:w-[310px]">
              <span className="sr-only">Filter team by department</span>
              <select
                value={activeDepartment}
                onChange={(event) => setActiveDepartment(event.target.value)}
                className="h-[52px] w-full appearance-none rounded-sm border border-black/15 bg-white px-5 pr-12 text-[15px] font-medium leading-6 text-[#1A1A1A] outline-none transition-colors focus:border-[var(--color-accent)] [font-family:var(--font-nunito-sans)]"
              >
                <option value="all">All departments</option>
                {departmentOptions.map((department) => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[16px] leading-none text-[var(--color-accent)]">
                v
              </span>
            </label>
          )}
        </div>

        {filteredTeams.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTeams.map((member, index) => (
              <TeamCard key={member?.id || index} member={member} />
            ))}
          </div>
        )}

        {filteredTeams.length === 0 && (
          <div className="rounded-sm bg-white px-6 py-10 text-[16px] leading-6 text-[#1A1A1A] [font-family:var(--font-nunito-sans)]">
            No team members found for this department.
          </div>
        )}
      </div>
    </section>
  );
}
