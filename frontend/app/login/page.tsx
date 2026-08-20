"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { AuthShell, Field } from "@/components/auth-shell";
import { MailIcon, LockIcon, SpinnerIcon } from "@/components/icons";

/**
 * Login side der brukaren kan logge inn med epost og passord og sendast til dashboard sida ved suksess
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      const token = data.accessToken;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Innlogging feilet, vennligst prøv igjen.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Velkommen tilbake"
      subtitle="Logg inn for å fortsette til TeamBoard"
      footer={
        <>
          Ny her?{" "}
          <Link
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Opprett konto
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="email"
          label="Epost"
          type="email"
          value={email}
          placeholder="deg@epost.no"
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<MailIcon className="h-5 w-5" />}
        />

        <Field
          id="password"
          label="Passord"
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<LockIcon className="h-5 w-5" />}
        />

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <button
          disabled={loading}
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <SpinnerIcon className="h-4 w-4" />
              Logger inn...
            </>
          ) : (
            "Logg inn"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
