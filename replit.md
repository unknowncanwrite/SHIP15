# ShipView - Shipment Management Application

## Overview
A shipment management application that tracks shipments, notes, and contacts with audit logging capabilities.

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: MongoDB Atlas (via Mongoose)
- **File Storage**: Supabase Storage ('documents' and 'images' buckets)
- **Deployment**: Vercel (serverless functions)

## Vercel Deployment

### Required Environment Variables
Set these in Vercel project settings:
- `MONGODB_URI` - MongoDB Atlas connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### Deployment Steps
1. Push code to GitHub repository
2. Connect Vercel to the GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy

### Project Structure for Vercel
- `/api` - Serverless API functions
- `/client` - Frontend React application
- `vercel.json` - Vercel configuration

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
