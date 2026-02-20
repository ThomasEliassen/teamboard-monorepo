"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject, getTasks, createTask, toggleTask } from "@/lib/api";

type Project = {
  id: number;
  name: string;
  createdAtUtc: string;
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

    try{
      const [p,t] = await Promise.all([getProject(token,projectId), getTasks(token,projectId)]);
      setProject(p);
      setTasks(t);
    }
    catch (e:any){
      setError(e.message ?? "Kunne ikkje hente tasks eller prosjektet.")
    }
  }

  useEffect(() => {
    const rawId = params?.id;
    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      setError("Ugyldig prosjekt-id");
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
    if(!title) return;
    if(!project) return;

    try{
      await createTask(token, project.id, title);
      setNewTitle("");
      const updated = await getTasks(token, project.id);
      setTasks(updated);
    } catch(e:any) {
      setError(e.message ?? "kunne ikkje opprette task");
    }
  }

  /**
   * Endrer status på task fra ikkje fullført til fullført eller omvendt.
   */
  async function onToggleTask(taskId: number) {
    const token = tokenHandler();
    if(!token) return;
    if(!project) return;

    try{
      await toggleTask(token, taskId)
    } catch (e:any){
      setError(e.message ?? "Kunne ikkje oppdatere task")
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: 800 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/dashboard">← Tilbake til dashboard</Link>
      </div>

      <h1>Prosjekt</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {project && (
        <div style={{ marginTop: 12 }}>
          <p>
            <strong>Navn:</strong> {project.name}
          </p>
          <p style={{ opacity: 0.75 }}>
            Opprettet: {new Date(project.createdAtUtc).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  );


}