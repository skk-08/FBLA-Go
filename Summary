# FBLAgo — Claude Code Instructions

## Project Overview

**App Name:** FBLAgo
**Tagline:** "Your FBLA. All in one place."
**Purpose:** Centralizes the FBLA member experience — events, chapter communication, deadlines, rubrics, and member ID — in one cross-platform mobile app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo |
| Language | JavaScript, JSX, CSS-in-JS |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| State Management | Zustand |
| Backend / Auth / DB | Supabase (Postgres) |
| Design Token Export | Tokens Studio (Figma plugin) |
| Live Testing | Expo Go / Android Emulator |
| Architecture Pattern | MVVM (Model-View-ViewModel) |

---

## Design System

### Colors
```js
export const colors = {
  primary:       '#1A237E',  // Dark navy — headers, cards, tab bar
  accent:        '#E6A800',  // Gold/amber — primary CTAs, buttons
  blue2:         '#3949AB',  // Medium blue — secondary buttons (Scan ID, etc.)
  white:         '#FFFFFF',
  surface:       '#F5F5F5',  // Light gray — card/input backgrounds
  muted:         '#9E9E9E',  // Gray placeholder text
  error:         '#D32F2F',  // Validation errors, scores
  success:       '#2E7D32',
  border:        '#283593',
  profileHeader: '#7B8FC4',  // Blue-gray — member profile screen header
}
```

### Typography
- **Font:** System default (San Francisco / Roboto)
- **Bold** → headers, card titles, section labels
- **Regular** → body text, descriptions, placeholders
- Follow Google Material Design 3: https://m3.material.io

### Spacing & Radius
```js
spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }
radius  = { card: 8, modal: 12, pill: 24 }
fontSize = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, xxl: 24, h1: 32 }
```

### Logo
- Use `assets/fblago-logo.png` — **never** `assets/icon.png` (blank Expo template)
- Logo appears as image on all auth screens and tab headers
- On splash: logo image + "FBLA" bold white large + "GO" italic white below

---

## Architecture — MVVM

Three independently testable modules:

1. **Authentication Module** — login, member profiles, encrypted ID storage
2. **Data/API Module** — announcements, event info, planner sync (Supabase)
3. **UI Component Library** — all reusable interface elements

```
/app
  /(auth)
    login.jsx           <- 2-step: landing + form
    signup.jsx          <- 4-step: email/pass → name/school/role → photo → interests
  /(tabs)
    _layout.jsx         <- Custom tab bar with raised home button
    index.jsx           <- Dashboard
    messaging.jsx       <- Messages list + chat
    planner.jsx         <- CalendarList multi-month + Add Entry
    my-event.jsx        <- Event Details: Current Events / Scores tabs
    profile.jsx         <- Member profile (TAB — visible in nav bar)
    settings.jsx        <- Account Settings (HIDDEN tab, href: null)
    social-hub.jsx      <- FBLA Social Hub WebView (HIDDEN)
    notifications.jsx   <- Notification Center (HIDDEN)
    chapter-announcements.jsx (HIDDEN)
    id-upload.jsx       <- ID Upload/Access (HIDDEN)
    event-information.jsx (HIDDEN)
    event-detail.jsx    <- Per-event archives + rubric (HIDDEN)
    achievement.jsx     <- Social share screen (HIDDEN)
  onboarding.jsx        <- Splash screen
  verify.jsx            <- Email verification
/components             <- Reusable UI Component Library
/viewmodels             <- Business logic, Supabase calls (NEVER edit unless changing logic)
/models                 <- Data access (NEVER edit unless schema changes)
/constants
  theme.js              <- Colors, typography, spacing — source of truth
  fblaEvents.js         <- FBLA event category lists (static)
/store
  authStore.js          <- session, user, profile, sessionLoading
  uiStore.js            <- notificationCount, isDarkMode, globalToast
/lib
  supabase.js           <- Supabase client — DO NOT EDIT
supabase_schema.sql     <- Full DB schema + migrations
```

---

## CRITICAL: Hidden Tab Routing Pattern

All screens that need the bottom tab bar visible BUT are not in the tab strip use `href: null` in `_layout.jsx`:

```jsx
<Tabs.Screen name="notifications" options={{ href: null }} />
```

Navigate to them via: `router.push('/(tabs)/notifications')` — NOT `router.push('/notifications')`.

**Never** use root-level stack pushes for screens that should show the tab bar. Always push into the `/(tabs)/` group.

---

## Tab Bar Layout

```
[Messages]  [Planner]  [🏠 HOME]  [Events]  [Profile]
                        (raised)
```

- Background: `#1A237E`
- Active tint: `#fff`; Inactive tint: `#7A9BB5`
- Home: white filled circle, raised 26px, house icon in navy
- Unread badge on Messages tab (from `uiStore.notificationCount`)

---

## Auth Flow

```
onboarding splash (2.5s) → login landing → login form
                         → signup (email/pass → 1/3 → 2/3 → 3/3) → tabs
```

