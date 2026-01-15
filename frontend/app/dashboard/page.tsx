"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { me } from "@/lib/api";

/**
 * Dashboard side
 */

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
// Todo: legg til useEffect for å hente brukerdata ved innlasting av sida

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      router.push("/login");
      return;
    }

      me(token)
      .then (setUserData)
      .catch ((e) => {setError(e?.message ?? "kunne ikkje hente brukerdata");})
      }, [router]);

      function logout(){
        localStorage.removeItem("accesstoken");
        router.push("/login");
      }

      return(
        <main style = {{padding: "24"}}>
          <h1>Dashboard</h1>

          <button>
            Logout
          </button>

          <div style = {{marginTop: "16px"}}>
            {error && <p style={{color: "red"}}>{error}</p>}
            {!error && userData && <p>Laster...</p>}
            {userData && (
              <pre style ={{padding: 12, background: "#f4f4f4"}}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            )}
          </div>
        </main>
      )


    }
