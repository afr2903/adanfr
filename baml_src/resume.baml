// BAML file for generating dynamic resumes based on conversation context

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
  user_messages: string,
  experiences_context: string,
  projects_context: string,
  education_context: string
) -> GenerateResumeResponse {
  client GEMINI_FLASH_3

  prompt #"
    <task>
    Generate a tailored resume based on the conversation context and available portfolio data.
    The resume should highlight the most relevant experiences, skills, and projects based on what the user has been asking about.
    </task>

    <user_conversation>
    The user has been asking about:
    {{ user_messages }}
    </user_conversation>

    <available_experiences>
    {{ experiences_context }}
    </available_experiences>

    <available_projects>
    {{ projects_context }}
    </available_projects>

    <available_education>
    {{ education_context }}
    </available_education>

    <resume_guidelines>
    0. CONTACT: It's already filled out by the external system.
    1. SUMMARY (optional): Almost NEVER use this. Only if the conversation reveals a specific role or interest, write a 2-3 sentence summary tailored to that context.

    2. SECTIONS ORDER: Order sections by relevance to the conversation:
       - For technical roles: Experience -> Skills -> Projects -> Education
       - For academic/research: Education -> Publications -> Research Experience -> Skills
       - Default: Education -> Experience -> Skills -> Projects

    3. EXPERIENCE SELECTION:
       - Select 2-4 most relevant experiences based on conversation context
       - Write 3-5 bullet points per role
       - Use strong action verbs (Led, Built, Designed, Implemented, Reduced, Improved)
       - Include metrics and quantifiable results when available
       - Tailor bullet points to emphasize skills relevant to the conversation

    4. SKILLS:
       - Group by category (Languages, Frameworks, Tools, etc.)
       - Prioritize skills mentioned in the conversation
       - Include 3-5 skills per category

    5. PROJECTS (if relevant):
       - Include 2-3 projects most relevant to the conversation
       - Brief descriptions with key technologies

    6. PUBLICATIONS (if relevant to research/academic contexts):
       - Include if user asked about research or academic work

    7. FORMATTING:
       - Keep it concise (should fit on 1-2 pages when rendered)
       - Use consistent date formats (e.g., "Jun. 2024 - Present")
       - Be specific with achievements, not generic

    </resume_guidelines>

    Generate a JSON resume following the ResumeData schema.

    {{ ctx.output_format }}
  "#
}
