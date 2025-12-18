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
            contact.location,
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i}>
                {item?.includes("@") ? (
                  <a href={`mailto:${item}`}>{item}</a>
                ) : item?.includes("linkedin") || item?.includes("github") ? (
                  <a href={item?.startsWith("http") ? item : `https://${item}`} target="_blank" rel="noreferrer">
                    {item}
                  </a>
                ) : (
                  item
                )}
                {i < arr.length - 1 && <span className={styles.separator}> | </span>}
              </span>
            ))}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {/* Sections */}
      {sections.map((section, idx) => (
        <section key={idx} className={styles.section}>
          {renderSection(section)}
        </section>
      ))}
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
              <div className={styles.entryHeader}>
                <div className={styles.entryLeft}>
                  <span className={styles.institution}>{item.institution}</span>
                  {item.location && <span className={styles.location}>{item.location}</span>}
                </div>
                <span className={styles.dates}>{item.dates}</span>
              </div>
              <div className={styles.entrySubheader}>
                <span className={styles.degree}>{item.degree}</span>
                {item.gpa && <span className={styles.gpa}>GPA: {item.gpa}</span>}
              </div>
              {item.highlights && item.highlights.length > 0 && (
                <ul className={styles.bullets}>
                  {item.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
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
              <div className={styles.entryHeader}>
                <div className={styles.entryLeft}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.organization}>{item.organization}</span>
                </div>
                <div className={styles.entryRight}>
                  <span className={styles.dates}>{item.dates}</span>
                  {item.location && <span className={styles.location}>{item.location}</span>}
                </div>
              </div>
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
          {(section.items as PublicationItem[]).map((item, i) => (
            <div key={i} className={styles.publication}>
              <span className={styles.authors}>{item.authors}</span>
              <span className={styles.pubTitle}>"{item.title},"</span>
              <span className={styles.venue}>{item.venue}</span>
              {item.status && <span className={styles.status}>({item.status})</span>}
              {item.award && <span className={styles.award}>{item.award}</span>}
            </div>
          ))}
        </>
      )

    case "skills":
      return (
        <>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <div className={styles.skills}>
            {(section.items as SkillCategory[]).map((cat, i) => (
              <div key={i} className={styles.skillRow}>
                <span className={styles.skillCategory}>{cat.category}:</span>
                <span className={styles.skillList}>{cat.skills.join(", ")}</span>
              </div>
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
                <div className={styles.entryLeft}>
                  <span className={styles.title}>{item.title}</span>
                  {item.organization && <span className={styles.organization}>{item.organization}</span>}
                </div>
                {item.dates && <span className={styles.dates}>{item.dates}</span>}
              </div>
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
