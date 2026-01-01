# Bharat Authentication

A secure authentication platform with phishing and malware scanning capabilities.

## Features

- User authentication with email/password and Google OAuth
- Security dashboard for threat monitoring
- URL and file scanning capabilities
- Real-time threat detection
- Scan history tracking

## Tech Stack

- React 19 with TypeScript
- Vite as build tool
- Supabase for authentication and database
- Tailwind CSS for styling
- Shadcn/ui components
- Lucide React icons

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key



## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
