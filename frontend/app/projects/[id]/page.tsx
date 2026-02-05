"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/lib/api";

type Project = {
  id: number;
  name: string;
  createdAtUtc: string;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const rawId = params?.id;
    const id = Number(rawId);
    if (!Number.isFinite(id)) {
      setError("Ugyldig prosjekt-id");
      return;
    }

    getProject(token, id)
      .then(setProject)
      .catch((e) => setError(e?.message ?? "Kunne ikkje hente prosjekt"));
  }, [params, router]);

  return (
    <main style={{ padding: "24px", maxWidth: 800 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/dashboard">← Tilbake til dashboard</Link>
      </div>

      <h1>Prosjekt</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!error && !project && <p>Laster...</p>}

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