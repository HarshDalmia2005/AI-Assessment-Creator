# Frontend - AI Assessment Creator

This frontend is built with Next.js, TypeScript, and Zustand.

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Environment (optional)

Set websocket URL to reflect live generation state updates:

```bash
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
```

If this variable is not set, the UI still works and marks socket as `disconnected`.

## Current flow

1. Fill assignment details in the form.
2. Form validation prevents empty/negative/invalid values.
3. Frontend converts form state into a **structured prompt**.
4. Generated paper is rendered in structured sections (not raw model text).
