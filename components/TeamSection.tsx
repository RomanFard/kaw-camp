"use client";

import { useEffect, useRef } from "react";

type TeamMember = {
  name: string;
  role: string;
  subtitle: string;
  image: string;
  socials: {
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
  };
};

const TEAM: TeamMember[] = [
  {
    name: "Mohamad Khanzadeh",
    role: "Founder & CEO",
    subtitle: "Owner of KAW CAMP",
    image: "/images/team/owner.jpg",
    socials: {
      instagram: "https://www.instagram.com/kawcamp",
      whatsapp: "https://wa.me/message/MCT6GUT5QAVCE1",
      telegram: "https://t.me/kawcamp",
    },
  },
  {
    name: "Roman Fard",
    role: "Web Designer & Developer",
    subtitle: "Site Designer",
    image: "/images/team/designer.jpg",
    socials: {
      instagram: "https://www.instagram.com/kawcamp",
      telegram: "https://t.me/kawcamp",
    },
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // انیمیشن اسکرول
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll(".team-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(items).indexOf(entry.target as Element);
            (entry.target as HTMLElement).style.transitionDelay = `${idx * 0.15}s`;
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24">
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-[11px] font-bold tracking-[0.2em] text-accent md:text-xs">
              EXPERTS
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            <span className="text-theme">MEET </span>
            <span className="text-accent">THE TEAM</span>
          </h2>

          <div className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-accent" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="team-card group relative overflow-hidden rounded-2xl border border-theme bg-theme-card p-6 text-center transition-all duration-300 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/10 md:p-8"
              style={{
                opacity: 0,
                transform: "translateY(30px)",
                transition:
                  "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, box-shadow 0.3s",
              }}
            >
              {/* Avatar */}
              <div className="relative mx-auto mb-5 h-32 w-32 md:h-40 md:w-40">
                {/* حلقه درخشان */}
                <div
                  className="absolute inset-0 rounded-full opacity-60 transition duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />

                {/* قاب دایره */}
                <div
                  className="relative h-full w-full overflow-hidden rounded-full border-[3px]"
                  style={{
                    borderColor: "var(--accent)",
                    boxShadow: `0 0 30px color-mix(in srgb, var(--accent) 40%, transparent)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".fallback-avatar")) {
                        const wrapper = document.createElement("div");
                        wrapper.className =
                          "fallback-avatar absolute inset-0 flex items-center justify-center bg-accent text-5xl font-black text-white";
                        wrapper.innerHTML = member.name.charAt(0);
                        parent.appendChild(wrapper);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Info */}
              <h3 className="mb-2 text-lg font-black text-theme md:text-xl">
                {member.name}
              </h3>

              <p className="mb-1 text-sm font-bold text-accent md:text-base">
                {member.role}
              </p>

              <p className="mb-6 text-xs text-theme-muted md:text-sm">
                {member.subtitle}
              </p>

              {/* خط جداکننده */}
              <div className="relative mx-auto mb-6 h-[2px] w-full max-w-[280px] bg-theme-surface">
                <div
                  className="absolute right-0 top-0 h-full w-1/3"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <div
                  className="absolute right-1/3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                  style={{
                    backgroundColor: "var(--accent)",
                    boxShadow: `0 0 8px var(--accent)`,
                  }}
                />
              </div>

              {/* Socials */}
              <div className="flex items-center justify-center gap-4">
                {member.socials.instagram && (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-theme text-theme-muted transition hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}

                {member.socials.whatsapp && (
                  <a
                    href={member.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-theme text-theme-muted transition hover:border-green-500 hover:bg-green-600 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                )}

                {member.socials.telegram && (
                  <a
                    href={member.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-theme text-theme-muted transition hover:border-sky-500 hover:bg-sky-500 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .team-card.in-view {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}