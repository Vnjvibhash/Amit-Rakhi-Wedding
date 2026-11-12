# Amit & Rakhi — Royal Indian Wedding Celebration Portal

A full-stack, responsive, traditional Indian wedding invitation and celebration management web application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Firebase** (Auth, Firestore, Storage, Hosting).

## Features

- **Digital Wedding Invitation (Home)**: Couple monogram crest, Royal Jharokha portrait frames, live Days/Hours/Minutes/Seconds countdown, ambient Indian classical raga music player, downloadable PNG/printable invitation card, WhatsApp sharing, and link copy.
- **Our Story & Family**: Detailed Bride & Groom profiles, relationship milestones timeline, and *"With the Blessings of Our Families"* directory.
- **Wedding Events**: Chronological ceremony cards (Tilak, Sagai, Matkor, Haldi, Mehendi, Sangeet, Mandapachadan, Baraat, Shubh Vivah, Kanyadaan, Vidaai, Reception) with search, status filters (`Upcoming`, `Ongoing`, `Completed`), dress codes, Google Maps navigation, and Google Calendar links.
- **Interactive Schedule & Calendar**: Monthly calendar highlighting wedding dates, date-wise list view, browser ceremony reminders, and **one-click Schedule PDF export**.
- **Photo Gallery**: 11 ceremony album categories, responsive masonry grid, lazy loading, full-screen lightbox with keyboard & button navigation, photo sharing, download controls, and mobile/desktop multi-photo upload.
- **Wedding Videos**: Supports embedded YouTube videos and Firebase Storage-hosted videos across 5 categories.
- **Venue & Travel Guide**: Embedded Google Maps, directions, nearby accommodations, valet/boat transfers, and travel instructions.
- **Guest RSVP System**: Validated attendance form with ceremony multi-select, accompanying guest count, dietary notes, and blessings saved to Firestore.
- **Admin Dashboard CMS (`/admin`)**: Secure Firebase Authentication + `admin_users` role verification, live overview metrics, Event CRUD + drag/button reordering, Album & Multi-Photo upload + caption editor, Video upload/embed manager, RSVP filtering & CSV export, Couple & Family editor, and Website Settings editor.

## Quick Start

```bash
npm install
cp .env.example .env   # Optional: add your Firebase keys (Preview Mode works out of the box)
npm run dev
```

For full Firebase setup, security rules, and deployment instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

