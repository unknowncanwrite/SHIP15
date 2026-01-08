# ShipView - Shipment Management Application

## Overview
A shipment management application that tracks shipments, notes, and contacts with audit logging capabilities.

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Supabase PostgreSQL (via Drizzle ORM)
- **File Storage**: Supabase Storage
- **Deployment**: Vercel (serverless functions) or Render

## Vercel/Render Deployment

### Required Environment Variables
Set these in Vercel/Render project settings:
- `SUPABASE_DATABASE_URL` - Supabase PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL (e.g., https://xxx.supabase.co)
- `SUPABASE_ANON_KEY` - Supabase anonymous/public API key

### Deployment Steps
1. Push code to GitHub repository
2. Connect Vercel/Render to the GitHub repository
3. Configure environment variables in dashboard
4. Deploy

### Project Structure for Vercel
- `/api` - Serverless API functions
- `/client` - Frontend React application
- `vercel.json` - Vercel configuration

## Supabase Storage Setup
Documents uploaded to shipments are stored in Supabase Storage:
1. Go to Supabase dashboard → Storage
2. Create a bucket named `shipment-documents`
3. Set it as a **Public bucket** for easy file access
4. Get the **service_role** key from Project Settings → API → Service role key
5. Add `SUPABASE_SERVICE_ROLE_KEY` environment variable to your deployment (Render/Vercel)
6. Files are uploaded with unique timestamps to prevent conflicts

**Security Note:** The service role key bypasses RLS and should only be used server-side (never in client code).

## GitHub Sync
- Repository: https://github.com/unknowncanwrite/ship
- Method: Git CLI with Personal Access Token (classic) with `repo` scope

## API Routes
- `GET/POST /api/shipments` - List/create shipments
- `GET/PATCH/DELETE /api/shipments/[id]` - Single shipment operations
- `GET /api/shipments/[id]/audit-logs` - Shipment audit history
- `GET/POST /api/notes` - List/create notes
- `PATCH/DELETE /api/notes/[id]` - Note operations
- `GET/POST /api/contacts` - List/create contacts
- `PATCH/DELETE /api/contacts/[id]` - Contact operations
- `POST /api/files/upload` - Upload file to Supabase Storage
- `GET/DELETE /api/files/[id]` - Get/delete file from Supabase Storage

## Database Schema
Tables managed via Drizzle ORM:
- `shipments` - Main shipment records with JSON fields for complex data
- `notes` - Quick notes
- `contacts` - Contact information
- `audit_logs` - Change history for shipments
