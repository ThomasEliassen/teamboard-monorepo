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


  async function onRegister(e: React.FormEvent){
    e.preventDefault();
    setError(null);

    if(password !== confirmPassword){
        setError("Passordene matcher ikkje");
        return;
    }

    setLoading(true);
    try{
        await register(email, password);
        router.push("/login");
    }catch(e:any){
        setError(e.message ?? "Feil ved registrering");
    }finally{
        setLoading(false);
    }
  }

  return(
    <main>
        <div>
            <h1>Registrer Brukar</h1>

            <form onSubmit={onRegister}>
                <label>
                    Epost
                    <input
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    type = "email"
                    required
                    />
                </label>

                <label>
                    Passord
                    <input
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    type = "password"
                    required
                    />
                </label>

                <label>
                    Bekreft passord
                    <input
                    value = {confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type = "password"
                    required
                    />
                </label>

                <button>

                </button>
            </form>
        </div>
    </main>
  )
}