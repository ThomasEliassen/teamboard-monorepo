"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";


/**
 * login side der brukaren kan logge inn med epost og passord og sendast til dashboard sida ved suksess
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
    } 
    
    catch (err: any) {
      setError(err.message ?? "Innlogging feilet, vennligst prøv igjen.");
      setLoading(false);
  }


}
//todo: legg til styling under i return

// return()
}

