import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  // useSearchParams() inside LoginForm/GoogleButton requires a Suspense
  // boundary during prerendering.
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
