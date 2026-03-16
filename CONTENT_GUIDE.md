# Portfolio Content Editing Guide

Welcome to the content editing guide for your portfolio! This website is built to be easily updatable. Most of your content is centrally managed in a single data file, and your images/videos are imported automatically from specific folders.

---

## 1. The Master Data File (`src/data.ts`)

Almost all the text on your website is controlled by one file: `src/data.ts`.

Open `src/data.ts` in any text editor or IDE (like VS Code). Here is what you can edit inside:

### A. The Hero Section

Look for `heroPitch` and `heroDescription`.

```typescript
export const portfolioData = {
    heroPitch: "Designing the Logic. Crafting the Visual.",
    heroDescription: "I shape digital experiences prioritizing user empathy...",
    // ...
```

- **To change the big headline:** Edit the text inside the `" "` next to `heroPitch`.
- **To change the subtext:** Edit the text next to `heroDescription`.

### B. Contact & Social Links

Look for the `socials` object in `src/data.ts`.

```typescript
    socials: {
        linkedin: "https://linkedin.com/in/abhineshv",
        dribbble: "https://dribbble.com/abhineshv",
        behance: "https://behance.net/abhineshvivek",
    },
```

- Simply replace the URLs with your actual profile links.
- *Note: Your email address (`hello@abhineshvivek.com`) is hardcoded into `src/components/Contact.tsx` and `src/components/ResumeModal.tsx` for the copy-to-clipboard functionality.*

### C. The About Section

Look for the `about` object.

```typescript
    about: {
        heading: "Designing with Purpose.",
        paragraphs: [
            "My design journey started at the intersection of psychology and visual art.",
            "I believe that the best interfaces are the ones you don't even notice..."
        ],
        // ...
```

- **To add/remove paragraphs:** Just add or remove strings inside the `paragraphs: [...]` array. Each string wrapped in `" "` becomes a new paragraph on the site.

---

## 2. Managing Featured Projects

Your main portfolio case studies are also managed inside `src/data.ts` under the `projects` array.

### How to Add a New Project

To add a new project, create a new block inside the `projects: [...]` array following this exact structure:

```typescript
{
    id: "my-new-project",
    title: "Project Title",
    category: "Product Design",
    year: "2026",
    role: "Lead Designer",
    timeline: "3 Months",
    image: "/images/target-image-main.webp", // This is the main thumbnail
    screenshots: [ // These show up inside the Project Detail modal and the Hero Stack
        "/images/screenshot-1.webp",
        "/images/screenshot-2.png"
    ],
    // Add 1-3 short paragraphs explaining the project
    description: [
        "A brief overview of the problem.",
        "How I solved it."
    ],
    // The colored tags on the project card
    tags: ["UX Research", "Figma", "Prototyping"],
    // Optional: Link to the live site or case study
    link: "https://my-live-project.com"
}
```

### Where to put Project Images

1. Save your project images (JPEG, PNG, or WebP) in the `public/images/` folder.
2. In `data.ts`, reference them starting with `/images/...` (e.g., `"/images/my-cool-mockup.png"`).
3. **Pro-tip:** For the fastest loading speeds, use `.webp` format, especially for the first 3 screenshots of your first project, as these are used in the Hero Kinetic Stack!

---

## 3. The Freelance & Visuals Grid (Branding Posters)

The "Branding & Social Media" section is completely automated! You do not need to edit any code to add images here.

1. Open the folder: `src/assets/freelance/`
2. **To Add:** Drag and drop any image (`.png`, `.jpg`, `.webp`) or video (`.mp4`) into this folder.
3. **To Remove:** Delete the file from this folder.
4. The website will automatically scan this folder and build the masonry grid (or mobile carousel) for you!

---

## 4. The Photobook (Photography Gallery)

Just like the Freelance grid, the photography section is fully automated.

1. Open the folder: `src/assets/photobook/`
2. **To Add:** Drop your high-quality photos (or videos) into this folder.
3. The `<Photobook />` component automatically imports everything inside and handles the hover effects, captions, and the fullscreen lightbox.
4. *Note: If you want specific captions for photos instead of "Archival Capture X", you would need to edit `src/components/Photobook.tsx` to map specific filenames to captions.*

---

## 5. Editing the Resume Modal

If you ever need to change your quick stats or background info in the "View Resume" pop-up:

1. Open `src/components/ResumeModal.tsx`.
2. Scroll down to line `~70`.
3. You will see HTML-like layout code:

```tsx
<h3 className="text-3xl font-medium tracking-tight text-white mb-1">
    Abhinesh
</h3>
<p className="text-xl text-[#B200FF] font-serif italic mb-8">
    Product Designer
</p>
```

4. Just carefully edit the text between the tags!

---

## Quick Checklist for Updates

- [ ] Text changes? -> Check `src/data.ts`.
- [ ] New Case Study? -> Edit `src/data.ts` and put images in `public/images/`.
- [ ] New Graphic Design/Brand Asset? -> Drop the file into `src/assets/freelance/`.
- [ ] New Photo? -> Drop the file into `src/assets/photobook/`.
- [ ] Email change? -> Open `src/components/Contact.tsx`.
