# Firebase Setup for Gujarat Sentinel Nexus

## Overview
This guide sets up Firebase infrastructure for the Gujarat Sentinel Nexus hackathon project. We use:
- **Firebase Authentication** (Email/Password)
- **Cloud Firestore** (Database)
- **Firebase CLI** (Local development)

This setup creates the backend infrastructure only. Frontend integration happens in Phase 3.

---

## Prerequisites
- Google account
- Node.js and npm installed
- Git repository initialized

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `gujarat-sentinel-nexus` (or similar)
4. Accept terms and click **"Create project"**
5. Wait for project creation to complete
6. Note your **Project ID** (you'll need it)

---

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, select **Email/Password**
4. Click **"Enable"** and toggle **Email/Password** to ON
5. Click **"Save"**

---

## Step 3: Create Cloud Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose region closest to your location (e.g., `asia-south1` for India)
4. Select **"Start in test mode"** (for development/hackathon)
5. Click **"Create"**
6. Wait for Firestore to initialize

---

## Step 4: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

---

## Step 5: Connect Local Repository to Firebase Project

1. Navigate to your repository folder:
```bash
cd path/to/gujarat-sentinel-nexus
```

2. Login to Firebase:
```bash
firebase login
```
   - Browser opens, authorize with your Google account
   - Return to terminal (login complete)

3. Initialize Firebase in your project:
```bash
firebase init
```
   - Select features: **Firestore** (space to select, enter to confirm)
   - Choose existing project: Select your `gujarat-sentinel-nexus` project
   - Use default `firestore.rules` and `firestore.indexes.json` paths
   - Do NOT overwrite existing files

4. This creates `firebase.json` in your repository root

---

## Step 6: Firebase Web Configuration

Your web app will need Firebase configuration credentials. These will be added in Phase 3:

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **Your apps**, click **Web app icon** (`</>`)
3. Register web app with name `Gujarat Sentinel Nexus`
4. Copy the Firebase config object (contains API key, project ID, etc.)
5. Keep this safe—you'll add it to `js/config.js` in Phase 3

**Example config structure (DO NOT commit actual values):**
```javascript
// js/config.js (Phase 3)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

---

## Step 7: Firestore Collections Schema

The following collections will be created in Phase 4+. Document structure is documented in `firebase/firestore-schema.txt`.

**Collections to create later:**
- `users` — User accounts and department assignments
- `vehicles` — Watchlist vehicles
- `cameras` — CCTV camera registry
- `alerts` — System alerts
- `vehicle_events` — Vehicle sightings/detections
- `audit_logs` — User action history

---

## Step 8: Security Warning

⚠️ **IMPORTANT: Secrets Management**

- ✅ `.gitignore` already excludes `.env` files
- ❌ **NEVER** commit `firebaseConfig` with real API keys
- ❌ **NEVER** commit Firebase private keys or service accounts
- ✅ Store Firebase config in `.env` file (which is ignored by git)
- ✅ Environment variables are loaded at runtime in Phase 3

---

## Step 9: Verify Setup

### Check Firebase CLI connection:
```bash
firebase projects:list
```
Should show your `gujarat-sentinel-nexus` project.

### Check Firestore is accessible:
```bash
firebase firestore:list-collections
```
Should show no errors (database is empty for now).

### Check Firebase Console:
- Navigate to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Go to **Build** → **Firestore Database**
- Database should be in "test mode" and ready

---

## Next Steps (Phase 3)

Once Firebase is set up:
1. Create `js/config.js` with Firebase configuration
2. Add Firebase SDK to HTML files
3. Implement user authentication
4. Test login/logout functionality

---

## Troubleshooting

**"firebase: command not found"**
- Run: `npm install -g firebase-tools`

**"No Firestore database found"**
- Go to Firebase Console → Firestore and create database

**"Authentication not enabled"**
- Go to Firebase Console → Authentication → Sign-in method
- Enable Email/Password

**"Can't connect to Firebase project"**
- Run: `firebase login` again
- Run: `firebase init` and select correct project

---

## References
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
