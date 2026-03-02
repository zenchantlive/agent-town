# Project Initialization (AT-dpe) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialize a clean Next.js 15 + React 19 project structure with TypeScript and Tailwind CSS.

**Architecture:** Next.js App Router project following Vercel React Best Practices. Minimal configuration to support both the WebSocket backend and the Pixi.js frontend.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, NPM.

---

### Task 1: Initialize core project files

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`

**Step 1: Write failing test for project structure**

```bash
# In project root: /home/clawdbot/clawd/repos/agent-town
[ -f "package.json" ] && [ -f "tsconfig.json" ] && [ -f "next.config.mjs" ]
```

**Step 2: Run test to verify it fails**

Run: `ls package.json tsconfig.json next.config.mjs`
Expected: `ls: cannot access 'package.json': No such file or directory` (and others)

**Step 3: Write minimal implementation**

Create `package.json`:
```json
{
  "name": "agent-town",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.1.7",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "typescript": "5.8.3",
    "@types/node": "20.17.24",
    "@types/react": "19.0.10",
    "@types/react-dom": "19.0.4"
  }
}
```

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Config options here
};

export default nextConfig;
```

**Step 4: Run test to verify it passes**

Run: `ls package.json tsconfig.json next.config.mjs`
Expected: All files listed.

**Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.mjs
git commit -m "feat: initialize project structure"
```

---

### Task 2: Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`

**Step 1: Write failing test for CSS setup**

```bash
grep -q "@tailwind" app/globals.css
```

**Step 2: Run test to verify it fails**

Run: `ls app/globals.css`
Expected: `ls: cannot access 'app/globals.css': No such file or directory`

**Step 3: Write minimal implementation**

Install devDependencies:
```bash
npm install -D tailwindcss postcss autoprefixer
```

Create `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

Create `postcss.config.mjs`:
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

Create `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Run test to verify it passes**

Run: `grep -q "@tailwind" app/globals.css && echo "PASS"`
Expected: `PASS`

**Step 5: Commit**

```bash
git add tailwind.config.ts postcss.config.mjs app/globals.css
git commit -m "feat: configure tailwind css"
```

---

### Task 3: Verify basic Next.js build

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Step 1: Write failing test for build**

```bash
npm run build
```

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: FAIL (missing page/layout)

**Step 3: Write minimal implementation**

Create `app/layout.tsx`:
```typescript
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:
```typescript
export default function Home() {
  return <h1 className="text-3xl font-bold underline">Agent Town</h1>;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: `Route (app)  Size     First Load JS` ... `+ First Load JS shared by all  74.1 kB`

**Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: verify basic next.js build"
```
