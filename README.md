# Spades Calculator

## In order to run the app locally,

1. Clone the repository in the directory of your choice.
2. Open your Terminal and **cd** into the root directory of the project.
3. Run **npm i** to download server dependencies.
4. Run **npm start**.
5. Now your project should be viewable in your browser at **http://localhost:5173/**.

- You may be asked permission for the project to open the website in your browser. It's safe to grant that permission.

_note: This is a frontend-only application built with Vite. The development server runs on port 5173._

## Watch Live — Share to watch

The app supports **realtime play-by-phone**: the leader starts a session and shares
a link; anyone opening that link sees the live board read-only and can pick the seat
they're sitting in. State syncs to the leader's device on every change.

- Open the hamburger menu → **Share to watch**. This starts a session and shows a
  copyable link like `https://<your-host>/spades-calculator?session=<id>`.
- Send that link to the other players. On their phone they land in read-only viewer
  mode and can pick their seat from the **hamburger menu → Switch seat** modal.
- **Perspective:** the scorecard is a fixed two-column layout (Team1 | Team2). A
  viewer sitting on Team 2 sees the whole board mirrored — names, team labels, and
  every round's bids/actuals are swapped — so the board reads from that viewer's
  point of view. Team-1 viewers see the leader's view unchanged. There is no CSS
  rotation; all perspective changes happen in the data layer.
- The viewer's UI mode (the Table Round UI toggle) defaults to the leader's
  preference on first sync, but can be changed independently afterward.
- Tip: open the link in an incognito/private window to preview the viewer experience
  yourself.

### Firebase setup (required for the feature)

The realtime layer is **opt-in**. Without Firebase config the app runs as a normal
local-only PWA. To enable it:

1. Create a Firebase project and enable **Realtime Database** + **Anonymous
   Authentication** (Rules → Authentication → Sign-in method → Anonymous).
2. Copy `.env.example` to `.env` and paste your web app's `firebaseConfig` object as
   the `VITE_FIREBASE_CONFIG` value. The config is public by design — real security
   comes from the database rules.
3. Deploy the hardened rules from `firebase.rules.json` (Realtime Database → Rules).

### Security rules (`firebase.rules.json`)

Sessions are world-readable (viewers join with only the link) but **write is
leader-only**, enforced by tying writes to the leader's anonymous uid:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": "newData.child('leaderUid').val() === auth.uid"
      }
    }
  }
}
```

Any client may read any session, but only the anonymous user whose uid matches the
`leaderUid` stored on the session may write to it.

## Running Tests

To run the end-to-end (e2e) tests using Cypress, open your terminal in the project's root directory and execute:

```bash
npx cypress open
```

This will launch the Cypress Test Runner, where you can select and run your tests visually.

## Linting

The project uses ESLint for code quality and consistency. You can run the following commands:

```bash
# Fix automatically fixable linting issues
npm run lint

# Check for linting issues without fixing them
npm run lint:check
```

The project is configured to automatically run linting on staged files before commits using husky and lint-staged.
