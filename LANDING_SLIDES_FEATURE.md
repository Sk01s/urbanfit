# Landing Page Slides - Feature Summary

## Overview

Dynamic landing page slide management system with admin controls, draft/publish workflow, label overlays, and live preview.

---

## Architecture

### Firebase Collection: `landingSlides`

Each document stores both draft and published data for draft/publish workflow:

```json
{
  "id": "firebase-doc-id",
  "order": 0,
  "desktopUrl": "https://...",
  "mobileUrl": "https://...",
  "desktopMediaType": "video" | "image",
  "mobileMediaType": "image",
  "label": {
    "enabled": false,
    "text": "",
    "position": { "x": 50, "y": 90 },
    "style": { "color": "#fff", "fontSize": 16, "bgColor": "#000", "bgOpacity": 0.7 }
  },
  "visible": true,
  "publishedDesktopUrl": "...",
  "publishedMobileUrl": "...",
  "publishedDesktopMediaType": "video" | "image",
  "publishedMobileMediaType": "image",
  "publishedLabel": { ... },
  "publishedVisible": true,
  "publishedOrder": 0,
  "hasDraftChanges": false,
  "createdAt": "...",
  "updatedAt": "..."
}
```

- **Client** reads `published*` fields only
- **Admin** edits top-level (draft) fields
- **Publish** copies draft fields to published fields
- `?preview=1` URL param makes the client read draft fields

---

## Files Created

| File | Purpose |
|------|---------|
| `src/hooks/useLandingSlides.jsx` | Context + hook: CRUD, draft/publish, local reordering, `updateSlideLocal` for debounced updates |
| `src/views/admin/images/SlideManager.jsx` | Main admin UI: add slide, preview draft, publish all, reorder with up/down buttons |
| `src/views/admin/images/SlideCard.jsx` | Individual slide editor card with media upload, visibility toggle, label modal, publish per-slide |
| `src/views/admin/images/LabelEditor.jsx` | Label overlay editor: custom text, color, font size, BG color/opacity, draggable position preview |
| `src/views/admin/images/LabelModal.jsx` | (embedded in SlideCard) Popup modal for label settings |
| `src/views/admin/images/SlidePreviewModal.jsx` | Full-screen iframe preview of landing page with `?preview=1` |

**Removed:** `src/views/admin/images/SlideReorderList.jsx` — replaced by up/down arrow buttons

---

## Files Modified

| File | Changes |
|------|---------|
| `src/services/firebase.js` | Added `getLandingSlides`, `addLandingSlide`, `updateLandingSlide`, `deleteLandingSlide`, `publishLandingSlides`, `reorderLandingSlides` |
| `src/hooks/useLandingSlides.jsx` | New context provider + hook |
| `src/hooks/index.js` | Added `LandingSlidesProvider`, `useLandingSlides` exports |
| `src/App.jsx` | Wrapped app with `LandingSlidesProvider` |
| `src/views/admin/images/index.jsx` | Added "Landing Slides" tab that renders `SlideManager` |
| `src/components/common/Landing.jsx` | Dynamic slides from Firebase, label overlays, `?preview=1` draft mode, full-width slider |
| `src/styles/5 - components/_home.scss` | Added `.home .landing-slider` rules for full-viewport-width slider |
| `package.json` | Removed `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |

---

## Key Features

### 1. Dynamic Slide Management
- Add/remove unlimited slides from admin
- Each slide has separate desktop and mobile media (image or video)
- Drag-and-drop removed; replaced with **up/down arrow buttons** (Reddit-style) on each slide card

### 2. Visibility Toggle
- Hide/show entire slides from the client slider with one click
- Hidden slides are skipped entirely on the landing page

### 3. Label Overlays
- Custom text per slide
- Configurable: font size, text color, background color, background opacity
- Draggable position on a preview thumbnail — position saved as percentages
- Opens in a **popup modal** (not inline) to keep the card clean
- Text input is **debounced** (400ms) to prevent lag

### 4. Draft/Publish Workflow
- All edits are saved as drafts (top-level fields)
- Publish per-slide or publish all at once
- `hasDraftChanges` flag shown as "Unpublished" badge on each card
- Yellow border on cards with unpublished changes

### 5. Live Preview
- "Preview Draft" button opens a full-screen iframe modal
- Loads the landing page with `?preview=1` query parameter
- Shows a yellow "DRAFT PREVIEW" banner at the top
- Landing page reads draft data instead of published when `?preview` is present

### 6. Instant Reordering
- Up/down arrow buttons update local state immediately (no Firestore call on each reorder)
- Order is synced to Firestore when publishing or saving

### 7. Image/Video Responsive Rendering
- Desktop images use `object-fit: cover` with `object-position: top center` and `minHeight: 60vh`
- No cropping of the top of images
- Slider uses full viewport width via CSS negative margin trick (`.landing-slider`)

---

## Firestore Rules

Add to your Firestore rules:

```
match /landingSlides/{slideId} {
  allow read;
  allow create, update, delete: if request.auth.uid != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN";
}
```

---

## How It Works

### Admin Flow
1. Go to **Admin > Media Library > Landing Slides**
2. Click **Add Slide** to create a new empty slide
3. Expand the slide card, upload desktop/mobile media
4. Toggle **Visible** to show/hide on client
5. Click **Label** to open label settings modal — enable, type text, style it, drag position
6. Use **up/down arrows** on the left to reorder slides
7. Click **Publish** on individual slides or **Publish All Changes** at the top
8. Click **Preview Draft** to see changes before publishing

### Client Rendering
- Landing page reads `publishedSlides` from context (published data only)
- Falls back to hardcoded site images if no Firebase slides exist
- Labels render as absolutely-positioned overlays with saved percentage positions
- Hidden slides (`publishedVisible === false`) are filtered out