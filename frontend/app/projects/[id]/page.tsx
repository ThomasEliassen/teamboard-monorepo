"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject, getTasks, createTask, toggleTask, deleteTask } from "@/lib/api";

type Project = {
  id: number;
  name: string;
  createdAt: string;
};

type TaskItem = {
  id: number;
  projectId: number;
  title: string;
  isDone: boolean;
  createdAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Hjelpe funksjon for å sjekke etter token. Redirigerer til login ved manglende token.
   * @returns token
   */
  function tokenHandler(){
    const token = localStorage.getItem("token");
    if(!token){
        router.push("/login");
        return null;
      }
    return token;
  }

  /**
   * Lastar inn prosjekt og vedrørende tasks.
   * @param projectId 
   */
  async function loadProjectAndTasks(projectId: number) {
    const token = tokenHandler();
    if(!token) return;

    setLoading(true);
    setError(null);

    try{
      const [p,t] = await Promise.all([getProject(token,projectId), getTasks(token,projectId)]);
      setProject(p);
      setTasks(t);
    }
    catch (e:any){
      setError(e.message ?? "Kunne ikkje hente tasks eller prosjektet.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const rawId = params?.id;
    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      setError("Ugyldig prosjekt-id");
      setLoading(false);
      return;
    }

    loadProjectAndTasks(id);
    }, [params, router]);

  /**
   * Håndterer tillegging av nye tasks.
   */
  async function onAddTask() {
    const token = tokenHandler();
    if(!token) return;

    const title = newTitle.trim();
    if(!token || !project) return;

    setCreating(true);
    setError(null);

    try{
      await createTask(token, project.id, title);
      setNewTitle("");
      const updated = await getTasks(token, project.id);
      setTasks(updated);
    } catch(e:any) {
      setError(e.message ?? "kunne ikkje opprette task");
    } finally{
      setCreating(false);
    }
  }

  /**
   * Endrer status på task fra ikkje fullført til fullført eller omvendt.
   */
  async function onToggleTask(taskId: number) {
    const token = tokenHandler();
    if(!token || !project) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isDone: !t.isDone } : t))
    );

    setError(null);
    try{
      await toggleTask(token, taskId)
    } catch (e:any){
      setError(e.message ?? "Kunne ikkje oppdatere task")
    }
  }

  async function onDeleteTask(taskId: number, title: string){
    const token = tokenHandler();
    if(!token || !project) return;

    const popup = confirm(`Vil du slette "${title}"?`);
    if(!popup) return;

    setError(null);

    try{
      await deleteTask(token, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }catch (e:any){
      setError(e.message ?? "Kunne ikkje slette task");
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: 800, backgroundColor: "white", color:"black" }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/dashboard">← Tilbake til dashboard</Link>
      </div>

      {!loading && error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && project && (
        <>
          <h1 style={{ marginBottom: 6 }}>{project.name}</h1>
          <p style={{ marginTop: 0, opacity: 0.75 }}>
            Oppretta: {new Date(project.createdAt).toLocaleString()}
          </p>

          <section style={{ marginTop: 24 }}>
            <h2>Tasks</h2>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ny task..."
                style={{ flex: 1, padding: 10 }}
              />
              <button onClick={onAddTask} disabled={creating}>
                {creating ? "Lagrer..." : "Legg til"}
              </button>
            </div>

            {tasks.length === 0 ? (
              <p style={{ marginTop: 12, opacity: 0.8 }}>
                Ingen tasks enda. Legg til din første!
              </p>
            ) : (
              <ul style={{ marginTop: 12, paddingLeft: 18 }}>
                {tasks.map((t) => (
                  <li
                    key={t.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                      position: "relative"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={t.isDone}
                      onChange={() => onToggleTask(t.id)}
                    />
                    <span style={{ textDecoration: t.isDone ? "line-through" : "none" }}>
                      {t.title}
                    </span>
                    <button style={{position: "absolute", right: 8}} onClick={() => onDeleteTask(t.id, t.title)}>Slett</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
         )}
    </main>
  );
}