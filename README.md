# FBLA Go

> **Your FBLA. All in one place.**

FBLAgo is a cross-platform mobile application built for the **FBLA State 2025-2026 Mobile Application Development** competition. It centralizes the FBLA member experience: events, chapter communication, deadlines, rubrics, and member ID in one unified app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo |
| Language | JavaScript, JSX |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| State Management | Zustand |
| Backend / Auth / DB | Supabase (Postgres) |
| Live Testing | Expo Go |
| Architecture | MVVM |

---

## Architecture: MVVM (Model-View-ViewModel)

The app is divided into three independently testable modules:

- **Authentication Module**: login, signup, member profiles, encrypted ID storage
- **Data/API Module**: announcements, event info, planner sync via Supabase
- **UI Component Library**: all reusable interface elements

```
/app                        ← Expo Router screens (file-based routing)
  /(auth)
    _layout.jsx
    login.jsx               ← Login with syntactical + semantic validation
    signup.jsx              ← Signup with full field validation
  /(tabs)
    _layout.jsx             ← 5-tab navigation bar
    index.jsx               ← Dashboard
    my-event.jsx            ← Personalized event page
    planner.jsx             ← Interactive calendar + shared events
    messaging.jsx           ← Real-time chapter messaging
    social-hub.jsx          ← FBLA Instagram WebView
  onboarding.jsx            ← First-login walkthrough + T&C

/components
  /ui
    AppInput.jsx            ← Validated text input with inline error display
    AppButton.jsx           ← Primary (yellow) and outline button variants
    Card.jsx                ← Standard surface card wrapper
    ErrorBanner.jsx         ← Red error message block
    LoadingSpinner.jsx      ← Centered activity indicator
  /dashboard
    EventMetricCard.jsx     ← Countdown to next competition
    ToDoListCard.jsx        ← Add / check / delete todos
    EventInfoCard.jsx       ← Member's registered event summary
    AnnouncementsCard.jsx   ← Latest chapter announcements
    MemberIDCard.jsx        ← Upload / view encrypted member ID
    SocialHubCard.jsx       ← Tap-through to Social Hub tab
    NotificationBell.jsx    ← Bell icon with unread badge count
    SettingsShortcut.jsx    ← Gear icon → Settings screen
  /onboarding
    OnboardingSlide.jsx     ← Individual slide with title + body

/viewmodels                 ← Business logic, state, Supabase calls
  useAuthViewModel.js       ← Login + signup form logic and validation
  useDashboardViewModel.js  ← Aggregates data for all 8 dashboard cards
  useMyEventViewModel.js    ← Member's registered event + rubric data
  usePlannerViewModel.js    ← Calendar CRUD + bidirectional todo sync
  useMessagingViewModel.js  ← Realtime chat subscription + admin actions
  useSocialHubViewModel.js  ← Instagram deep link + WebView state
  useProfileViewModel.js    ← Load/update profile, member ID upload
  useSettingsViewModel.js   ← Account prefs, notifications, sign out
  useNotificationsViewModel.js ← Fetch + mark-read notifications
  useOnboardingViewModel.js ← Step state, T&C, completion tracking

/models                     ← Pure Supabase data-access functions
  userModel.js              ← profiles CRUD, member ID upload
  eventModel.js             ← events library, user_events, competition dates
  todoModel.js              ← todos CRUD
  announcementModel.js      ← chapter announcements
  messageModel.js           ← chat messages + realtime subscription
  notificationModel.js      ← notifications + unread count
  calendarModel.js          ← calendar_events CRUD

/constants
  theme.js                  ← FBLA brand colors, spacing, font sizes, radii

/store                      ← Zustand global state
  authStore.js              ← session, user, profile, sessionLoading
  uiStore.js                ← notificationCount, globalToast

/lib
  supabase.js               ← Supabase client (AsyncStorage session persistence)

/assets                     ← App icon, splash screen, adaptive icon
```

---

## Design System

### Colors (FBLA Brand)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#003087` | Backgrounds, headers |
| `accent` | `#FFD100` | CTAs, highlights, logo |
| `white` | `#FFFFFF` | Text, cards |
| `surface` | `#0A1F5C` | Card backgrounds |
| `muted` | `#8A9BB5` | Subdued text, placeholders |
| `error` | `#D32F2F` | Validation errors |
| `success` | `#2E7D32` | Success states |
| `border` | `#1A3A7A` | Borders on dark backgrounds |

### Typography
- Font: **Inter** (Google Fonts)
- Bold → headers, labels, section titles
- Regular → body text, descriptions

