# Mike OS - AI Command Center MVP

A local-first prototype for Mike's work command center.

## What it does now
- Inbox capture
- Rule-based processing into task/follow-up/note
- Today dashboard
- Projects dashboard
- Waiting On dashboard
- AI Daily Brief screen
- Saves data in browser localStorage

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000

## Build next
1. Replace `src/lib/ai.ts` with an OpenAI API route.
2. Add Supabase database tables.
3. Add Microsoft Graph API for Outlook email ingestion.
4. Add voice recording/transcription intake.

## V1 principle
Do not build a full email client yet. Build the operational layer first.
