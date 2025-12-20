# Environment Setup for Pathway

## Required: Aviato API
```
AVIATO_API_KEY=your_aviato_api_key_here
AVIATO_API_BASE_URL=https://data.api.aviato.co
```

## Optional: Supabase Caching (Recommended!)
Adding Supabase enables caching which:
- Saves API credits (only call Aviato once per company)
- Faster responses (database queries vs API calls)
- Better analytics on your data

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Supabase Setup Steps:
1. Create a project at https://supabase.com
2. Go to Settings > API to get your URL and anon key
3. Run the SQL schema in `supabase/schema.sql` in the SQL Editor
4. Add the environment variables to `.env.local`

