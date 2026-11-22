"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar.js";
import Footer from "../../../components/Footer.js";
import collection from "../../../collection.config.js";
import { t } from "../../../data/translations.js";

export default function AboutPage() {
  const params = useParams();
  const language = params?.lang || "en";
  const text = t[language] || t.en;
  const isKh = language === "kh";

  return (
    <>
      <Navbar language={language} />

      <main
        className="container"
        style={{
          paddingTop: "60px",
          paddingBottom: "90px",
          minHeight: "calc(100vh - 300px)",
        }}
      >
        {/* Header Section */}
        <header
          style={{
            textAlign: "center",
            maxWidth: "780px",
            margin: "0 auto 3.5rem auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--gold-accent)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>{text.digitalHeritage}</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.85rem)",
              color: "var(--green-primary)",
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              lineHeight: isKh ? "1.5" : "1.2",
              marginBottom: "1.25rem",
            }}
          >
            {text.aboutTitle}
          </h1>

          <div
            style={{
              width: "56px",
              height: "3px",
              backgroundColor: "var(--gold-accent)",
              margin: "0 auto 1.5rem auto",
              borderRadius: "2px",
            }}
          />

          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              lineHeight: isKh ? "1.9" : "1.75",
            }}
          >
            {isKh
              ? collection.descriptionKm || collection.description
              : collection.description}
          </p>
        </header>

        {/* Metadata Identity Ribbon */}
        <section
          aria-label="Archive identity summary"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
            maxWidth: "1060px",
            margin: "0 auto 3.5rem auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1.35rem 1.6rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-cream-alt)",
                border: "1px solid var(--gold-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-accent)",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  marginBottom: "2px",
                }}
              >
                {text.curatedBy}
              </span>
              <strong
                style={{
                  fontSize: "0.98rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {isKh
                  ? collection.curatorKm || collection.curator
                  : collection.curator}
              </strong>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1.35rem 1.6rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-cream-alt)",
                border: "1px solid var(--gold-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-accent)",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  marginBottom: "2px",
                }}
              >
                {isKh ? "ប្រភពចំណេះដឹង" : "Knowledge Source"}
              </span>
              <strong
                style={{
                  fontSize: "0.98rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {isKh
                  ? collection.sourceKm || collection.source
                  : collection.source}
              </strong>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1.35rem 1.6rem",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-cream-alt)",
                border: "1px solid var(--gold-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-accent)",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  marginBottom: "2px",
                }}
              >
                {isKh ? "ដែនកំណត់អភិរក្ស" : "Preservation Scope"}
              </span>
              <strong
                style={{
                  fontSize: "0.98rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {text.preserved}
              </strong>
            </div>
          </div>
        </section>

        {/* Asymmetric 2-Column Content Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2rem",
            maxWidth: "1060px",
            margin: "0 auto",
          }}
        >
          {/* Left Column: Narrative & Mission */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* The Story */}
            <article
              style={{
                backgroundColor: "#ffffff",
                padding: "2.25rem 2.4rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.025)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-cream-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-accent)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h2
                  style={{
                    fontSize: "1.35rem",
                    color: "var(--green-primary)",
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                  }}
                >
                  {text.ourStory}
                </h2>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: isKh ? "2" : "1.8",
                  fontSize: "1rem",
                }}
              >
                {text.storyText}
              </p>
            </article>

            {/* Our Mission */}
            <article
              style={{
                backgroundColor: "#ffffff",
                padding: "2.25rem 2.4rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                borderLeft: "4px solid var(--green-primary)",
                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.025)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(67, 106, 13, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--green-primary)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <h2
                  style={{
                    fontSize: "1.35rem",
                    color: "var(--green-primary)",
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                  }}
                >
                  {text.ourMission}
                </h2>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: isKh ? "2" : "1.8",
                  fontSize: "1rem",
                }}
              >
                {text.missionText}
              </p>
            </article>
          </div>

          {/* Right Column: Curator & Callout */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Curator Details */}
            <article
              style={{
                backgroundColor: "#ffffff",
                padding: "2.25rem 2.4rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.025)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-cream-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold-accent)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h2
                  style={{
                    fontSize: "1.35rem",
                    color: "var(--green-primary)",
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                  }}
                >
                  {text.aboutMe}
                </h2>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: isKh ? "2" : "1.8",
                  fontSize: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {text.aboutMeText}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "20px",
                  backgroundColor: "var(--bg-cream-alt)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                <span>ICT 340 · Khmer Living Archive</span>
              </div>
            </article>

            {/* Explore & Engage Card */}
            <article
              style={{
                backgroundColor: "var(--bg-cream-alt)",
                padding: "2.25rem 2.4rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--gold-accent)",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  {isKh ? "ការចូលរួមចំណែក" : "Community & Archive"}
                </span>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--green-primary)",
                    fontFamily: "var(--font-serif)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {isKh
                    ? "ចូលរួមចំណែកក្នុងបណ្ណសារ"
                    : "Discover & Contribute"}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: isKh ? "1.8" : "1.65",
                    marginBottom: "1.75rem",
                  }}
                >
                  {isKh
                    ? "ស្វែងយល់បន្ថែមអំពីកេរដំណែលបង្អែមបុរាណ ឬចូលរួមចែករំលែករូបមន្តបង្អែមដែលអ្នកស្គាល់ដើម្បីជាប្រយោជន៍ដល់ក្មេងជំនាន់ក្រោយ។"
                    : "Explore the growing collection of traditional confections or submit a cherished heritage dessert recipe to help keep Cambodia's culinary arts alive."}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.85rem",
                  alignItems: "center",
                }}
              >
                <Link
                  href={`/${language}/archive`}
                  className="btn-capsule-dark"
                  style={{
                    textDecoration: "none",
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {text.exploreArchive}
                </Link>
                <Link
                  href={`/${language}/contribute`}
                  className="btn-ghost-gold"
                  style={{
                    textDecoration: "none",
                    padding: "0.75rem 1.1rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <span>{text.submitEntry}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </>
  );
}
