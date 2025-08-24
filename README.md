# THE FAST AND REAL NEWS

This is a Next.js app (App Router) styled with Tailwind and shadcn/ui.

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2. Run the development server

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Supabase Setup

This project can use Supabase for data and auth. To configure:

1. Create a project at `https://supabase.com` and copy your Project URL and anon public key.
2. Create `.env.local` and add:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Use the client from `lib/supabaseClient.ts`:

```ts
import { supabase } from '@/lib/supabaseClient'

const { data, error } = await supabase.from('articles').select('*')
```

Notes:
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- For server-only keys, use server route handlers or edge functions.
