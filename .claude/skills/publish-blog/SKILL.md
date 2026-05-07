---
name: publish-blog
description: Write and auto-publish a RentAcross blog post to Sanity. Takes a keyword, location, and optional context; pulls Pexels images; scaffolds a post module under scripts/blog/posts/; runs scripts/blog/publish.mjs; auto-links to existing posts. Use when the user asks to draft, write, or publish a new blog post for RentAcross.
---

# publish-blog

End-to-end RentAcross blog author. Input: keyword + location (+ optional context). Output: a published post live at `https://rentacross.com/blog/<slug>`.

## What RentAcross is

Camera, lens, and equipment rental across India. Audience: photography/videography enthusiasts, students, semi-pros, hobbyists, content creators. Live URL: https://rentacross.com.

## Core principle (read every time, write toward this)

Highest customer satisfaction. We are not here to maximize profit — we are here for the community capturing memorable moments. We're 4.9-rated with 265+ reviews (Google has unfairly reduced that count multiple times). We're in this for the long run. No spam. No aggressive retargeting. Honest, useful content that respects the reader's time.

That shows up in writing as:
- We give honest advice even when it costs us a rental ("don't buy yet — borrow first").
- We don't oversell. No fake urgency. No listicles built to game SEO.
- We treat the reader like a friend, not a funnel. Trust > clicks.
- If a sentence sounds like a marketing department wrote it, delete it.

## Inputs

Parse from `args` (natural language is fine):
- **keyword** — target keyword/topic (required)
- **location** — city/region (required; if a keyword is genuinely India-wide, use "India")
- **context** — optional angle (e.g., "for monsoon", "for beginners", "wedding season")

If keyword or location is missing, ask once. Don't proceed without them.

## Topical fit check

The keyword must plausibly intersect with cameras, lenses, lighting, audio, drones, video gear, photography craft, videography, content creation, travel-with-gear, or rental as a category. If it doesn't, tell the user and stop. Do not write off-brand content.

## Steps

### 1. Read references

Read every file under `seo/references/`. Treat as voice/strategic reference (keyword maps, internal-link priorities, do-not-write lists, brand voice notes). Apply whatever is there. (`seo/personal/` is unrelated — ignore it.)

### 2. Slug + collision check

`slug = kebab-case(keyword + " in " + location)` — adjust to read naturally (e.g., `wedding-photography-in-mumbai`, `dslr-rental-bangalore`).

Check `scripts/blog/posts/<slug>.mjs` doesn't exist. Then list existing live posts in Sanity:

```bash
curl -s 'https://6y25plyx.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%3D%3D%22post%22%5D%7Btitle%2C%22slug%22%3Aslug.current%7D' | jq
```

If the slug collides, propose a refined slug or ask the user about `--update`.

### 3. Internal-link candidates

From the list above, pick 1-3 topically related existing posts to link to inside the new post body. Don't force it — one good link beats three forced ones.

### 4. Draft the outline (gate)

Sketch:
- Working title — specific, not clickbait
- Hook — the uncomfortable truth or local insight to open with
- 5-7 H2 sections, with H3 subsections where they help
- 4-7 image slots, each with the Pexels search query you'll use
- 1-3 candidate internal links from step 3
- Where the rental angle (borrow → rent → buy) fits naturally — usually one section, not three

**Show the outline to the user. Wait for approval. Do not skip this gate.** Once published, content is live — outline review is the cheap insurance.

### 5. Find Pexels images

For each image slot:

```bash
set -a && source .env && set +a
curl -s -H "Authorization: $PIXELS_API_KEY" \
  "https://api.pexels.com/v1/search?query=<url-encoded-query>&per_page=10&orientation=landscape" \
  | jq '.photos[] | {id, photographer, alt, url}'
```

Pick photos that match the section topic. Prefer authentic over stock-y. Hero must be landscape. Avoid duplicate photographers if possible. Env var is `PIXELS_API_KEY` (note spelling — not PEXELS).

### 6. Write the post module

Create `scripts/blog/posts/<slug>.mjs`. Match the shape of `scripts/blog/posts/photography-courses-in-pune.mjs` exactly:

```js
import { p, h2, h3, bullet, numbered, image, em, strong, link } from '../lib/pt.mjs'

export const meta = {
  slug: '...',
  title: '...',           // specific, not clickbait
  shortDesc: '...',       // ~25-40 words, plain string, no markdown
  heroImage: 'hero',      // key into images below
  heroAlt: '...',
}

export const images = {
  hero:    { pexelsId: 12345 },
  // 3-6 more, keyed by section topic
}

export function buildBody(img) {
  return [
    p('...'),
    h2('...'),
    image(img.someKey, 'descriptive alt for the photo'),
    bullet(strong('Label. '), '...'),
    numbered(strong('Step. '), '...'),
    p('...', link('https://rentacross.com/blog/<existing-slug>', 'anchor'), '...'),
  ]
}
```

Use `em()` and `strong()` for emphasis inline. Use `link(href, text)` for links. Don't import or invent helpers — only use what's exported from `../lib/pt.mjs`.

### 7. Voice rules

- Conversational, second-person ("you"). Reserve "we" for genuine RentAcross-as-company moments.
- Specific. Real neighborhoods, real spots, real prices in INR, real names. Generic = delete.
- Honest. If something is overrated, say so. If beginners shouldn't buy gear yet, say so. That's the brand.
- Slightly opinionated. Have a take. The boring middle is the enemy.
- Mix sentence lengths. One-line paragraphs are fine. Punchy beats polished.
- No filler: "in today's world", "in conclusion", "let's dive in", "imagine this", "comprehensive guide".
- No fake urgency, no "limited time", no "act now", no "you won't believe".
- Rental plug appears once, naturally — usually in a "the gear question" or "borrow before you buy" section. One link, one mention. Not bolted on at the end.
- Do not invent reviews, ratings, awards, partnerships, or prices for non-RentAcross businesses; say "verify on their website".
- If you mention RentAcross's 4.9 / 265+ reviews, do it as a quiet aside, never a brag.

### 8. Image placement

- Hero is implicit via `meta.heroImage`. Don't place it inline.
- Inline images alternate with prose. Never two `image()` calls back-to-back.
- `alt` describes the photo, not the section.
- Pexels attribution is added automatically — don't write it manually.

### 9. Publish

```bash
set -a && source /Users/shri/rentacross/ra-frontend/.env && set +a
node /Users/shri/rentacross/ra-frontend/scripts/blog/publish.mjs scripts/blog/posts/<slug>.mjs
```

If the user explicitly asked to overwrite an existing post, append `--update`.

Print the publish output (the script outputs the live URL + local URL). Done.

## What NOT to do

- Don't scaffold and publish without showing the outline first.
- Don't write generic "ultimate guide" content — keep it locally specific.
- Don't add new dependencies; don't modify `scripts/blog/lib/` or `publish.mjs`. The post module is the only file you write.
- Don't write SEO clutter ("In this comprehensive guide..."). Get to value in sentence one.
- Don't invent Pexels IDs — always search.
- Don't commit anything to git. Just publish to Sanity.
- Don't write off-topic posts. RentAcross is gear/photography/videography — stay there.
