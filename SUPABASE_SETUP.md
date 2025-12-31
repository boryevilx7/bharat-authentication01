# Supabase Setup Instructions

Follow these steps to set up Google Authentication with Supabase:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: Bharat Authentication (or any name you prefer)
   - Database Password: (create a strong password)
   - Region: Choose the closest to your users
5. Click "Create new project" and wait for it to initialize

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the "Settings" icon (gear icon)
2. Go to "API" section
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## 3. Configure Environment Variables

1. In the project root directory, create a file named `.env.local`
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Set Up Google OAuth

### A. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - `http://localhost:5175/auth/v1/callback` (for local development)
   - Copy your **Client ID** and **Client Secret**

### B. Configure Google OAuth in Supabase

1. In your Supabase project, go to "Authentication" > "Providers"
2. Find "Google" in the list and click to expand
3. Enable Google provider
4. Enter your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
5. Click "Save"

### C. Configure Redirect URLs

1. In Supabase, go to "Authentication" > "URL Configuration"
2. Add your site URL:
   - For production: `https://your-domain.com`
   - For development: `http://localhost:5175`
3. Add redirect URLs (if needed for additional domains)

## 5. Enable Email/Password Authentication (Optional)

If you also want to support email/password login:

1. In Supabase, go to "Authentication" > "Providers"
2. Make sure "Email" is enabled
3. Configure email templates if needed in "Authentication" > "Email Templates"

## 6. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Click the "Login" button on your landing page
3. Try logging in with:
   - **Google OAuth**: Click "Continue with Google"
   - **Email/Password**: Enter email and password, then click "Sign in with Email"

## 7. User Management

- View all users in Supabase: Go to "Authentication" > "Users"
- All users who sign in (via Google or email) will be automatically stored in your Supabase database
- Users who sign in with Google will automatically have an account created

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check that your `.env.local` file has the correct credentials
2. **Google OAuth not working**: Verify redirect URIs match exactly in Google Cloud Console
3. **CORS errors**: Make sure your site URL is configured in Supabase URL Configuration
4. **Email not sending**: Configure SMTP settings in Supabase (or use Supabase's built-in email service)

### Need Help?

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Auth Guide: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- Google OAuth Setup: [https://supabase.com/docs/guides/auth/social-login/auth-google](https://supabase.com/docs/guides/auth/social-login/auth-google)
