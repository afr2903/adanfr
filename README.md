# next-portfolio
Newer version of my portfolio using Next, design enhanced with V0

## Wicho AI chat (/wicho)

1) Add a `GOOGLE_API_KEY` env var for Gemini.
2) Install BAML and generate the client:

```
npm install @boundaryml/baml
npx baml-cli init
npx baml-cli generate
```

The API route `app/api/wicho/route.ts` prefers the BAML client if present; otherwise it falls back to a local heuristic over the `data/` content to pick the most relevant experience, project, or education and always includes a resume download modal.
