---
name: auth-pages-shadcn
description: Build modular login/register pages with shadcn components, form validation, and toast notifications in Next.js App Router
source: auto-skill
extracted_at: '2026-06-24T16:31:52.931Z'
---

# Modular Auth Pages with shadcn

## Overview
Building authentication pages (login/register) using shadcn components with proper component separation, form validation, theme consistency, and toast notifications.

## Component Architecture

### Required shadcn Components
Install these before implementation:
```bash
npx shadcn@latest add label card sonner --yes
```

### Component Structure
Create `src/components/auth/` directory with:

1. **auth-layout.tsx** — Shared wrapper component
   - Uses `glass-elevated` or theme-specific card styling
   - Centers content with proper spacing
   - Wraps all auth pages for consistency

2. **auth-divider.tsx** — Visual separator
   - "or" divider between OAuth and email forms
   - Uses theme's border colors and muted text

3. **google-button.tsx** — OAuth button
   - Uses `react-icons/fc` for FcGoogle icon
   - Outlined button variant matching theme
   - TODO placeholder for actual OAuth integration

4. **login-form.tsx** — Login form component
   - Email and password fields with shadcn Input + Label
   - Password visibility toggle (Eye/EyeOff icons)
   - Client-side validation with error state management
   - Loading state with Loader2 spinner
   - Toast notifications on success/fail
   - Links to register and forgot-password

5. **register-form.tsx** — Registration form component
   - Student name, email, password, confirm password fields
   - Dual password visibility toggles
   - Validation: required fields, email format, password length (8+ chars), password match
   - Loading state and toast notifications
   - Link to login page

### Page Structure
Create Next.js App Router pages:
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`

Both use `<AuthLayout>` wrapper and render their respective form components.

## Key Patterns

### Form Validation
```typescript
const [errors, setErrors] = useState<Record<string, string>>({})

const validate = (email: string, password: string) => {
  const newErrors: Record<string, string> = {}
  if (!email) {
    newErrors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Enter a valid email address"
  }
  // ... more validations
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

Display errors below each field:
```tsx
{errors.email && (
  <p className="text-xs text-destructive">{errors.email}</p>
)}
```

### Password Visibility Toggle
```typescript
const [showPassword, setShowPassword] = useState(false)

<Input
  type={showPassword ? "text" : "password"}
  className="pr-10"
/>
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
>
  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
</button>
```

### Toast Notifications
Add Sonner Toaster to root layout:
```tsx
import { Toaster } from "@/components/ui/sonner"

// In layout.tsx body
<Toaster />
```

For dark-only apps, hardcode `theme="dark"` in sonner.tsx (remove next-themes dependency if not used).

Trigger toasts in form handlers:
```typescript
toast.success("Welcome back!", {
  description: "You have been logged in successfully.",
})

toast.error("Login failed", {
  description: "Invalid email or password. Please try again.",
})
```

### Theme-Aware Styling
Use existing theme classes for consistency:
- `glass-input` for form inputs
- `text-gradient` for headings
- `variant="gradient"` for primary buttons
- `border-border/50` and `bg-white/5` for subtle borders/backgrounds

### Form Submission Pattern
```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!validate(email, password)) return

  setIsLoading(true)
  try {
    // TODO: replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast.success("Success message", { description: "Details here" })
    router.push("/")
  } catch {
    toast.error("Error message", { description: "Details here" })
  } finally {
    setIsLoading(false)
  }
}
```

## Benefits
- **Modular**: Each auth component is reusable and testable
- **Consistent**: Shared layout ensures visual consistency
- **Accessible**: shadcn components provide built-in accessibility
- **User-friendly**: Toast notifications, loading states, validation feedback
- **Theme-aware**: Leverages existing design system
- **Type-safe**: Full TypeScript support with proper types

## When to Use
- Building authentication flows in Next.js App Router
- Need login/register pages with consistent theming
- Want form validation with proper error handling
- Require toast notifications for user feedback
- Using shadcn/ui component library