- `AuthGuard` in `app/_layout.jsx` guards all routes
- Only redirect to `/(tabs)` when `profile?.onboarding_complete === true`
- Signup saves `role` (member/officer/advisor) to `profiles.role`
- `completeProfile()` in `useAuthViewModel.js` does the Supabase upsert

---

## Supabase Backend

```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)
```

**Tables:** `users`, `profiles`, `events`, `announcements`, `todos`, `calendar_events`, `messages`, `notifications`, `admin_actions`

**profiles columns include:**
- `full_name`, `chapter_name`, `chapter_id`, `grade`, `role`
- `bio`, `interests` (text[]), `links` (jsonb)
- `photo_url`, `member_id_url`, `onboarding_complete`

**Security:**
- Member ID photos: encrypted at rest (Supabase storage)
- Auth: school email + password
- RLS policies on all tables
- Role-based access: `member` / `officer` / `advisor` / `admin`

**Run migrations** in Supabase Dashboard → SQL Editor using `supabase_schema.sql`.

---

## Input Validation Rules

| Type | Rule |
|---|---|
| Syntactical | Email format, password 8+ chars with uppercase/symbol/number, no empty required fields |
| Semantic | Account exists on login, unique email on signup, valid school name, role must be member/officer/advisor |

Show inline red error messages (`colors.error`) below each invalid field. Password strength validator shows live checkmarks during signup.

---

## Screen-by-Screen Specifications

### Auth Screens (dark navy `#1A237E` background throughout)

**Splash (onboarding.jsx)**
- Logo image + "FBLA" bold white 48px + "GO" italic white 40px
- Taps or 2.5s timeout → marks seen → login

**Login Landing (login.jsx step 1)**
- Logo centered upper half
- "Login" bold white 34px
- Gold pill "Login with school email" → step 2
- Bottom: "Didn't have an account? [Sign Up]" yellow underlined

**Login Form (login.jsx step 2)**
- "Login" bold white heading
- Gray inputs: "Enter Your School Email", "Enter Your Password"
- "Forgot Password?" gold underlined link
- Gold pill "Sign In"
- FBLA logo watermark bottom-right

**Create Profile 1/3 (signup.jsx step 1)**
- Back arrow, "Create Your Profile" bold white
- 4 gray inputs: first name, last name, school, role (dropdown: member/officer/advisor)
- Gold "Next" pill + "1/3" counter + FBLA watermark

**Create Profile 2/3 (signup.jsx step 2)**
- "Add Photo" heading
- Large gray circle 220px with camera icon (shows photo if selected)
- "take photo" and "choose from gallery" gray rows with icon buttons
- Gold "Next" pill + "2/3" + "Skip this step" link + FBLA watermark

**Create Profile 3/3 (signup.jsx step 3)**
- "Personalize & Your Interests" heading
- Gold subtitle "select up to 4"
- 3×3 grid: Marketing, Finance, Public Speaking, Entrepreneurship, Business Law, Coding, UX Design, Hospitality, Accounting
- Selected tile: gold fill (not navy)
- Gold "Complete member profile setup" pill + "3/3"

### Main App Screens (white backgrounds, dark navy headers)

**Dashboard (index.jsx)**
- Dark navy header: FBLA logo + "FBLA" text
- Dark navy welcome card: "Welcome [FirstName]!" + gear (→ settings) + bell with badge (→ notifications)
- 2-column card grid (3 rows):
  - Row 1: *Competitive Events* (navy, gold progress bar, %) | *To Do* (gray, bullet list)
  - Row 2: *Event Information & Rubrics* (gray, arrow) | *Chapter Announcements* (navy, arrow)
  - Row 3: *ID Upload/Access* (gray, arrow) | *FBLA Social Hub* (navy, arrow)

**Messages (messaging.jsx)**
- Navy header "Messages"
- Conversation rows: colored avatar circle (initials) + name bold + preview + red unread dot
- Chat view: navy header with back+avatar+name, gray bubbles left / navy bubbles right, gray input bar

**Planner (planner.jsx)**
- Navy "Planner" header
- `CalendarList` (multi-month scrollable, not single-month `Calendar`)
- "Add Entry" navy rounded button bottom-right
- Add Entry modal: Activity Date (date picker), Activity Description (multiline), Share to Members/Groups (search), "Show in To-Do on Dashboard" toggle, Save & Close / Cancel

**Event Details (my-event.jsx)**
- Navy "Event Details" header
- Gray search bar
- "Current Events" | "Scores" tabs (underlined active)
- Red month label (e.g., "April 2026")
- Current Events: gray cards, event name bold, conference+date+location, navy "Check In" button
- Scores: same cards, score in red, navy "more" button

