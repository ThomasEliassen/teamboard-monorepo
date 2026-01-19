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
 * Hent prosjekter for den innloggede brukaren
 * @param token 
 */
export async function getProjects(token: string){
  const res = await fetch("http://localhost:5018/projects", {
    headers: { Authorization: `Bearer ${token}` },
});
  if (!res.ok) throw new Error("kunne ikkje hente prosjekter.")
    return res.json();
}


/**
 * Lag eit nytt prosjekt
 * @param token 
 * @param name 
 */
export async function createProject(token: string, name: string){
  const res = await fetch("http://localhost:5018/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({name}),
  });
  if (!res.ok) throw new Error("Kunne ikkje oprette prosjektet.");
  return res.json();
}