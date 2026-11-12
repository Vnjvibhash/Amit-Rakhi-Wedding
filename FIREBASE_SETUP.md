# Firebase Backend Setup & Deployment Guide

This guide walks you through connecting your **Royal Indian Wedding Portal** to **Firebase Authentication**, **Cloud Firestore**, **Firebase Storage**, and **Firebase Hosting**.

---

## 1. Create a Firebase Project

1. Open the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Name your project (e.g., `amit-rakhi-wedding`) and complete creation.
3. Inside **Project Overview**, click the **Web (`</>`)** icon to register a Web App.
4. Copy the `firebaseConfig` keys shown on screen.

---

## 2. Configure Environment Variables

1. In the project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Paste your Firebase Web App credentials into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
   ```
   > **Security Note:** Never put Firebase Admin SDK service account JSON keys inside `.env` or frontend code. Only public Web App config variables belong in `VITE_FIREBASE_*`.

---

## 3. Enable Firebase Services

### A. Firebase Authentication
1. Go to **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password**.
3. Go to the **Users** tab and click **Add user** to create your administrator login (e.g., `admin@amitrakhi.wedding`).
4. Copy the new user's **User UID** — you will need it in Step 4.

### B. Cloud Firestore
1. Go to **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** and select a nearby region (e.g., `asia-south1` for Mumbai).
3. Create the `admin_users` role record so your user has admin authorization:
   - Collection ID: `admin_users`
   - Document ID: `<PASTE_USER_UID_HERE>`
   - Fields:
     - `email` (string): `admin@amitrakhi.wedding`
     - `displayName` (string): `Wedding Coordinator`
     - `role` (string): `super_admin` (must be `admin` or `super_admin`)

### C. Firebase Storage
1. Go to **Build → Storage → Get started** and initialize your default bucket.

---

## 4. Deploy Security Rules & Indexes

Install the Firebase CLI globally if you haven't already:
```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your Firebase project
```

Deploy the included `firestore.rules`, `firestore.indexes.json`, and `storage.rules`:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### What the Security Rules Enforce
- **Public Read**: `wedding_settings`, `couple_details`, `family_members`, `wedding_events`, `wedding_albums`, `wedding_photos`, and `wedding_videos` are readable by all wedding guests.
- **Role-Based Admin Write**: Only authenticated users whose UID exists in `admin_users` with `role` in `['admin', 'super_admin']` can create, update, reorder, or delete wedding content.
- **Validated Guest RSVPs**: Guests can submit new documents to `guest_rsvps` with schema validation (name length, mobile format, valid attending status, integer guest count `1–25`), while only verified admins can read, update, or export all RSVPs.
- **Storage Upload Validation**: Only admins can upload media into `wedding/photos`, `wedding/events`, `wedding/family`, `wedding/couple`, `wedding/videos`, and `wedding/audio` with strict MIME type and file size enforcement.

---

## 5. Seed Initial Sample Wedding Data

1. Run the app locally: `npm run dev`
2. Visit `/admin/login` and sign in with your Firebase Admin email & password.
3. Open the **Settings & Content** tab in the Admin Dashboard and click **Seed Sample Data**.
   This writes the sample couple details, 12 wedding ceremonies, 11 photo albums, sample gallery photos, videos, and venue configuration into Cloud Firestore!

---

## 6. Deploy to Firebase Hosting

Build the production bundle and deploy:
```bash
npm run build
firebase deploy --only hosting
```
Your wedding website will be live at `https://<your-project-id>.web.app`.

