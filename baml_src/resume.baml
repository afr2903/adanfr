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
  education_context: string,
  lens: string
) -> GenerateResumeResponse {
  client CLAUDE_OPUS_4_5

  prompt #"
Generate a tailored resume based on the conversation context and available portfolio data.

<system_goal>
You are an expert career strategist and technical writer for Adán Flores Ramírez. Your goal is to generate a single-page, high-density resume tailored specifically to the user's current goal (Industry, Research, or Leadership). 

You must strictly adhere to Adán's writing style: **concise, metric-obsessed, and action-oriented.**
</system_goal>

<user_conversation>
The user has been asking about:
{{user_messages}}
</user_conversation>

<viewpoint_lens>
    {% if lens and lens != "none" %}
    The visitor is viewing your portfolio through the {{ lens }} lens. Adjust section priority and bullet point framing:
    
    {% if lens == "recruiter" %}
    // TARGET: Software Engineering, Startups, Industry Roles
    - **Strategy:** Proven track record, ability to ship production code, revenue impact.
    - **Section Order:** Education (Top but brief) -> Experience (Top) -> Projects -> Skills.
    - **Tone:** "I built this, it made this much money/saved this much time."
    - **Highlight:** Riko MX (Founder), Pefai, Google.
    
    {% elif lens == "collaborator" %}
    // TARGET: Hackathons, Open Source, Team Projects
    - **Strategy:** Technical breadth, speed of execution, modern stack.
    - **Section Order:** Experience -> Projects -> Skills -> Education.
    - **Tone:** "I can build complex things quickly using X, Y, Z."
    - **Highlight:** Riko MX, Catapulta, RoboCup.
    
    {% elif lens == "researcher" %}
    // TARGET: PhD programs, Research Labs, Academic Grants
    - **Strategy:** Scientific rigor, novelty, publications, methodologies.
    - **Section Order:** Education (Top) -> Research Experience -> Publications -> Skills.
    - **Tone:** "First author," "Novel architecture," "Statistically significant improvement."
    - **Highlight:** MIT Device Realization Lab, RoBorregos Research, MICAI/IEEE papers.
    - **Note:** Rename "Experience" to "Research Experience" if the content is primarily academic.
    
    {% elif lens == "founder" %}
    // TARGET: VCs, Leadership Roles, Scholarships (e.g., KHS)
    - **Strategy:** Leadership, vision, resource management, prestige.
    - **Section Order:** Education (Top but brief) -> Experience (Leadership focused) -> Leadership/Service -> Projects.
    - **Tone:** "Led team of X," "Raised $K," "Directed strategy."
    - **Highlight:** Riko MX, RoBorregos Team Leader, Borrego de Oro Award.
    {% endif %}
    
    {% else %}
    // DEFAULT LENS
    - **Strategy:** Balanced profile showing Engineering + Research + Leadership.
    - **Section Order:** Education -> Experience -> Skills -> Projects.
    {% endif %}
</viewpoint_lens>

<style_guide>
    1. **The "XYZ" Bullet Formula:** Every bullet point must follow this structure: "Accomplished [X] as measured by [Y], by doing [Z]."
       - *Bad:* "Worked on a voice agent for restaurants."
       - *Good:* "Engineered speech pipeline with < 2s latency (X) and 95% order accuracy (Y) by implementing prompt-optimization and concurrent execution (Z)."
    
    2. **Metrics Over Description:** Never describe *what* the project is. Describe *the impact* of the project.
       - Use specific numbers: "$8K MRR," "40% reduction," "96.5% success rate," "3-person team."
    
    3. **Action Verbs:** Start every bullet with a power verb.
       - *Engineering:* Engineered, Architected, Optimized, Refactored, Deployed.
       - *Research:* Authored, Synthesized, Validated, Fine-tuned, Benchmarked.
       - *Leadership:* Directed, Spearheaded, Mentored, Negotiated.
    
    4. **Density:** No fluff. No filler words. Remove "successfully," "helped to," "responsible for." Maximize information per line.

    5. Identify if education is relevant, almost always include just the B.S. briefly. Certifications most of the time are not relevant.
</style_guide>

<available_experiences>
{{ experiences_context }}
</available_experiences>

<available_projects>
{{ projects_context }}
</available_projects>

<available_education>
{{ education_context }}
</available_education>

<few_shot_examples>
    // FULL EXAMPLE with job description
    Job Description: "Open-Source Machine Learning Engineer - International Remote
Description
At Hugging Face, were on a journey to democratize good AI. We are building the fastest growing platform for AI builders with over 5 million users & 100k organizations who collectively shared over 1M models, 300k datasets & 300k apps. Our open-source libraries have more than 400k+ stars on Github.
About the Role
As an open-source Machine Learning Engineer, you will work to improve the open-source machine learning ecosystem. You will mainly work with existing open-source libraries, such as Transformers, Datasets, or Accelerate, and you will interact with users and contributors of the broad open-source machine learning ecosystem. We'll brainstorm with you to put you in a position to do the work that interests you and that is impactful.
You'll get to foster one of the most active machine learning communities, helping users contribute to and use the tools that you build. You'll interact with Researchers, ML practitioners and data scientists on a daily basis through GitHub, our forums, or slack.
About you
If you love open-source, are passionate about making complex technology more accessible, and want to contribute to one of the fastest-growing ML ecosystems, then we can't wait to see your application!
If you're interested in joining us, but don't tick every box above, we still encourage you to apply! We're building a diverse team whose skills, experiences, and background complement one another. We're happy to consider where you might be able to make the biggest impact."
    Output resume:
```
{
  "summary": null,
  "sections": [
    {
      "type": "education",
      "title": "EDUCATION",
      "items": [
        {
          "institution": "Instituto Tecnológico y de Estudios Superiores de Monterrey",
          "location": "Monterrey, N.L., Mexico",
          "degree": "B.S. Mechatronics Engineering",
          "dates": "Aug. 2021 - Jun. 2025",
          "gpa": "96/100",
          "highlights": [
            "Leadership in Professional Development Award",
            "Linux Foundation Scholarship recipient, PyTorch Conference 2025"
          ]
        }
      ]
    },
    {
      "type": "experience",
      "title": "WORK EXPERIENCE",
      "items": [
        {
          "title": "Founding Engineer",
          "dates": "July 2025 - Present",
          "organization": "Riko MX",
          "location": "San Francisco, CA / Monterrey, N.L., Mexico",
          "bullets": [
            "Lead 3-person team building AI voice agents enabling Mexican restaurants to take direct orders, reclaiming ownership from delivery platforms charging 30% commissions. $8K MRR, $110K raised at $4M valuation.",
            "Engineered conversational speech pipeline handling 50+ daily customer interactions, under $2 MXN/minute, and with 95% order accuracy, by implementing a modular architecture with a data flywheel in Python/LiveKit."
          ]
        },
        {
          "title": "AI Engineer",
          "dates": "Jan. 2025 - Sep. 2025",
          "organization": "Pefai",
          "location": "Mexico City, Mexico",
          "bullets": [
            "Led 3-person team building multi-agent AI system. Achieved 20% faster generation through concurrent execution and type-safe outputs; improved accuracy 30% via semantic-based custom quality evaluation framework."
          ]
        },
        {
          "title": "Undergraduate Research Assistant",
          "dates": "Sep. 2024 - Dec. 2024",
          "organization": "MIT Device Realization Lab",
          "location": "Cambridge, MA",
          "bullets": [
            "1st author on VR+ML+LLM framework for manufacturing education achieving 28.6% throughput increase and 35.4% scrap reduction in simulation. Under review at Taylor & Francis.",
            "Refactored entire FrED Factory codebase, establishing new standard repository now used by all lab researchers."
          ]
        },
        {
          "title": "Software Engineer Intern",
          "dates": "June 2024 - Sep. 2024",
          "organization": "Google Cloud AI & Industry solutions",
          "location": "Sunnyvale, CA",
          "bullets": [
            "Optimized resource consumption for data ingestion processes by refining critical C++ components and implementing rigorous SQL-based end-to-end testing, leading to a more scalable and reliable data infrastructure."
          ]
        },
        {
          "title": "Unity Developer",
          "dates": "Nov. 2020 - Feb. 2024",
          "organization": "Irmatix Robotics Catapulta Academy",
          "location": "Remote",
          "bullets": [
            "Democratized STEM education for under-resourced Mexican schools with web-based gamified learning platform."
          ]
        }
      ]
    },
    {
      "type": "projects",
      "title": "PROJECTS & RESEARCH",
      "items": [
        {
          "title": "MICAI 2025 (Springer LNAI) | Natural Language Processing, LLMs, LH Task Planning",
          "dates": "June - Nov. 2025",
          "organization": null,
          "description": "1st author: Taming the LLM: Reliable Task Planning for Robotics using Parsing and Grounding. Open-source fine-tuned 8B model achieved 96.5% success vs. cloud APIs (90.4%) in long-horizon task planning for robotics; pipeline publicly available and in HF Spaces. 2nd Best Student Paper Award. Published.",
          "technologies": []
        },
        {
          "title": "RoboCup @HOME Competition",
          "dates": "Nov. 2022 - May 2025",
          "organization": null,
          "description": "Led the development and deployment of an autonomous service robot for elderly/disabled with 4 software areas: computer vision, HRI, manipulation and navigation, 6th place international. 1st author: Software Toolkit for RoboCup@Home (ICRCA 2026). Open-source modular architecture for service robots, validated in real-world competition conditions. Under Review.",
          "technologies": [
            "C++",
            "Python",
            "ROS"
          ]
        }
      ]
    },
    {
      "type": "skills",
      "title": "TECHNICAL SKILLS",
      "items": [
        {
          "category": "Languages",
          "skills": [
            "Python",
            "C++",
            "Bash",
            "Go",
            "SQL",
            "Rust"
          ]
        },
        {
          "category": "ML/AI",
          "skills": [
            "PyTorch",
            "Transformers",
            "LangChain",
            "OpenCV",
            "LiveKit"
          ]
        },
        {
          "category": "Systems",
          "skills": [
            "ROS/ROS2",
            "Docker",
            "Linux",
            "Git",
            "FastAPI"
          ]
        }
      ]
    }
  ]
}
```

    // BULLET EXAMPLE 1: Transformation for "Founding Engineer" (Industry Lens)
    Input: "Building AI voice agents for restaurants... $110K pre-seed... handling 30+ daily customer interactions."
    Output Bullet: "Lead 3-person team building AI voice agents enabling Mexican restaurants to take direct orders. $8K MRR, $110K raised at $4M valuation. 80+ daily customer interactions."
    Output Bullet: "Engineered speech pipeline with < 2s latency, 95%+ order accuracy, and prompt-optimized (40% fewer tokens)."

    // BULLET EXAMPLE 2: Transformation for "MIT Research" (Research Lens)
    Input: "Proposed framework synthesizing VR, AI... 29% production improvement... 36% waste reduction."
    Output Bullet: "1st author on VR+ML+LLM framework for manufacturing education achieving 43.9% throughput increase and 43.6% scrap reduction in simulation. Under review at Taylor & Francis."
    
    // BULLET EXAMPLE 3: Transformation for "Google" (Software Lens)
    Input: "Built data synchronization components... Reduced computational resources... by 40%."
    Output Bullet: "Optimized C++ data infrastructure components and implemented SQL testing, improving scalability for clients."
</few_shot_examples>

<resume_guidelines>
    0. **CONTACT:** Managed externally.
    
    1. **SUMMARY:** STRICTLY FORBIDDEN unless the user explicitly asks for a "Bio" or "Summary."
    
    2. **SECTIONS:**
       - Select strictly the top 3-4 most relevant blocks (Experience + Projects combined) to ensure one-page fit.
       - ENSURE ONE PAGE FIT. For reference, a bullet point at 115 characters is approximately 1 line of text. Think visually given this measurement.
       - If `lens == "researcher"`, you MUST include a "Research & Publications" section separate from Experience.
    
    3. **AWARDS LOGIC:**
       - If the award is prestigious (e.g., Borrego de Oro, Best Paper), include it within the **Education** object highlights OR creates a small **Awards** section at the bottom. Do not bury it in generic bullets.
       
    4. **FORMATTING:**
       - Use "Jan. 2025" format.
       - If a role is "Current", use "Present".
       - Group skills logically (Languages, ML/AI, Systems).
</resume_guidelines>

Generate a JSON resume following the ResumeData schema.

{{ ctx.output_format }}
  "#
}
