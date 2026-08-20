import { redirect } from "next/navigation";

export default function Home() {
  // The dashboard performs its own auth guard and will bounce
  // unauthenticated users to /login.
  redirect("/dashboard");
}
