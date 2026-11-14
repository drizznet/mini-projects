# lockIn Mobile

React Native (Expo) client for **lockIn** — sibling of [`lockedin/`](../lockedin) (web) and [`server/`](../server) (API).

## Stack

- Expo SDK 58, Expo Router (tabs)
- React 19, React Native 0.88
- TypeScript strict

## Run

```bash
cd lockedin-mobile
cp .env.example .env   # optional — defaults work for local API
npm install            # already done after create-expo-app
npm start              # then i / a / w for iOS, Android, web
```

- **iOS simulator:** `npm run ios`
- **Android emulator:** `npm run android`
- **Web:** `npm run web`

UI is aligned with the web app:

- **Today** — briefing + suggested next block (same structure as `/dashboard`)
- **Sessions** — live focus room with animated backdrop + history placeholder (`/sessions`)
- **Commitments** — list from `GET /api/lockedin/commitments` when `lockin-auth-session` is in AsyncStorage (same key as web localStorage)
- **More** — sidebar parity + **Focus room background** (gradient / pattern / solid)

Start a session from Today → opens the Sessions focus room. Backdrop choice is stored on device and matches web Settings → Appearance.

## Project layout

```
app/           Expo Router screens (routes only)
components/    Shared UI
constants/     Theme tokens
lib/           Brand, shared types (grow with web parity)
config/        Env and API base URL
```

## Related

| App | Path | Port (dev) |
|-----|------|------------|
| Web | `../lockedin` | 3500 |
| API | `../server` | 4400 |

See [`lockedin/AGENTS.md`](../lockedin/AGENTS.md) for product direction.
