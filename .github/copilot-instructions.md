# DeskWarriorFit Blog Generation Instructions

## Overview
These instructions guide the Copilot agent when creating, editing, or enhancing blog posts for DeskWarriorFit. The blog serves office workers looking for practical health, ergonomics, and movement tips.

## Target Audience
- Office workers and desk-based professionals
- People dealing with pain, stiffness, or fatigue from desk work
- Readers seeking actionable, practical advice (not theoretical)
- Busy professionals with limited time

## Blog Post Standards

### Length & Depth
- **Target length:** 800-1200 words
  - This is the current average for successful posts on the site
  - Covers topics thoroughly without overwhelming the reader
  - Includes 2-4 sections with practical guidance
- **Avoid:** Filler content, redundant explanations, or overly long introductions
- **Keep:** Conversational tone, short paragraphs (3-4 sentences max), clear structure

### Writing Style
- Use clear, conversational language—speak to readers directly
- Avoid jargon; if you must use medical terms, explain them briefly
- Use active voice and positive framing ("do this" rather than "don't do that")
- Include 2-3 practical callout sections per post (e.g., "A low-friction reset")
- End with an actionable checklist or takeaway

### Structure
- **Kicker:** One-word category tag (Move, Recover, Breathe, Habit)
- **Headline:** Benefit-driven, specific (e.g., "How to Reduce Computer Eye Strain: A Desk Worker's Guide")
- **Subtitle:** 1-2 sentences explaining the practical benefit
- **Body sections:** Use 2-4 H2 headers for main topics
- **Callout boxes:** Use for tips, checklists, or key takeaways
- **Related posts:** Link 2 relevant posts at the end
- **Meta:** Include publish date, author (DeskWarriorFit), and relevant tags

## Images

### Guidelines
- **Quantity:** 2-3 images per post (one per major section or key concept)
- **Source:** Use free stock photography from Unsplash or Pexels only
- **Relevance:** Each image must directly illustrate the content topic
- **Quality:** Professional, clean, workplace or health-related
- **Captions:** All images must have descriptive alt text and a caption with attribution
  - Alt text format: `"A [description] illustrating [concept]"`
  - Caption format: `"A [description]. <a href="[source-url]" target="_blank">Photo credit</a>"`

### Image Attribution
- Always include the photographer link (Unsplash and Pexels provide these)
- Format: `<a href="[full-unsplash-or-pexels-url]" target="_blank">Photo credit</a>`

## SEO Best Practices

### Keywords
- Include primary keyword in the first 100 words and in the H1 heading
- Weave related keywords naturally into H2 headers and body text
- Avoid keyword stuffing—prioritize readability
- Example keywords: "desk stretches," "eye strain," "ergonomics," "posture," "movement breaks"

### Meta Tags
- **Title:** Benefit-driven, keyword-rich, 50-60 characters
  - Example: "How to Reduce Computer Eye Strain: A Desk Worker's Guide"
- **Description:** Summarize the main value, 150-160 characters
  - Example: "Reduce computer eye strain with practical screen, lighting, and break habits, including how to use the 20-20-20 rule during a busy workday."
- **Image meta:** Include alt text and image title for Open Graph sharing

### Internal Linking
- Link to 1-2 related posts at the end (in the "Related posts" section)
- Use descriptive anchor text, not "click here"

## File Organization

### File Naming
- Location: `/blog/` directory
- Format: kebab-case, descriptive (e.g., `computer-eye-strain.html`, `posture-reset-blueprint.html`)
- Avoid abbreviations

### HTML Structure
- Use semantic HTML: `<h1>`, `<h2>`, `<strong>`, `<ul>`, `<li>`, `<figure>`
- Include JSON-LD structured data for Article type
- Wrap images in `<figure>` with `<figcaption>` for accessibility
- Use callout boxes with `.callout` class for tips or summaries

## Content Standards

### Topics to Cover
- Practical desk stretches and movement breaks
- Home office ergonomics and workspace setup
- Posture habits and reset routines
- Screen habits and break techniques
- Hydration, breathing, and recovery
- Sciencebackedtips with real-world application

### Before Publishing
- **Spellcheck:** No typos or grammar errors
- **Image verification:** All image paths and links work correctly
- **Internal links:** Verify all related post links are correct
- **Responsiveness:** Test layout on mobile (use max-width media queries)
- **Accessibility:** Ensure alt text is present on all images and headings are hierarchical
- **SEO:** Verify meta tags, keyword placement, and canonical URLs

## Example Blog Post Metadata

```
Title: How to Reduce Computer Eye Strain: A Desk Worker's Guide
Slug: computer-eye-strain.html
Description: Reduce computer eye strain with practical screen, lighting, and break habits, including how to use the 20-20-20 rule during a busy workday.
Keywords: computer eye strain, digital eye strain, 20-20-20 rule, eye strain from computer screen, screen breaks
Word Count: ~1000
Images: 2-3 (Unsplash/Pexels)
Sections: 4-5 (with callout boxes)
Category: Recover
Related Posts: 2 links
```

## Writing Checklist

Before submitting a blog post for publication:

- [ ] Word count is 800-1200 words
- [ ] Headline is benefit-driven and specific
- [ ] Subtitle clearly states the practical value
- [ ] 2-4 H2 sections with logical flow
- [ ] 1-2 callout boxes with actionable tips
- [ ] 2-3 images from Unsplash or Pexels with alt text and captions
- [ ] Meta description is 150-160 characters
- [ ] Primary keyword appears in first 100 words and H1
- [ ] 2 related posts linked at the end
- [ ] All internal links work and use descriptive anchor text
- [ ] Image credits and links are properly formatted
- [ ] No typos or grammar errors
- [ ] Tested on mobile for responsive layout
- [ ] JSON-LD structured data is included

---

**Last Updated:** 2026-10-04  
For questions about blog strategy or additional topics, refer to the site's mission: helping desk workers feel better through practical, science-backed movement and ergonomic advice.
