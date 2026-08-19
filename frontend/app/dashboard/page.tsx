"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, createProject, deleteProject } from "@/lib/api";
import { AppShell, useUser } from "@/components/app-shell";
import {
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
  BoardIcon,
} from "@/components/icons";

/**
 * Dashboard side med oversikt over prosjekter og muligheit for å registrere eller slette prosjekter
 */

type Project = {
  id: number;
  name: string;
  createdAt: string;
};

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const user = useUser();
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProjects(token)
      .then(setProjects)
      .catch((e) => setError(e?.message ?? "Kunne ikkje hente prosjekter"))
      .finally(() => setLoading(false));
  }, []);

  async function onCreateProject(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const projectName = name.trim();
    if (!projectName) return;

    await createProject(token, projectName);
    setName("");

    const updated = await getProjects(token);
    setProjects(updated);
  }

  async function onDeleteProject(projectId: number, projectName: string) {
    const accept = confirm(`Do you want to delete "${projectName}"?`);
    if (!accept) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    await deleteProject(token, projectId);

    const updated = await getProjects(token);
    setProjects(updated);
  }

  const userLabel = user?.name ?? user?.email ?? "der";

  return (
    <>
      {/* Header */}
      <header className="border-b border-border px-8 py-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Velkommen tilbake,{" "}
          <span className="font-medium text-foreground">{userLabel}</span>
        </p>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-8 py-8">
        {error ? (
          <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Prosjekter</h2>
              <p className="text-sm text-muted-foreground">
                {projects.length} {projects.length === 1 ? "prosjekt" : "prosjekter"}
              </p>
            </div>
          </div>

          {/* Add project */}
          <form
            onSubmit={onCreateProject}
            className="flex items-center gap-2 border-b border-border px-5 py-4"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prosjektnavn..."
              className="flex-1 rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Legg til
            </button>
          </form>

          {/* Project list */}
          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              Laster prosjekter...
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <BoardIcon className="h-6 w-6" />
              </span>
              <p className="text-sm text-muted-foreground">
                Ingen prosjekter enda. Legg til ditt første ovenfor.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="group flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <Link
                    href={`/projects/${p.id}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <BoardIcon className="h-5 w-5" />
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {p.name}
                    </span>
                    <ChevronRightIcon className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <button
                    onClick={() => onDeleteProject(p.id, p.name)}
                    aria-label={`Slett ${p.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
