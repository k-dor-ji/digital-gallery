# ATELIER — Artwork Gallery

A minimal, cinematic portfolio gallery built with **React + Vite**. Masonry layout, fullscreen lightbox, keyboard navigation, blur-up lazy loading, and a dark aesthetic designed for high-resolution artwork.

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

---

## Adding Your Artwork

Open `src/data/artworks.js` — this is the **only file you need to edit** to manage your collection.

### Option A — Cloudinary (Recommended for large images)

Cloudinary's free tier gives you **25 GB storage** and automatic image optimization.

1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. In your dashboard, go to **Settings → Upload → Upload Presets → Add unsigned preset**
3. Copy your **Cloud Name** from the dashboard top-left
4. Copy `.env.example` to `.env.local` and set `VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name`
5. Upload images via the Cloudinary dashboard or Media Library
6. Copy each image's **Public ID** and add it to your artwork entry:

```js
{
  id: 9,
  title: 'My New Painting',
  year: '2024',
  medium: 'Oil on canvas',
  category: 'painting',
  cloudinaryId: 'folder/my-painting-public-id',  // ← from Cloudinary
  src: null,        // leave null when using cloudinaryId
  thumbnail: null,  // leave null when using cloudinaryId
  aspectRatio: 0.75,  // width ÷ height of your image
  description: 'Optional description shown in lightbox.',
  tags: ['oil', 'abstract'],
}
```

> To use Cloudinary URLs, update the Gallery/Card components to build URLs like:
> `https://res.cloudinary.com/{cloudName}/image/upload/w_1200,q_auto/{cloudinaryId}`
> Cloudinary handles resizing, WebP conversion, and CDN delivery automatically.

### Option B — Local files

1. Put your images in `/public/images/`
2. Set `src` and `thumbnail` directly:

```js
{
  cloudinaryId: null,
  src: '/images/my-painting.jpg',
  thumbnail: '/images/my-painting-thumb.jpg',  // Optional smaller version
  aspectRatio: 1.33,
}
```

> **Tip:** For thumbnails, export at ~600px wide. For full resolution, 1800–2400px wide is ideal.

### Aspect Ratio

`aspectRatio` is **width ÷ height**. Examples:
- Square → `1.0`
- Portrait (4:5) → `0.8`
- Landscape (16:9) → `1.78`
- Tall (2:3) → `0.67`

Getting this right ensures the masonry layout has no layout shift on load.

---

## Customizing the Site

### Artist name, tagline, social links

Edit the `siteConfig` object at the bottom of `src/data/artworks.js`:

```js
export const siteConfig = {
  artistName: 'Your Name',
  tagline: 'A curated collection of original works',
  social: {
    instagram: 'https://instagram.com/yourhandle',
    email: 'hello@yoursite.com',
    website: null,   // set to null to hide
  },
}
```

### Categories

Edit the `CATEGORIES` array at the top of `src/data/artworks.js`. The `id` must match the `category` field on your artworks:

```js
export const CATEGORIES = [
  { id: 'all',         label: 'All Works' },
  { id: 'painting',    label: 'Painting' },
  { id: 'ceramics',    label: 'Ceramics' },  // ← add your own
]
```

### Colors & typography

All design tokens are CSS variables in `src/styles/global.css`. Key ones:

```css
--bg:       #0a0a0a;     /* Page background */
--accent:   #c8a96e;     /* Gold accent color */
--font-display: 'Cormorant Garamond', serif;  /* Headings/titles */
--font-ui:  'Syne', sans-serif;               /* UI text */
```

Swap the Google Fonts import in `index.html` to change fonts entirely.

### Page title

Edit the `<title>` tag in `index.html`.

---

## Deployment on Netlify (Free)

### Method 1 — Netlify Drop (no account needed)

```bash
npm run build    # Creates /dist folder
```

Drag & drop the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.

### Method 2 — Git-connected deploy (auto-deploys on push)

1. Push this project to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Select your repo
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Under **Site settings → Environment variables**, add:
   - `VITE_CLOUDINARY_CLOUD_NAME` = your cloud name
6. Click **Deploy site**

Every push to `main` will trigger a new deploy automatically.

### Custom domain

In Netlify: **Domain settings → Add custom domain** → follow DNS instructions. HTTPS is automatic.

---

## Project Structure

```
artwork-gallery/
├── index.html                    # Entry HTML, fonts
├── vite.config.js
├── netlify.toml                  # SPA routing fix
├── .env.example                  # Copy to .env.local
│
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # Main layout, state
    ├── App.module.css
    │
    ├── data/
    │   └── artworks.js           # ← YOUR CONTENT LIVES HERE
    │
    ├── components/
    │   ├── Header.jsx / .css     # Fixed nav header
    │   ├── CategoryFilter.jsx    # Tag pills
    │   ├── Gallery.jsx           # Masonry grid
    │   ├── ArtworkCard.jsx       # Individual card w/ hover
    │   ├── Lightbox.jsx          # Fullscreen viewer
    │   └── Footer.jsx            # Social + copyright
    │
    ├── hooks/
    │   ├── useKeyboard.js        # Arrow + Escape keys
    │   └── useLazyImage.js       # Intersection Observer + blur-up
    │
    └── styles/
        └── global.css            # Design tokens, reset
```

---

## Performance Notes

- **Lazy loading** — images only load when near the viewport (200px ahead)
- **Blur-up** — thumbnail loads first, then full resolution fades in
- **Masonry layout** — pure CSS columns, no JS layout calculation per frame
- **Cloudinary** — serves auto-optimized WebP, sized to request dimensions
- **Code splitting** — Vite handles this automatically

---

## Future Enhancements

- **Password-protected admin panel** — use Netlify Identity or Supabase Auth
- **CMS integration** — connect [Contentful](https://contentful.com) or [Sanity](https://sanity.io) (both free tiers) so you can manage works without touching code
- **Infinite scroll** — add IntersectionObserver at page bottom, paginate `artworks` array
- **Print shop** — link each artwork to a Printful or Society6 product page
- **EXIF data** — for photography, read and display camera/lens metadata
