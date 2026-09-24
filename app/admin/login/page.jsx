"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
    }
  }

  return (
    <main style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.h1}>Giraffe Admin</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoFocus
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}

const styles = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF6EC", fontFamily: "sans-serif" },
  form: { background: "#fff", border: "3px solid #26211A", borderRadius: 16, padding: 32, width: 320, display: "flex", flexDirection: "column", gap: 12 },
  h1: { margin: "0 0 12px", fontSize: 22 },
  input: { padding: 10, borderRadius: 8, border: "2px solid #26211A", fontSize: 15 },
  button: { padding: 11, borderRadius: 8, border: "none", background: "#3A6152", color: "#FBF6EC", fontWeight: 600, cursor: "pointer" },
  error: { color: "#B8502E", margin: 0, fontSize: 14 },
};
