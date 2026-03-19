# AweNestHomes — SEO Reference Guide

> Last updated: March 2026
> Stack: Next.js 15, App Router, deployed on Vercel Free Tier

---

## Table of Contents

1. [Current SEO State](#1-current-seo-state)
2. [Google Vacation Rental Rich Results](#2-google-vacation-rental-rich-results)
3. [Schema / JSON-LD by Page](#3-schema--json-ld-by-page)
4. [Metadata & Open Graph Strategy](#4-metadata--open-graph-strategy)
5. [Technical SEO Checklist](#5-technical-seo-checklist)
6. [Vercel Free Tier & ISR Strategy](#6-vercel-free-tier--isr-strategy)
7. [Local SEO](#7-local-seo)
8. [Programmatic SEO Opportunities](#8-programmatic-seo-opportunities)
9. [Core Web Vitals 2025](#9-core-web-vitals-2025)
10. [Social Sharing](#10-social-sharing)
11. [Content SEO](#11-content-seo)
12. [Ranking Roadmap](#12-ranking-roadmap)

---

## 1. Current SEO State

### Pages Audited

| Route | Public | Has Metadata | Has JSON-LD | OG Tags | Indexed |
|-------|--------|-------------|-------------|---------|---------|
| `/` | ✅ | ⚠️ Generic | ❌ | ❌ | ✅ |
| `/properties/[id]` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `/become-a-host` | ✅ | ⚠️ Generic | ❌ | ❌ | ✅ |
| `/auth/login` | ✅ | ❌ | ❌ | ❌ | ✅ Should noindex |
| `/auth/signup` | ✅ | ❌ | ❌ | ❌ | ✅ Should noindex |
| `/host/*` | 🔒 | ⚠️ Some | ❌ | ❌ | Should noindex |
| `/bookings/*` | 🔒 | ⚠️ Some | ❌ | ❌ | Should noindex |
| `/profile` | 🔒 | ❌ | ❌ | ❌ | Should noindex |

### Critical Gaps Fixed (March 2026)
- ✅ `robots.ts` created — disallows private routes
- ✅ `sitemap.ts` created — all published properties included
- ✅ Root layout `metadataBase` + OG + Twitter Cards added
- ✅ `generateMetadata` added to `/properties/[id]`
- ✅ `VacationRental` JSON-LD added to property detail page
- ✅ `Organization` + `WebSite` JSON-LD added to root layout
- ✅ `BreadcrumbList` JSON-LD added to property pages

---

## 2. Google Vacation Rental Rich Results

Google has a dedicated **Vacation Rental** vertical in Search and a dedicated rich result type.

### How to Qualify

1. Add `VacationRental` (subtype of `LodgingBusiness`) JSON-LD to every property page
2. Required fields: `name`, `image`, `address`, `geo` coordinates
3. Recommended: `aggregateRating`, `amenityFeature`, `priceRange`, `checkinTime`, `checkoutTime`
4. Validate at: https://search.google.com/test/rich-results
5. Monitor via Google Search Console → Enhancements → Vacation Rentals

### Two Implementation Paths

| Path | Best for | How |
|------|----------|-----|
| **Structured Data Markup** | < 1,000 properties | JSON-LD on each property page (what we use) |
| **Data Feed** | 1,000+ properties | Submit XML feed to Google via Search Console |

For AweNestHomes at current scale, **JSON-LD per page** is correct. Switch to data feed when listing count exceeds 500.

### What the Rich Result Shows

- Property name + photo carousel
- Star rating + review count
- Location
- Amenities summary
- Price per night range
- Direct booking link

---

## 3. Schema / JSON-LD by Page

### Root Layout — `Organization` + `WebSite`

Applied globally via root `layout.tsx`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AweNestHomes",
  "url": "https://awenesthomes.com",
  "logo": "https://awenesthomes.com/logo.png",
  "sameAs": [
    "https://instagram.com/awenesthomes",
    "https://facebook.com/awenesthomes"
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AweNestHomes",
  "url": "https://awenesthomes.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://awenesthomes.com/?location={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

The `SearchAction` schema enables a **Sitelinks Search Box** in Google — users can search your properties directly from the SERP.

---

### `/properties/[id]` — `VacationRental` + `BreadcrumbList`

This is the most important schema. Applied per-property:

```json
{
  "@context": "https://schema.org",
  "@type": "VacationRental",
  "name": "Luxury Villa in Goa",
  "description": "Property description...",
  "url": "https://awenesthomes.com/properties/abc123",
  "image": [
    "https://res.cloudinary.com/.../primary.jpg",
    "https://res.cloudinary.com/.../img2.jpg"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Beach Road",
    "addressLocality": "Goa",
    "addressRegion": "Goa",
    "postalCode": "403001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 15.4909,
    "longitude": 73.8278
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "24",
    "bestRating": "5",
    "worstRating": "1"
  },
  "numberOfRooms": 3,
  "maximumAttendeeCapacity": 6,
  "checkinTime": "14:00",
  "checkoutTime": "11:00",
  "petsAllowed": false,
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Pool", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true }
  ],
  "offers": {
    "@type": "Offer",
    "price": "5000",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "host": {
    "@type": "Person",
    "name": "Host Name",
    "image": "https://..."
  }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://awenesthomes.com" },
    { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://awenesthomes.com/properties" },
    { "@type": "ListItem", "position": 3, "name": "Luxury Villa in Goa" }
  ]
}
```

---

### `/` Homepage — `WebPage` + `ItemList`

For the homepage listing featured properties:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Featured Vacation Rentals",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://awenesthomes.com/properties/abc123"
    }
  ]
}
```

---

### `/become-a-host` — `FAQPage`

Add common host questions as FAQPage schema to get FAQ rich results in SERPs:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I list my property on AweNestHomes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sign up, complete your host profile, and follow our step-by-step listing wizard..."
      }
    },
    {
      "@type": "Question",
      "name": "How much does AweNestHomes charge hosts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AweNestHomes charges a competitive service fee..."
      }
    }
  ]
}
```

---

## 4. Metadata & Open Graph Strategy

### `metadataBase`

Set in root `layout.tsx`. Required for all relative OG image URLs to resolve correctly:

```typescript
metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://awenesthomes.com')
```

Set `NEXT_PUBLIC_BASE_URL=https://yourdomain.com` in Vercel environment variables.

### Title Template

```typescript
title: {
  default: 'AweNestHomes — Luxury Vacation Rentals & Holiday Homes',
  template: '%s | AweNestHomes',
}
```

Every page sets its own `title` and the template appends the brand. Property pages produce:
> `"Luxury 3BHK Villa in Goa | AweNestHomes"`

### Property Page Dynamic Metadata Pattern

```typescript
export async function generateMetadata({ params }) {
  const property = await getProperty(params.id);
  return {
    title: `${property.title} in ${property.location.city}`,
    description: `${property.propertyType} in ${property.location.city}. ${property.bedrooms} beds · ${property.bathrooms} baths · ₹${property.pricing.basePrice}/night.`,
    openGraph: {
      images: [{ url: primaryImage.url, width: 1200, height: 630 }]
    }
  };
}
```

### OG Image for Social Sharing

- **Size:** 1200×630px (works on Facebook, LinkedIn, Twitter/X, Discord, WhatsApp, Slack)
- **Format:** JPEG preferred for property photos (<5MB)
- **Static fallback:** `/public/og-image.jpg` — use a branded image with property collage
- **Dynamic:** Property pages use the primary listing photo as the OG image
- Add a default `/public/og-image.jpg` (1200×630px branded image) for pages without a photo

### Twitter / X Cards

Always set both `og:` and `twitter:` tags. Platforms fall back differently.

```typescript
twitter: {
  card: 'summary_large_image',
  site: '@awenesthomes',    // Add your Twitter handle
  creator: '@awenesthomes',
}
```

---

## 5. Technical SEO Checklist

### `robots.ts`

Disallow private/authenticated routes from crawling:

```
/host/*
/bookings/*
/profile/*
/auth/*
/become-a-host/managed-onboarding/*
/unauthorized
```

Allow everything else. Include sitemap URL.

### `sitemap.ts`

- Static routes: `/`, `/become-a-host`
- Dynamic: All published properties fetched from DB
- Set `lastmod` to property `updatedAt`
- Set `priority`: Homepage = 1.0, Properties = 0.8, Static = 0.6
- Set `changefreq`: Properties = `weekly`, Homepage = `daily`

### Canonical URLs

Next.js App Router automatically adds canonical tags when `metadataBase` is set. No extra config needed. Verify with View Source that `<link rel="canonical">` appears.

### URL Structure

Current: `/properties/[id]` — MongoDB ObjectId in URL.

**Consider (future improvement):** `/properties/[city]/[slug]` e.g. `/properties/goa/luxury-villa-calangute`
- Better for SEO (keywords in URL)
- Better for UX
- Requires slug field in Property model + redirect from old URLs

### Structured URL slugs (future)

```typescript
// In Property model, add:
slug: { type: String, unique: true }
// Generate: "luxury-3bhk-villa-goa-calangute"
```

### `<html lang="en">`

Already set in root layout ✅

### Image alt tags

All `<Image>` components must have descriptive `alt` text. Property images should use:
```
alt={`${property.title} - ${room description}`}
```

### `noindex` for private pages

Auth, profile, booking, and host pages should not be indexed:

```typescript
// In auth/layout.tsx, bookings/layout.tsx, host/layout.tsx, profile/layout.tsx
export const metadata = {
  robots: { index: false, follow: false }
};
```

---

## 6. Vercel Free Tier & ISR Strategy

### Free Tier Limits (2026)

| Resource | Limit |
|----------|-------|
| Serverless Function Invocations | 1M/month |
| Edge Function Requests | 1M/month |
| Bandwidth | 100GB/month |
| Image Transformations | 5,000/month |
| Active CPU Time | 4 hours/month |

### ISR Implementation Plan

Every property page that served dynamically is a serverless function invocation. With ISR, it becomes a cached static page until content changes.

```typescript
// In property [id] page — add at top level:
export const revalidate = 3600; // Revalidate at most every hour

// When a property is updated in host/properties/[id]/edit/actions.ts:
import { revalidateTag } from 'next/cache';
revalidateTag(`property-${propertyId}`);
revalidateTag('properties-list');
```

```typescript
// Wrap DB calls with cache tags:
import { unstable_cache } from 'next/cache';

const getPropertyCached = unstable_cache(
  async (id: string) => getProperty(id),
  ['property'],
  { tags: [`property-${id}`], revalidate: 3600 }
);
```

### What to Make Static vs Dynamic

| Page | Strategy | Why |
|------|----------|-----|
| Homepage | ISR, `revalidate: 300` | Featured listings change occasionally |
| `/properties/[id]` | ISR, `revalidate: 3600` | Property details rarely change hourly |
| `/become-a-host` | Static | Never changes |
| `/host/*` | Dynamic (always) | User-specific data |
| `/bookings/*` | Dynamic (always) | Real-time booking data |
| `/auth/*` | Dynamic (always) | Auth flows |

### Image Optimization Budget

5,000 free image transformations/month. Property listing with 10 images × consistent `sizes` prop = 3 variants per image. With 100 properties viewed = 3,000 transformations. Stay within budget by:

1. Always pass consistent `sizes` prop to `<Image>`
2. Use Cloudinary's own transformations for stored property images (they're already optimized CDN URLs — pass them directly, skip Next.js optimization)
3. Use Next.js image optimization only for local/branding images

```typescript
// For Cloudinary images — use next/image but add unoptimized for already-CDN images
// OR configure remotePatterns and let Next.js optimize responsively
```

### `generateStaticParams` for Top Properties

Pre-render the most viewed properties at build time:

```typescript
// app/properties/[id]/page.tsx
export async function generateStaticParams() {
  await dbConnect();
  const topProperties = await Property.find({ status: 'published' })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(50)
    .select('_id')
    .lean();
  return topProperties.map(p => ({ id: p._id.toString() }));
}
```

---

## 7. Local SEO

### Google Vacation Rentals (not Google Business Profile)

Standard GBP (Google Business Profile) no longer supports vacation rentals. Instead:

1. **Add JSON-LD `VacationRental` schema** per property page — Google reads this for its Vacation Rentals vertical
2. **Submit sitemap** to Google Search Console
3. **Claim pages in Google Travel** — no standard self-service; happens organically via structured data

### NAP Consistency

If AweNestHomes has a physical office, ensure consistent Name, Address, Phone across:
- Footer of website
- Google Business Profile (for the company, not properties)
- Justdial, Sulekha, IndiaMART (for India-based citations)
- Tripadvisor (if properties are listed there too)

### Location-Specific SEO

Target city-level keywords by creating location landing pages (see Programmatic SEO section):

- `awenesthomes.com/stays/goa`
- `awenesthomes.com/stays/kerala`
- `awenesthomes.com/stays/rajasthan`

Each with unique content, featured properties, and local area guide.

---

## 8. Programmatic SEO Opportunities

These are scalable page templates that generate high-intent organic traffic.

### Priority 1 — Location Pages

URL pattern: `/stays/[city]` or `/stays/[state]`

```
/stays/goa
/stays/manali
/stays/coorg
/stays/kerala
/stays/rajasthan
```

Each page:
- Pulls live properties from DB filtered by city/state
- Unique intro paragraph about the destination
- "Top things to do in [City]" section
- FAQPage schema for destination
- `LodgingBusiness` schema for each featured property

**Target keywords:** "vacation rentals in goa", "holiday homes in manali", "villas in kerala"

### Priority 2 — Property Type + Location

URL pattern: `/stays/[city]/[type]`

```
/stays/goa/villas
/stays/manali/cottages
/stays/kerala/houseboats
```

**Target keywords:** "villas in goa", "cottages in manali to rent"

### Priority 3 — Amenity Pages

URL pattern: `/stays/[amenity]`

```
/stays/pet-friendly
/stays/with-pool
/stays/beachfront
/stays/with-mountain-view
```

**Target keywords:** "pet friendly vacation rentals india", "holiday home with pool"

### Priority 4 — Neighborhood Guides

Blog-style content: `/blog/[city]-neighborhood-guide`
Long-form content (1500+ words) targeting informational intent.

---

## 9. Core Web Vitals 2025

Google's ranking factor thresholds:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5–4s | > 4s |
| **INP** (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |

### Property Listing Page — LCP Optimization

The primary property photo is almost always the LCP element. To optimize:

```typescript
// Mark the primary image as priority (eager load, no lazy)
<Image
  src={primaryImage.url}
  alt={property.title}
  fill
  priority          // ← Critical for LCP
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
/>
```

### INP Optimization

- Keep Client Components minimal — most interaction in booking form only
- Avoid heavy libraries on initial load — dynamically import `react-datepicker`

```typescript
import dynamic from 'next/dynamic';
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });
```

### CLS Optimization

- Always set explicit `width` + `height` (or `fill` + container with set height) on all images
- Avoid injecting content above the fold after load
- Reserve space for fonts with `font-display: swap` (Next.js Google Fonts handles this)

### Measuring

- [PageSpeed Insights](https://pagespeed.web.dev/) — test property detail pages
- Google Search Console → Core Web Vitals report
- Vercel Analytics (add `@vercel/analytics` — free on hobby plan)

---

## 10. Social Sharing

### Recommended OG Image Setup

1. **Static brand image** — `public/og-image.jpg` (1200×630px)
   - Used as fallback for all pages without a photo
   - Show property collage + AweNestHomes logo + tagline

2. **Dynamic property images** — property's primary Cloudinary photo used as OG image via `generateMetadata`
   - Already implemented in `/properties/[id]`

### Platform Preview Sizes

| Platform | Displayed Size | Min Size |
|----------|---------------|----------|
| Facebook / Meta | 1200×630 | 600×315 |
| Twitter / X | 1200×628 | 800×418 |
| LinkedIn | 1200×627 | 1200×627 |
| WhatsApp | 400×400 (cropped) | 300×300 |
| Discord | 1200×630 | — |
| iMessage | 1200×630 | — |

### WhatsApp Sharing Note

WhatsApp crops OG images to a square center crop on mobile. Ensure the key visual (property photo or logo) is centered in the image, so it looks good at 1:1 ratio too.

### Testing Social Shares

- Facebook: https://developers.facebook.com/tools/debug/
- Twitter/X: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/
- WhatsApp: Share a URL in a chat to preview

---

## 11. Content SEO

### Target Keyword Categories

| Intent | Example Keywords | Page Type |
|--------|-----------------|-----------|
| Transactional | "book villa in goa", "rent holiday home kerala" | Property listings, location pages |
| Navigational | "awenesthomes login", "awenesthomes properties" | Homepage, auth pages |
| Informational | "best areas to stay in goa", "goa villa rental guide" | Blog, destination guides |
| Comparison | "airbnb alternative india", "vrbo alternative india" | Landing page |

### Title Tag Formula

```
[Property Type] in [City] — [Key Feature] | AweNestHomes
```

Examples:
- `"Luxury 3BHK Villa in Goa — Private Pool | AweNestHomes"`
- `"Cozy Cottage in Manali — Mountain View | AweNestHomes"`

### Meta Description Formula

```
[Property type] in [City] with [top 2 amenities]. [Bedrooms] bedrooms · [Bathrooms] bathrooms · Up to [maxGuests] guests. From ₹[basePrice]/night. Book now.
```

Keep under 160 characters.

### Description Quality

Google uses listing descriptions as source content. Encourage hosts to write:
- Minimum 150 words
- Include location name, nearby landmarks
- List key amenities in natural language
- Avoid keyword stuffing

---

## 12. Ranking Roadmap

### Month 1 — Technical Foundation (Done ✅)

- [x] Fix metadata on all public pages
- [x] Add JSON-LD schemas to property pages
- [x] Create sitemap.xml and robots.txt
- [x] Add OG tags + Twitter Cards
- [ ] Submit sitemap to Google Search Console
- [ ] Add `NEXT_PUBLIC_BASE_URL` env var in Vercel
- [ ] Create a static `public/og-image.jpg` (1200×630px)
- [ ] Add Vercel Analytics

### Month 2 — Content & Local

- [ ] Add `noindex` to auth/profile/booking/host pages
- [ ] Create location landing pages (top 5 cities)
- [ ] Write destination guides for top 3 markets
- [ ] Ensure all property descriptions > 150 words (host guidance)
- [ ] Add alt text standards for all images

### Month 3 — Rich Results & Programmatic

- [ ] Validate all JSON-LD in Rich Results Test
- [ ] Monitor Vacation Rental rich results in Search Console
- [ ] Add `generateStaticParams` for top 50 properties
- [ ] Implement ISR with `revalidateTag` across mutations
- [ ] Build property type + amenity landing pages

### Month 4+ — Scale

- [ ] Consider URL slug migration (`/properties/goa-villa-calangute`)
- [ ] Add review/rating collection system for schema data
- [ ] Explore Google Travel data feeds when > 500 properties
- [ ] Add hreflang if expanding to multiple languages
- [ ] Blog / destination guide content program

---

## Environment Variables Required

```bash
# Add to Vercel Dashboard → Project Settings → Environment Variables
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

Without this, OG images and canonical URLs won't resolve correctly.

---

## Useful Tools

| Tool | Purpose |
|------|---------|
| https://search.google.com/test/rich-results | Test JSON-LD schemas |
| https://search.google.com/search-console | Monitor indexing, Core Web Vitals |
| https://pagespeed.web.dev/ | Test Core Web Vitals |
| https://developers.facebook.com/tools/debug/ | Debug OG tags |
| https://cards-dev.twitter.com/validator | Debug Twitter Cards |
| https://www.linkedin.com/post-inspector/ | Debug LinkedIn preview |
| https://schema.org/VacationRental | Full VacationRental schema reference |
| https://developers.google.com/search/docs/appearance/structured-data/vacation-rental | Google's vacation rental schema guide |
