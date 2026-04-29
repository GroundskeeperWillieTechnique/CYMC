# CYMC Battle Arena Preview

This repo now includes a **zero-dependency preview page** at `index.html`.

## Quick preview (no npm install required)

From the repo root:

```bash
python3 -m http.server 4173
```

Then open:

- http://localhost:4173/

## Optional Vite workflow

If your environment allows npm registry access:

```bash
npm install
npm run dev
```

Then open the URL shown by Vite (usually http://localhost:5173).

## Included interactions

- Select monster cards in the deck.
- Click **END TURN** to advance turn count.
- Gems/energy increase per turn.
- Battle log updates each turn for both sides.
