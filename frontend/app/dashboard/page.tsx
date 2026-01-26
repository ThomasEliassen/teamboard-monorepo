"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { me } from "@/lib/api";

/**
 * Dashboard side
 */

type Project = {
  id: number;
  name: string;
  createdAt: string;
};
//Todo: Fullfør prosjekt implementasjon.
export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const []

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

      me(token)
      .then (setUserData)
      .catch ((e) => {setError(e?.message ?? "kunne ikkje hente brukerdata");})
      }, [router]);

      function logout(){
        localStorage.removeItem("token");
        router.push("/login");
      }

      return(
        <main style = {{padding: "24" , display:"grid", placeItems:"center",minHeight:"100vh", backgroundColor: "white"}}>
          <h1 style = {{color: "black"}}>Dashboard</h1>

          <button onClick={logout} style = {{color: "black", border: "1px solid black"}}>
            Logout
          </button>

          <div style = {{marginTop: "16px", color: "black"}}>
            {error && <p style={{color: "red"}}>{error}</p>}
            {!error && userData && <p>Laster...</p>}
            {userData && (
              <pre style ={{padding: 12, background: "#ffffff", color:"black"}}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            )}
          </div>
        </main>
      )


    }
