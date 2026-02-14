# CivicPulse — All Changes Made

## 🔧 Backend Bug Fixes (4 files)

### 1. `server/controllers/issueController.js` — 6 fixes

| Fix | What was wrong | What I changed |
|-----|---------------|----------------|
| `snapshot.empty` → `!snapshot.exists` | `deleteByIssueId` and `updateProgress` used `.empty` on a single document get — `.empty` only works on query snapshots | Changed to `!snapshot.exists` |
| `async forEach` → `db.batch()` | `deleteById` used `forEach(async doc => ...)` — forEach doesn't await promises, so deletions fired but never completed before the response was sent | Replaced with Firestore batch write |
| Missing `catch (error)` | `getAllIssuesByDepartment` and `getHeatmapData` had `catch {}` without `(error)` — the `error` variable on the next line was undefined, causing a **ReferenceError crash** | Added `(error)` parameter |
| Map key type mismatch | `getClearanceStatistics` initialized Map with string keys `'1','2','3'` but Firestore stores `progress` as integers — keys never matched, dashboard always showed 0/0/0 | Changed to integer keys `1, 2, 3` and added proper conversion for JSON output |

### 2. `server/controllers/adminController.js` — 1 fix

- Same `async forEach` fire-and-forget pattern in `deleteById` — when deleting a user, their issues weren't actually deleted before returning → **replaced with `db.batch()`**

### 3. `server/controllers/userController.js` — 1 fix

- `sendIp` **never sent a response** on the success path — every page load caused a 30-second hanging request → **added `res.status(200).send("OK")`**
- Also fixed the `async forEach` for the update path → **replaced with `Promise.all`**

### 4. `server/routes/issuesRouter.js` — route reorder

- `GET /heatmap/getData` and `GET /department/:dep` were defined **after** `GET /:id` — Express matched them to the wildcard first (e.g., `id = "heatmap"`) → **moved specific routes above the `/:id` wildcard**

---

## 🔥 Firebase Setup (3 new files)

| File | Purpose |
|------|---------|
| `client/.env` | Firebase SDK config (apiKey, authDomain, projectId, etc.) for the frontend |
| `server/.env` | Firebase Admin SDK service account credentials for the backend |
| `firestore.rules` + `firebase.json` | Firestore security rules allowing authenticated users to create/read/update their own data — deployed via `firebase deploy --only firestore:rules` |

---

## 🛠️ Infrastructure

- Installed Firebase CLI via `npx firebase-tools`
- Created web app `civicpulse-web` on Firebase project `civicpulse-6dbdf`
- Ran `npm install` in the `server/` directory
- Deployed Firestore security rules (the default rules were blocking all client writes, which caused the "Missing or insufficient permissions" error during registration)

---

**No client-side code was modified** — all fixes were server-side. The client code was already correct; it just couldn't talk to Firestore/backend properly because of the backend bugs and missing configuration.
