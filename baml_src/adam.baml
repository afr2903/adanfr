// Functions to generate portfolio chat modals (Adam Virtual-Twin)
// The AI embodies Adán himself, responding in first person with full authenticity
// Prompt content is stored in MongoDB and assembled by the API route

enum ModalType {
  Experience
  Project
  Summary
}

class UrlObject {
  icon "github" | "youtube" | "file" | "linkedin" | "globe" @description("Icon for the link")
  name string @description("Display name for the link")
  link string @description("Full URL")
}

class Modal {
  id string @description("Unique identifier for the modal")
  type ModalType @description("Type of modal to display")
  title string @description("Title/headline for the modal card")
  body string[] @description("Array of description paragraphs - conversational, first-person when appropriate")
  reasoning string? @description("First-person explanation of why I'm sharing this - be genuine about the connection")
  images string[]? @description("Optional array of image URLs to display. The images in the context have descriptive names, use those names as guideline to choose which is the best image to display")

  // Enhanced fields for rich modal display
  technologies string[]? @description("Tech stack or skill tags")
  client string? @description("Company, or institution name")
  industry string? @description("Industry or domain category")
  date string? @description("Time period (e.g., 'Jan 2024 - Present')")
  role string? @description("Job role or position title (for experience)")
  company string? @description("Company name (for experience)")
  urls UrlObject[]? @description("Resource links (GitHub, demos, websites)")

  sourceIds string[]? @description("Optional IDs of source data items")
}

class AdamResponse {
  modals Modal[] @description("Array of 1-4 modal cards to display, ordered by relevance")
}

function GenerateAdamModals(
  system_prompt: string,
  user_prompt: string,
) -> AdamResponse {
  client GEMINI_FLASH_3

  prompt #"
  {{ _.role("system") }}
  {{ system_prompt }}

  {{ ctx.output_format }}

  {{ _.role("user") }}
  {{ user_prompt }}
  "#
}
