# Portfolio with AI Virtual Twin

Personal portfolio with an LLM-powered interface ("Adam") that answers questions about professional experience using structured outputs.

**Live:** [adanfr.com](https://adanfr.com)

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev                    # Starts dev server at localhost:3000
```

Requires `OPENROUTER_API_KEY` for LLM features.

## Architecture

```
├── app/                       # Next.js App Router
│   ├── api/adam/route.ts      # Virtual Twin API endpoint
│   └── adam/page.tsx          # Chat interface
├── baml_src/                  # BAML schema definitions (structured LLM outputs)
│   ├── adam.baml              # Modal generation schema
│   ├── resume.baml            # Dynamic resume generation
│   └── clients.baml           # LLM client configs
├── baml_client/               # Auto-generated TypeScript (don't edit)
├── data/                      # Portfolio content as TypeScript
│   ├── experiences.ts
│   ├── projects.ts
│   └── education.ts
├── components/adam/           # Chat UI components
└── public/images/             # Static assets
```

## Adding Content

### Experiences & Projects

Edit `data/experiences.ts` or `data/projects.ts`:

```typescript
// data/experiences.ts
export const experiences = [
  {
    id: "company-name",           // Unique identifier
    logo: "/images/logos/company.jpg",
    company: "Company Name",
    role: "Your Role",
    period: "Jan. 2024 - Present",
    description: "Brief one-liner for cards",
    details: {
      description: ["Bullet 1", "Bullet 2"],
      organization: "Company Name",
      period: "Jan. 2024 - Present",
      location: "City, Country",
      skills: ["Python", "TypeScript"],
      images: ["/images/experiences/project-photo.jpg"],
    },
  },
]
```

### Images

Place images in `public/images/` following this structure:

| Type | Path | Example |
|------|------|---------|
| Logos | `public/images/logos/` | `google.jpg`, `mit.png` |
| Experience photos | `public/images/experiences/` | `google-intern-team.jpg` |
| Project screenshots | `public/images/projects/` | `micai25-paper-figure.png` |

Reference in data files as `/images/logos/google.jpg` (no `public/` prefix).

## Virtual Twin System

The chat assistant uses [BAML](https://docs.boundaryml.com/) for structured LLM outputs.

### Modal Types

The LLM generates typed `Modal` objects rendered as expandable cards:

| Type | Use Case |
|------|----------|
| `Experience` | Jobs, internships, roles |
| `Project` | Technical work, research |
| `Summary` | Direct answers, reflections |

Each modal includes: `title`, `body[]`, `reasoning`, `images[]`, `technologies[]`, `urls[]`, etc.

### Viewpoint Lenses

Visitors can select a "lens" that adjusts response framing:

- **Recruiter**: Emphasizes metrics, titles, career progression
- **Collaborator**: Technical depth, collaboration style
- **Researcher**: Publications, methodologies, academic work
- **Founder**: Leadership, startup experience, resource management

### Dynamic Resume Generation

`baml_src/resume.baml` generates tailored resumes based on conversation context. The LLM selects relevant experiences and reformats bullets following the XYZ formula ("Accomplished X measured by Y by doing Z").

Sections are reordered based on lens (e.g., researcher lens prioritizes Education and Publications).

### Flow

```
User message
    ↓
app/api/adam/route.ts
    ↓
BAML GenerateAdamModals() → Structured JSON
    ↓
Frontend renders Modal cards
```

### Data collection
For analysis and improvement of the AI, the user messages and modals generated (anonymously) are stored in a Mongo collection.

## Development

```bash
npm run baml:generate  # Regenerate TypeScript client from BAML
npm run build          # Production build (runs baml:generate first)
npm run lint           # ESLint
```

BAML native modules are externalized in `next.config.mjs` to prevent bundling issues.

## Tech Stack

- **Framework**: Next.js 15, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix primitives)
- **LLM Integration**: BAML + OpenRouter (Gemini 3 Flash, Claude Opus 4.5)
- **Deployment**: Vercel