### Spacing & Radius
- Base unit: `4px` (multiples: 4, 8, 12, 16, 24, 32)
- Card radius: `8px` | Modal radius: `12px` | Pill buttons: `24px`

---

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Login + Signup (input validation) | ✅ Built |
| 2 | Onboarding (T&C + walkthrough) | ⬜ |
| 3 | Dashboard (8 components) | ⬜ |
| 4 | Navigation Bar (5 tabs) | ✅ Built |
| 5 | Member Profile | ⬜ |
| 6 | Settings | ⬜ |
| 7 | Notifications | ⬜ |
| 8 | Event Metric (countdown) | ⬜ |
| 9 | To-Do List | ⬜ |
| 10 | Event Info + Rubrics | ⬜ |
| 11 | Chapter Announcements | ⬜ |
| 12 | Member ID Upload (encrypted) | ⬜ |
| 13 | FBLA Social Hub (Instagram WebView) | ⬜ |
| 14 | In-App Messaging + Admin Moderation | ⬜ |
| 15 | Interactive Planner + Shared Calendar | ⬜ |
| 16 | My Event Page | ⬜ |

---

## Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `users` | Mirrors `auth.users`, stores role (`member` / `adviser` / `admin`) |
| `profiles` | Name, chapter, grade, photo, member ID URL, onboarding status |
| `events` | FBLA competitive events library with rubrics and scoring |
| `user_events` | Which members are entered in which events + results |
| `announcements` | Chapter news feed pushed by advisers |
| `todos` | Personal to-do items with optional calendar link |
| `calendar_events` | Personal + shared chapter calendar events |
| `messages` | Real-time chapter chat with soft-delete for moderation |
| `notifications` | Centralized notification log per user |
| `admin_actions` | Audit log of all admin moderation actions |

Row-level security is enabled on all tables. Realtime is enabled on `messages`, `notifications`, and `announcements`.

---

## Security

- Member ID photos stored in a **private** Supabase Storage bucket (`member-ids`) encrypted at rest with AES-256
- Auth via Supabase (email/password) with AsyncStorage session persistence
- Input validation on every form: **syntactical** (format/regex) + **semantic** (account exists, unique email, valid grade)
- Role-based access control: `member`, `adviser`, `admin`
- Admin moderation panel with soft-delete and audit logging
- `.env` excluded from version control — credentials never committed

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo`)
- Expo Go app on your iOS or Android device

### Setup

```bash
# Clone the repo
git clone https://github.com/skk-08/FBLAgo.git
cd FBLAgo

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your Supabase URL and anon key

# Start the development server
npx expo start
```

### Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Input Validation Rules

| Type | Rules |
|------|-------|
| **Syntactical** | Email format (regex), password ≥8 chars with uppercase + number + symbol, required fields, grade between 9–12 |
| **Semantic** | Account exists on login, unique email on signup, valid chapter name |

Inline error messages are shown in red (`#D32F2F`) below each field.

---

## Admin Moderation System

Chapter advisers hold the `adviser` role with visibility into all chapter messaging:
- Monitor conversations and flag messages
- Soft-delete messages (preserved in DB with `is_deleted: true`)
- All actions logged to `admin_actions` table with reason and timestamp
- Progressive consequence system managed manually by adviser
- Role-based access control enforced at database level via Supabase RLS

---

## Rubric Alignment

| Category | Points | How FBLAgo Addresses It |
|----------|--------|------------------------|
| Planning Process | 10 | MVVM architecture, development timeline |
| Classes/Modules/Components | 5 | 3 independent MVVM modules, reusable component library |
| Architectural Patterns | 5 | MVVM explicitly implemented |
| Innovation & Creativity | 5 | Survey-driven features, admin moderation, encrypted ID |
| UX Design | 5 | Onboarding walkthrough, intuitive nav, all 5 topic areas |
| Intuitive UI | 5 | Consistent design system, clear labels |
| Icons / Graphical Elements | 5 | FBLA brand colors, custom icon |
| Input Validation | 5 | Syntactical + semantic on all forms |
| Addresses Prompt | 10 | Profiles ✓ Calendar ✓ Resources ✓ News feed ✓ Social media ✓ |
| Social Media Integration | 5 | Instagram WebView + native deep link |
| Data Handling & Storage | 5 | Supabase encrypted auth, encrypted ID at rest, RBAC |
| Documentation & Copyright | 5 | Full sources table in planning binder |

---

## Competition Info

- **Event:** FBLA Mobile Application Development
- **Competition:** FBLA State 2025–2026
- **Presentation:** 7-minute demo + 3-minute Q&A
- **Platform:** iOS primary, Android secondary (Expo cross-platform)
- **Team:** Aditi & Srinidhi
