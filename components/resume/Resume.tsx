"use client"

import { forwardRef } from "react"
import type {
  ResumeData,
  ResumeSection,
  EducationItem,
  ExperienceItem,
  PublicationItem,
  SkillCategory,
  ProjectItem,
} from "@/types/resume"
import "@/styles/fonts/computer-modern.css"
import styles from "./Resume.module.css"

interface ResumeProps {
  data: ResumeData
}

const Resume = forwardRef<HTMLDivElement, ResumeProps>(({ data }, ref) => {
  const { contact, summary, sections } = data

  return (
    <div ref={ref} className={styles.resume}>
      {/* Header / Contact Info */}
      <header className={styles.header}>
        <h1 className={styles.name}>{contact.name}</h1>
        <div className={styles.contactInfo}>
          {[
            contact.phone,
            contact.email,
            contact.linkedin,
            contact.github,
            contact.website,
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i}>
                {item?.includes("@") ? (
                  <a href={`mailto:${item}`}>{item}</a>
                ) : item?.includes("linkedin") || item?.includes("github") || item?.includes("http") || item?.includes(".com") ? (
                  <a href={item?.startsWith("http") ? item : `https://${item}`} target="_blank" rel="noreferrer">
                    {item?.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  item
                )}
                {i < arr.length - 1 && <span className={styles.separator}>|</span>}
              </span>
            ))}
        </div>
      </header>

      {/* Sections */}
      {sections.map((section, idx) => (
        <section key={idx} className={styles.section}>
          {renderSection(section)}
        </section>
      ))}

      {/* Summary at the end if present */}
      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}
    </div>
  )
})

Resume.displayName = "Resume"

function renderSection(section: ResumeSection) {
  switch (section.type) {
    case "education":
      return (
        <>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {(section.items as EducationItem[]).map((item, i) => (
            <div key={i} className={styles.entry}>
              {/* Row 1: Institution | Location */}
              <div className={styles.entryHeader}>
                <span className={styles.institution}>{item.institution}</span>
                {item.location && <span className={styles.location}>{item.location}</span>}
              </div>
              {/* Row 2: Degree, GPA | Dates */}
              <div className={styles.entrySubheader}>
                <span className={styles.degree}>
                  {item.degree}
                  {item.gpa && `, GPA ${item.gpa}`}
                </span>
                <span className={styles.dates}>{item.dates}</span>
              </div>
              {/* Highlights as simple text (not bulleted for education) */}
              {item.highlights && item.highlights.length > 0 && (
                item.highlights.map((h, j) => (
                  <div key={j} className={styles.highlightBullet}>{h}</div>
                ))
              )}
            </div>
          ))}
        </>
      )

    case "experience":
      return (
        <>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {(section.items as ExperienceItem[]).map((item, i) => (
            <div key={i} className={styles.entry}>
              {/* Row 1: Title | Dates */}
              <div className={styles.entryHeader}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.dates}>{item.dates}</span>
              </div>
              {/* Row 2: Organization | Location */}
              <div className={styles.entrySubheader}>
                <span className={styles.organization}>{item.organization}</span>
                {item.location && <span className={styles.location}>{item.location}</span>}
              </div>
              {/* Bullets */}
              {item.bullets && item.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {item.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )

    case "publications":
      return (
        <>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <div className={styles.publicationsList}>
            {(section.items as PublicationItem[]).map((item, i) => (
              <div key={i} className={styles.publication}>
                <span className={styles.pubNumber}>[{i + 1}]</span>{" "}
                <span className={styles.authors}>{item.authors},</span>{" "}
                <span className={styles.pubTitle}>"{item.title},"</span>{" "}
                <span className={styles.venue}>{item.venue}</span>
                {item.award && <span className={styles.award}>. {item.award}</span>}
                {item.status && <span className={styles.status}>. {item.status}.</span>}
              </div>
            ))}
          </div>
        </>
      )

    case "skills":
      return (
        <>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <div className={styles.skills}>
            {(section.items as SkillCategory[]).map((cat, i, arr) => (
              <span key={i} className={styles.skillRow}>
                <span className={styles.skillCategory}>{cat.category}:</span>
                <span className={styles.skillList}>{cat.skills.join(", ")}</span>
                {i < arr.length - 1 && <span style={{ marginLeft: "12pt" }}></span>}
              </span>
            ))}
          </div>
        </>
      )

    case "projects":
      return (
        <>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {(section.items as ProjectItem[]).map((item, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.title}>{item.title}</span>
                {item.dates && <span className={styles.dates}>{item.dates}</span>}
              </div>
              {item.organization && (
                <div className={styles.entrySubheader}>
                  <span className={styles.organization}>{item.organization}</span>
                </div>
              )}
              <p className={styles.projectDescription}>{item.description}</p>
              {item.technologies && item.technologies.length > 0 && (
                <p className={styles.technologies}>
                  <strong>Technologies:</strong> {item.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </>
      )

    default:
      return null
  }
}

export default Resume
