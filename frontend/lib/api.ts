const API_BASE = "http://localhost:5018";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  return res.json(); // forventer { accessToken, ... }
}

export async function me(token: string) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Not authorized");
  }

  return res.json();
}


/**
 * Henter alle prosjekter for den innloggede brukaren
 * @param token 
 */
export async function getProjects(token: string){
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
});
  if (!res.ok) throw new Error("kunne ikkje hente prosjekter.")
    return res.json();
}

/**
 * Henter spesifikt prosjekt basert på prosjektets id
 * @param token 
 * @param id 
 * @returns 
 */
export async function getProject(token: string, id: number) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) throw new Error("Prosjektet finnes ikke (eller du har ikke tilgang).");
  if (!res.ok) throw new Error("Kunne ikkje hente prosjekt");
  return res.json();
}


/**
 * Lagar eit nytt prosjekt
 * @param token 
 * @param name 
 */
export async function createProject(token: string, name: string){
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({name}),
  });
  if (!res.ok) throw new Error("Kunne ikkje oprette prosjektet.");
  return res.json();
}

/**
 * Slett spesifikt prosjekt
 * @param token 
 * @param name 
 */
export async function deleteProject(token: string, id: number){
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
    headers: {Authorization: `Bearer ${token}`}
  });
  if(!res.ok) throw new Error("Kunne ikkje slette prosjektet.")
}

/**
 * Henter alle tasks.
 * @param token 
 * @param projectId 
 * @returns 
 */
export async function getTasks(token: string, projectId: number){
  const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  if(!res.ok) throw new Error("Kunne ikkje henke tasks.")
  return res.json();
}

/**
 * Oppretter task.
 * @param token 
 * @param projectId 
 * @param title 
 * @returns 
 */
export async function createTask(token: string, projectId: number, title: string){
  const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
    body: JSON.stringify({title})
  });
  if(!res.ok) throw new Error("Kunne ikkje opprette task.")
  return res.json();
}

/**
 * Toggle som kan brukes for å avgjere om task er ferdig eller ikkje.
 * @param token 
 * @param taskId 
 * @returns 
 */
export async function toggleTask(token: string, taskId: number){
  const res = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
    method: "PATCH",
    headers: {Authorization: `Bearer ${token}`}
  });
  if(!res.ok) throw new Error("Kunne ikkje oppdatere task.")
  return res.json();
}