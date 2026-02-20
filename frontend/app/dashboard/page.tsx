"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProjects, me, createProject, deleteProject } from "@/lib/api";
import Link from "next/link";

/**
 * Dashboard side med oversikt over prosjekter og muligheit for å registrere eller slette prosjekter
 */

type Project = {
  id: number;
  name: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    me(token)
      .then((data) => {
        setUserData(data);
        return getProjects(token);
      })
      .then(setProjects)
      .catch((e) => { setError(e?.message ?? "kunne ikkje hente brukerdata"); })
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  async function onCreateProject() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const projectName = name.trim();
    if (!projectName) return;

    await createProject(token, projectName);
    setName("");

    const updated = await getProjects(token);
    setProjects(updated);
  }

  async function onDeleteProject(projectId: number, projectName: string){
    const accept = confirm(`Do you want to delete "${projectName}"?`);
    if(!accept) return;

    const token = localStorage.getItem("token");
    if(!token) return;

    await deleteProject(token, projectId);

    const updated = await getProjects(token);
    setProjects(updated);
  }

  return (
    <main style={{ padding: "24", display: "grid", placeItems: "center", minHeight: "100vh", backgroundColor: "white" }}>
      <h1 style={{ color: "black" }}>Dashboard</h1>

      <button onClick={logout} style={{ color: "black", border: "1px solid black" }}>
        Logout
      </button>

      <div style={{ marginTop: "16px", color: "black"}}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {userData && (
          <p style={{ marginTop: 4, opacity: 0.85}}>
            Velkommen, <strong>{userData.name}</strong> 👋
          </p>
        )}

        <section style={{ marginTop: 24, border: "1px solid black" }}>
          <h2>Prosjekter</h2>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prosjektnavn..."
              style={{ flex: 1, padding: 10 }}
            />
            <button style={{marginRight : 5}} onClick={onCreateProject}>Legg til</button>
          </div>
          <ul>
            {projects.map((p) => (
              <li key={p.id} style={{position: "relative", border: "1px solid black"}}>
                <Link href={`/projects/${p.id}`}>{p.name}</Link>
                <button style={{position: "absolute", right: 8}} onClick={() => onDeleteProject(p.id, p.name)}>Slett</button>
              </li>
            ))}
            
          </ul>
        </section>
      </div>
    </main>
  )


}
