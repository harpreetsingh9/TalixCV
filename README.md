# TalixCV

TalixCV is a modern, minimalist, open-source resume builder focused on creating
**ATS-friendly, job-specific resumes** using a clean editor and AI-assisted
optimization.

Built for developers, designers, and professionals who care about clarity,
alignment, and results.

---

## ✨ Features

- 📝 Resume builder with live preview
- 🧠 AI-assisted summary and experience optimization
- 🎯 Job description–based resume alignment
- 📄 Clean, ATS-friendly single-column resume template
- 💾 Persistent resume storage (Supabase – PostgreSQL)
- 📱 Fully responsive (desktop & mobile)
- 🎨 Luxury, minimalist UI

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI (optional / pluggable)
- **Deployment**: Vercel (recommended)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/talixcv.git
cd talixcv
```

### 2. Install dependencies

```bash
Copy code
npm install
```

### 3. Environment variables

Create a file named `.env.local` in the root of the project and add the following:

```env
Copy code
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key_optional
```

⚠️ **Do NOT commit `.env.local` to GitHub.**

### 4. Run the development server

```bash
pnpm run dev
```

Open the app in your browser:
[http://localhost:3000](http://localhost:3000)

## 🗄 Database Setup (Supabase)

- Create a project at [https://supabase.com](https://supabase.com)
- Open the SQL Editor in the Supabase dashboard
- Run the SQL file located at:

```bash
/scripts/schema.sql
```

---

## 🔐 Authentication (MVP)

- TalixCV currently uses a local-only authentication approach for MVP speed.
- User enters their name
- A unique user ID is generated
- The user session is stored in `localStorage`
- This will be replaced with proper authentication in a future version.

---

## 🧠 Roadmap

- Resume autosave
- Job description based optimization
- AI-enhanced experience bullets
- PDF export
- Resume versioning
- Real authentication
- Hosted SaaS version

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Make your changes
4. Open a pull request

Please keep pull requests focused and clean.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Author

**Harpreet Singh**
Software Engineer

TalixCV — Craft resumes that align with the role that matters.
