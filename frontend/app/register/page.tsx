"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/api";

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
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
            <div style={{ width: "100%", maxWidth: 420, padding: 24, border: "1px solid #ddd", borderRadius: 12 }}>
                <h1>Registrer Brukar</h1>

                <form onSubmit={onRegister}>
                    <label>
                        Epost
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            style={{ width: "100%", padding: 8, marginTop: 6 }}
                        />
                    </label>

                    <label>
                        Passord
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                            style={{ width: "100%", padding: 8, marginTop: 6 }}
                        />
                    </label>

                    <label>
                        Bekreft passord
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            required
                            style={{ width: "100%", padding: 8, marginTop: 6 }}
                        />
                    </label>

                    <button disabled={loading} type="submit" style={{ padding: 10 }}>
                        {loading ? "Oppretter..." : "Opprett konto"}
                    </button>

                    {error && <p style={{ color: "crimson" }}>{error}</p>}
                </form>

                <p style={{ marginTop: 12 }}>
                    Har du allerede konto? <Link href="/login">Logg inn</Link>
                </p>
            </div>
        </main >
    )
}