**Member Profile (profile.jsx — tab)**
- `profileHeader` (#7B8FC4) background upper section: avatar circle (initials or photo), name bold white, role+chapter subtitle
- White rounded-top card body: About Me, Skills & Interests (gray pills), Links (blue underlined), Upload Member ID button, Account Settings button (navy)

**Account Settings (settings.jsx — hidden tab)**
- White background, plain back arrow + "Account Settings" dark title
- Sections with gray icons + row labels:
  - Account: Edit profile, Security, Notifications, Privacy
  - Support & About: My Events, Help & Support, Terms and Policies
  - Cache & cellular: Free up space, Data Saver
  - Actions: Report a problem, Add members, Log out (red text)

**Notification Center (notifications.jsx — hidden tab)**
- Navy "Notification\nCenter" header (2 lines)
- "Mark all as read" blue2 pill button top-right
- Gray rounded cards: navy circle avatar + title bold + subtitle + time right-aligned
- Types: New Message, New Announcement, Reminder

**Chapter Announcements (chapter-announcements.jsx — hidden tab)**
- Navy "Chapter\nAnnouncements" header
- "Current" | "Archived" underlined tabs + navy "+" circle button (officers/advisors only)
- Cards: navy header strip + gray body + dark circle author avatar bottom-right + "Posted: [date]"

**Event Information (event-information.jsx — hidden tab)**
- Navy "Event Information" header
- Gray search bar
- 3 pill tabs: Presentation Events | Objective Testing | Role play Events (active = navy filled)
- Scrollable blue underlined event links → navigate to `/(tabs)/event-detail`

**Event Detail (event-detail.jsx — hidden tab)**
- Navy "Event Information" header + event name below in navy bold
- Two large gray cards: clock icon + "Event Archives" | checklist icon + "Event Rubric"

**ID Upload (id-upload.jsx — hidden tab)**
- Navy "ID Upload/Access" header
- `blue2` (#3949AB) rounded button: camera icon + "Scan Your ID"
- Large gray rectangle: "Tap to View ID" (shows image if uploaded)

**FBLA Social Hub (social-hub.jsx — hidden tab)**
- Navy "FBLA Social Hub" header
- "Latest Updates" bold dark label
- WebView → `https://www.instagram.com/fbla_pbl/`
- "Open in App" navy pill button at bottom

**Achievement / Social Share (achievement.jsx — hidden tab)**
- Navy "Congratulations!" header
- White body: "You Placed [X] in [Event]!" navy bold
- Gray card with gold trophy icon (Ionicons "trophy", color #C8A000)
- "Share Your Achievement!" heading
- Share buttons: Instagram (coral #E04060), X (black), Snapchat (yellow #FFFC00)

---

## Scoring Priorities

| Item | Points |
|---|---|
| Planning Process | 10 |
| Addresses Prompt | 10 |
| Presentation Organization | 10 |
| Confidence / Delivery | 10 |
| Q&A | 10 |
| Guidelines Adherence | 10 |
| Classes/Modules/Components | 5 |
| Architectural Patterns (MVVM) | 5 |
| Innovation & Creativity | 5 |
| UX Design | 5 |
| Intuitive UI | 5 |
| Icons / Graphical Elements | 5 |
| Input Validation | 5 |
| Social Media Integration | 5 |
| Data Handling & Storage | 5 |
| Documentation & Copyright | 5 |
| **Total** | **110** |

---

## Code Quality Rules

- Functional components + hooks only — no class components
- Zustand for global state — do not use React Context for auth/notifications
- MVVM: ViewModels in `/viewmodels/`, UI in `/app/` + `/components/`, data in `/models/` + `/lib/`
- Keep StyleSheet styles at bottom of each file (CSS-in-JS pattern)
- App must run standalone with zero programming errors
- Do not introduce dark mode complexity unless explicitly requested — mockups are light-mode only
- Do not add features beyond what the mockups show — no gold-plating
- Match Figma mockups precisely — pixel-perfect UI fidelity is the goal

---

## Admin Moderation (Messaging)

- Advisers have `advisor` role with visibility into all chapter messaging
- Admins can soft-delete messages (sets `is_deleted = true`, never hard delete)
- Long-press a group message → delete modal (advisor/admin only)
- No automated moderation — human decision only
- Stored in `messages` table with `deleted_by` FK + `admin_actions` audit log

---

## Known Quirks & Gotchas

- **Supabase dev mode:** `signUp` with existing email may return existing session silently — `createAccount()` guards against this
- **CalendarList not Calendar:** Planner uses `CalendarList` for scrollable multi-month view. Use `key={dark ? 'dark' : 'light'}` to force re-render on theme toggle
- **Logo:** Always `fblago-logo.png`, never `icon.png`
- **Hidden tab navigation:** Use `router.push('/(tabs)/notifications')` not `router.push('/notifications')`
- **Profile as tab:** `app/(tabs)/profile.jsx` is the member profile tab — `app/profile.jsx` at root level is legacy/unused
- **Settings as hidden tab:** `app/(tabs)/settings.jsx` with `href: null` — navigate via `router.push('/(tabs)/settings')`
- **Signup role field:** Defaults to `'member'`, dropdown shows member/officer/advisor, saved to `profiles.role`
