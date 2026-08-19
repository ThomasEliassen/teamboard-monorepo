"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";
import { AuthShell, Field } from "@/components/auth-shell";
import { MailIcon, LockIcon, SpinnerIcon } from "@/components/icons";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passordene matcher ikkje");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      router.push("/login");
    } catch (e: any) {
      setError(e.message ?? "Feil ved registrering");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Registrer brukar"
      subtitle="Opprett en konto for å komme i gang"
      footer={
        <>
          Har du allerede konto?{" "}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Logg inn
          </Link>
        </>
      }
    >
      <form onSubmit={onRegister} className="flex flex-col gap-4">
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

        <Field
          id="confirmPassword"
          label="Bekreft passord"
          type="password"
          value={confirmPassword}
          placeholder="••••••••"
          onChange={(e) => setConfirmPassword(e.target.value)}
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
              Oppretter...
            </>
          ) : (
            "Opprett konto"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
