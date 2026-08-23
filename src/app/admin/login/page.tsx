import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-foreground-muted">Chargement…</p>}>
      <LoginForm />
    </Suspense>
  );
}
