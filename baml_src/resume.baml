// BAML file for generating dynamic resumes based on conversation context
// Prompt content is stored in MongoDB and assembled by the API route

class EducationItem {
  institution string @description("University or institution name")
  location string? @description("City, State or Country")
  degree string @description("Degree and major, optionally with GPA")
  dates string @description("Date range (e.g., 'Aug. 2020 - May 2024')")
  gpa string? @description("GPA if notable")
  highlights string[]? @description("Notable achievements, honors, relevant coursework")
}

class ExperienceItem {
  title string @description("Job title or role")
  dates string @description("Date range (e.g., 'Jun. 2024 - Present')")
  organization string @description("Company or organization name")
  location string? @description("City, State or Remote")
  bullets string[] @description("2-5 bullet points describing achievements and responsibilities. Use action verbs and quantify results when possible.")
}

class PublicationItem {
  authors string @description("Author list (e.g., 'A. Flores et al.')")
  title string @description("Publication title")
  venue string @description("Conference or journal name with year")
  status string? @description("'Published', 'Accepted', or 'Under review'")
  award string? @description("Any awards received (e.g., 'Best Paper')")
}

class SkillCategory {
  category string @description("Skill category name (e.g., 'Languages', 'Frameworks', 'Tools')")
  skills string[] @description("List of specific skills in this category")
}

class ProjectItem {
  title string @description("Project name")
  dates string? @description("Date range")
  organization string? @description("Associated organization or client")
  description string @description("Brief 1-2 sentence description of the project and its impact")
  technologies string[]? @description("Key technologies used")
}

class EducationSection {
  type string @description("Must be 'education'")
  title string @description("Section title, typically 'Education'")
  items EducationItem[] @description("List of education items")
}

class ExperienceSection {
  type string @description("Must be 'experience'")
  title string @description("Section title (e.g., 'Work Experience', 'Research Experience')")
  items ExperienceItem[] @description("List of experience items, ordered by relevance to the conversation")
}

class PublicationsSection {
  type string @description("Must be 'publications'")
  title string @description("Section title, typically 'Publications'")
  items PublicationItem[] @description("List of publications")
}

class SkillsSection {
  type string @description("Must be 'skills'")
  title string @description("Section title, typically 'Technical Skills'")
  items SkillCategory[] @description("List of skill categories")
}

class ProjectsSection {
  type string @description("Must be 'projects'")
  title string @description("Section title, typically 'Projects'")
  items ProjectItem[] @description("List of relevant projects")
}

class ResumeSection {
  type string @description("One of: 'education', 'experience', 'publications', 'skills', 'projects'")
  title string @description("Section title")
  items (EducationItem | ExperienceItem | PublicationItem | SkillCategory | ProjectItem)[] @description("Section items matching the type")
}

class ResumeData {
  summary string? @description("Optional 2-3 sentence professional summary tailored to the conversation context")
  sections ResumeSection[] @description("Resume sections ordered by relevance. Include: education, experience (most relevant 2-4 roles), skills, and optionally projects/publications if relevant.")
}

class GenerateResumeResponse {
  resume ResumeData @description("The generated resume data")
}

function GenerateResume(
  system_prompt: string,
  user_messages: string,
) -> GenerateResumeResponse {
  client CLAUDE_OPUS_4_5

  prompt #"
  {{ _.role("system") }}
  {{ system_prompt }}

  {{ ctx.output_format }}

  {{ _.role("user") }}
  <user_conversation>
  The user has been asking about:
  {{ user_messages }}
  </user_conversation>
  "#
}
