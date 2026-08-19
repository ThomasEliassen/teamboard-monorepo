"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProject,
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "@/lib/api";
import { AppShell } from "@/components/app-shell";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  SpinnerIcon,
} from "@/components/icons";

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
};

export default function ProjectDetailsPage() {
  return (
    <AppShell>
      <ProjectDetailsContent />
    </AppShell>
  );
}

function ProjectDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Hjelpe funksjon for å sjekke etter token. Redirigerer til login ved manglande token.
   */
  function tokenHandler() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return null;
    }
    return token;
  }

  /**
   * Lastar inn prosjekt og vedrørande tasks.
   */
  async function loadProjectAndTasks(projectId: number) {
    const token = tokenHandler();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const [p, t] = await Promise.all([
        getProject(token, projectId),
        getTasks(token, projectId),
      ]);
      setProject(p);
      setTasks(t);
    } catch (e: any) {
      setError(e.message ?? "Kunne ikkje hente tasks eller prosjektet.");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, router]);

  async function onAddTask(e: React.FormEvent) {
    e.preventDefault();
    const token = tokenHandler();
    if (!token) return;

    const title = newTitle.trim();
    if (!token || !project || !title) return;

    setCreating(true);
    setError(null);

    try {
      await createTask(token, project.id, title);
      setNewTitle("");
      const updated = await getTasks(token, project.id);
      setTasks(updated);
    } catch (e: any) {
      setError(e.message ?? "Kunne ikkje opprette task");
    } finally {
      setCreating(false);
    }
  }

  async function onToggleTask(taskId: number) {
    const token = tokenHandler();
    if (!token || !project) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isDone: !t.isDone } : t))
    );

    setError(null);
    try {
      await toggleTask(token, taskId);
    } catch (e: any) {
      setError(e.message ?? "Kunne ikkje oppdatere task");
    }
  }

  async function onDeleteTask(taskId: number, title: string) {
    const token = tokenHandler();
    if (!token || !project) return;

    const popup = confirm(`Vil du slette "${title}"?`);
    if (!popup) return;

    setError(null);

    try {
      await deleteTask(token, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e: any) {
      setError(e.message ?? "Kunne ikkje slette task");
    }
  }

  const doneCount = tasks.filter((t) => t.isDone).length;

  return (
    <>
      {/* Header */}
      <header className="border-b border-border px-8 py-6">
        <Link
          href="/dashboard"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Tilbake til dashboard
        </Link>

        {loading ? (
          <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
        ) : project ? (
          <>
            <h1 className="text-xl font-semibold tracking-tight text-foreground text-balance">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Oppretta {new Date(project.createdAt).toLocaleDateString()} ·{" "}
              {doneCount}/{tasks.length} fullført
            </p>
          </>
        ) : null}
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-8 py-8">
        {!loading && error ? (
          <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <SpinnerIcon className="h-6 w-6" />
          </div>
        ) : !error && project ? (
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Tasks</h2>
            </div>

            {/* Add task */}
            <form
              onSubmit={onAddTask}
              className="flex items-center gap-2 border-b border-border px-5 py-4"
            >
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ny task..."
                className="flex-1 rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <SpinnerIcon className="h-4 w-4" />
                ) : (
                  <PlusIcon className="h-4 w-4" />
                )}
                {creating ? "Lagrer..." : "Legg til"}
              </button>
            </form>

            {/* Task list */}
            {tasks.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                Ingen tasks enda. Legg til din første!
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {tasks.map((t) => (
                  <li
                    key={t.id}
                    className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                  >
                    <button
                      onClick={() => onToggleTask(t.id)}
                      role="checkbox"
                      aria-checked={t.isDone}
                      aria-label={`Marker "${t.title}" som ${t.isDone ? "ikkje fullført" : "fullført"}`}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        t.isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-transparent hover:border-primary"
                      }`}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        t.isDone
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {t.title}
                    </span>
                    <button
                      onClick={() => onDeleteTask(t.id, t.title)}
                      aria-label={`Slett ${t.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </>
  );
}
