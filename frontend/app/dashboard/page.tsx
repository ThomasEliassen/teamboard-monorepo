"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Dashboard side
 */

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
// Todo: legg til useEffect for å hente brukerdata ved innlasting av sida



}

