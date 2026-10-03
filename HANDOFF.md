# NEXT — Handoff

## Product

NEXT is a support navigator for people who do not know what to do next. It helps a person move from where they are, to where they want to go, through what they already have and what is holding them back, toward the support they need and one possible next step.

## Current milestone

The initial landing and story-intake screen is implemented locally. It intentionally has no AI, authentication, or database dependency yet.

## Decisions made

- The first interaction is a single, optional free-form story field.
- The call to action is disabled until the person shares some context.
- Submitting currently confirms the story is ready for the next guided step. The later AI integration will replace this local acknowledgement.
- The language uses options and invitations rather than prescriptions to preserve user agency.

## Next task

Define the structured journey contract for the AI response: current situation, goal, barriers, strengths, possible directions, support needed, and one possible next step. Then add a server-side route that validates and returns that shape.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Proposed future data model

Do not create database tables before the AI response contract has been finalized. The likely first persistent record is a `journey` containing `original_story`, the structured fields above, a user identifier, and timestamps. Any Supabase table holding journey data must use Row Level Security.
