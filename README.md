# Stock Market Predictor Duel

A competitive platform where users can challenge AI in stock market prediction duels. Create brackets, track performance, and prove humans still beat machines!

## Features

- AI vs Human bracket competitions
- Real-time performance tracking
- Multiple AI personalities with different trading styles
- Responsive mobile-first design
- Supabase backend integration

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ and npm/bun installed
- Supabase account with a project created
- Supabase URL and API keys

### 2. Installation

```sh
# Clone the repository
git clone <REPO_URL>

# Navigate to the project directory
cd market-predictor-duel

# Install dependencies
npm install

# Create a .env file for environment variables
cp .env.example .env
```

### 3. Database Setup

This project requires a Supabase database with specific tables for brackets, subscriptions, and prediction patterns. You can check the database status by:

1. Start the development server: `npm run dev`
2. Navigate to: http://localhost:8080/app/test-db
3. Click "Check Connection & Tables" to verify database status

If tables are missing, you need to apply the migrations:

1. Update the `apply-migrations.js` file with your Supabase Service Role Key
2. Run: `node apply-migrations.js`

Alternatively, you can manually execute the SQL files found in the `supabase/migrations` directory:

- `20250322_add_prediction_patterns.sql`
- `20250323_add_brackets_table.sql`
- `20250323_add_subscription_tables.sql`
- `20250323_add_prediction_pattern_functions.sql`

### 4. Environment Configuration

Update your `.env` file with the following:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=your-api-url
```

### 5. Development

Start the development server:

```sh
npm run dev
```

The application will be available at: http://localhost:8080

## Technologies Used

- Vite
- TypeScript
- React
- Framer Motion for animations
- Supabase for backend
- shadcn-ui components
- Tailwind CSS
- Lucide icons

## Project Structure

- `/src/components` - Reusable UI components
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and services
- `/src/pages` - Application pages
- `/src/integrations` - External service integrations
- `/supabase` - Supabase migrations and functions
