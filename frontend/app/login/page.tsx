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
//todo: 

 return(
    //<main style = {{padding :"24", maxWidth: "400px", backgroundColor: "white", borderRadius: "8px", color: "black", fontSize: "16px"}}>
    <main style = {{padding :"24", display:"grid", placeItems:"center",minHeight:"100vh", backgroundColor: "#f0f0f0"}}>
      <div style={{marginBottom: "16px", color: "red", textAlign: "center"}}>
      <h1 style = {{color: "black", fontSize: "32px", textAlign: "center"}}>Login</h1>

      <form onSubmit={handleSubmit} 
      style={{display: "grid", gap:"10px", marginTop: "20px", backgroundColor: "transparent", borderRadius: "8px"}}>

        <label style={{gap: "4px", color: "black", textAlign: "center"}}>
          <input type="email" value ={email} placeholder="Epost" onChange={(e) => setEmail(e.target.value)} required 
          style={{color: "black", padding: 6, border: "1px solid #ccc", borderRadius: "4px"}} />
        </label>

        <label style={{gap: "4px", color: "black", textAlign: "center"}}>
          <input type="password" value ={password} placeholder="Passord" onChange={(e) => setPassword(e.target.value)} required
          style={{color: "black", padding: 6, border: "1px solid #ccc", borderRadius: "4px"}} />
        </label>

        <button disabled={loading} type = "submit" 
        style = {{padding: 6, backgroundColor: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>
          {loading ? "logger inn..." : "login"}
        </button>

        {error && <p style={{color: "red"}}>{error}</p>}
      </form>
      </div>
    </main>
 )
}

