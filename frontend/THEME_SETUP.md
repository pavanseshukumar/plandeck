# Theme Setup Documentation

This project now includes dark mode, light mode, and system theme support using `next-themes`.

## Features

- **Light Mode**: Manual light theme
- **Dark Mode**: Manual dark theme
- **System Theme**: Automatically matches your system's theme preference
- **Theme Persistence**: Your theme preference is saved and persists across page reloads and navigation
- **No Flash**: Prevents flash of wrong theme on page load with `suppressHydrationWarning`

## Implementation

### 1. Dependencies

```bash
npm install next-themes
```

### 2. Components Created

#### `components/theme-provider.js`

Wraps the Next.js ThemeProvider to enable theme functionality throughout the app.

#### `components/theme-toggle.js`

A toggle component with three buttons:

- Sun icon: Switch to light mode
- Moon icon: Switch to dark mode
- Monitor icon: Use system theme

### 3. Layout Configuration

The root layout (`app/layout.js`) is configured with:

- `suppressHydrationWarning` on the `<html>` tag to prevent hydration warnings
- `ThemeProvider` wrapping all children with:
  - `attribute="class"`: Uses class-based dark mode (adds `dark` class to `<html>`)
  - `defaultTheme="system"`: Defaults to system preference
  - `enableSystem`: Enables system theme detection
  - `disableTransitionOnChange`: Prevents transition flash when switching themes

### 4. CSS Variables

Your existing `globals.css` already includes comprehensive theme variables:

- `:root` contains all light mode color variables
- `.dark` contains all dark mode color variables

## Usage in Pages

Import and use the `ThemeToggle` component anywhere in your app:

```javascript
import { ThemeToggle } from "@/components/theme-toggle";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      {/* Your content */}
    </div>
  );
}
```

## Using Theme Programmatically

You can also use the theme hook in any client component:

```javascript
"use client";

import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}
```

## Theme Values

The `theme` value can be:

- `"light"`: Light mode
- `"dark"`: Dark mode
- `"system"`: Follow system preference

## Storage

Theme preference is automatically saved to `localStorage` and persists across:

- Page reloads
- Navigation between pages
- Browser sessions

## Testing

The theme has been tested on:

- Home page (`/`)
- Login page (`/login`)
- Theme persistence across navigation
- All three theme modes (light, dark, system)

All components properly respond to theme changes with appropriate colors from your CSS variables.
