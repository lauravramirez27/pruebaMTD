import { useState } from "react";
import CloudflareView from "./components/CloudflareView";
import RickMortyView from "./components/RickMortyView";

export default function App() {
  const [vista, setVista] = useState("cloudflare");

  const btnStyle = (name) => ({
    background: vista === name ? "#e2e8f0" : "none",
    border: "1px solid #1e2d3d",
    color: vista === name ? "#070b0f" : "#94a3b8",
    borderRadius: 8, padding: "8px 20px",
    cursor: "pointer", fontFamily: "monospace", fontSize: "12px",
    fontWeight: vista === name ? "700" : "400",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#070b0f", color: "#e2e8f0" }}>
      <div style={{ textAlign: "center", padding: "40px 20px 24px", borderBottom: "1px solid #0f1923" }}>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", margin: "0 0 20px",
          background: "linear-gradient(90deg, #f6821f, #00b4d8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          MI DASHBOARD
        </h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button style={btnStyle("cloudflare")} onClick={() => setVista("cloudflare")}>
            🔶 Cloudflare
          </button>
          <button style={btnStyle("rickmorty")} onClick={() => setVista("rickmorty")}>
            🛸 Rick & Morty
          </button>
        </div>
      </div>

      {vista === "cloudflare" && <CloudflareView />} 
      {vista === "rickmorty" && <RickMortyView />}
    </div>
  );
}