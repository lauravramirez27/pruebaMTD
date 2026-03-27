import { useState, useEffect } from "react";

const COINS = ["bitcoin", "ethereum", "solana", "cardano", "dogecoin"];

const STATUS_COLOR = {
  Alive: "#4ade80",
  Dead: "#f87171",
  unknown: "#94a3b8",
};

function CoinCard({ coin }) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  return (
    <div style={{
      background: "#0d1117", border: "1px solid #1e2d3d",
      borderRadius: "12px", padding: "20px", fontFamily: "monospace",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <img src={coin.image} alt={coin.name} width={32} height={32} />
        <div>
          <div style={{ color: "#e2e8f0", fontWeight: "700", fontSize: "14px" }}>{coin.name}</div>
          <div style={{ color: "#475569", fontSize: "11px" }}>{coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div style={{ color: "#e2e8f0", fontSize: "22px", fontWeight: "700", marginBottom: 6 }}>
        ${coin.current_price.toLocaleString()}
      </div>
      <div style={{ fontSize: "12px", color: isPositive ? "#4ade80" : "#f87171" }}>
        {isPositive ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% hoy
      </div>
      <div style={{ color: "#334155", fontSize: "11px", marginTop: 8 }}>
        Market cap: ${(coin.market_cap / 1e9).toFixed(2)}B
      </div>
    </div>
  );
}

function CharacterCard({ character }) {
  return (
    <div style={{
      background: "#0d1117", border: "1px solid #1e2d3d",
      borderRadius: "12px", overflow: "hidden", fontFamily: "monospace",
    }}>
      <div style={{ position: "relative" }}>
        <img src={character.image} alt={character.name}
          style={{ width: "100%", display: "block", aspectRatio: "1/1", objectFit: "cover" }} />
        <span style={{
          position: "absolute", top: 8, right: 8,
          background: "#0d1117cc",
          border: `1px solid ${STATUS_COLOR[character.status]}`,
          color: STATUS_COLOR[character.status],
          fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: "700",
        }}>
          ● {character.status.toUpperCase()}
        </span>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ color: "#e2e8f0", fontWeight: "700", fontSize: "14px", marginBottom: 4 }}>
          {character.name}
        </div>
        <div style={{ color: "#64748b", fontSize: "11px" }}>
          {character.species} · {character.gender}
        </div>
        <div style={{
          color: "#334155", fontSize: "10px", marginTop: 4,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          📍 {character.location.name}
        </div>
      </div>
    </div>
  );
}

function CryptoView() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS.join(",")}`)
      .then(res => res.json())
      .then(data => { setCoins(data); setLoading(false); })
      .catch(() => { setError("Error al cargar datos"); setLoading(false); });
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 16px" }}>
      {loading && <div style={{ textAlign: "center", color: "#334155", fontSize: "12px" }}>CARGANDO...</div>}
      {error && <div style={{ textAlign: "center", color: "#f87171" }}>{error}</div>}
      {!loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {coins.map(coin => <CoinCard key={coin.id} coin={coin} />)}
        </div>
      )}
    </div>
  );
}

function RickMortyView() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then(res => res.json())
      .then(data => { setCharacters(data.results); setLoading(false); });
  }, []);

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>
      {loading && <div style={{ textAlign: "center", color: "#334155", fontSize: "12px" }}>CARGANDO...</div>}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
          {characters.map(c => <CharacterCard key={c.id} character={c} />)}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [vista, setVista] = useState("crypto");

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
      {/* Header */}
      <div style={{ textAlign: "center", padding: "40px 20px 24px", borderBottom: "1px solid #0f1923" }}>
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 40px)", fontWeight: "900", margin: "0 0 20px",
          background: "linear-gradient(90deg, #f7931a, #00b4d8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          MI DASHBOARD
        </h1>
        {/* Navegación */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button style={btnStyle("crypto")} onClick={() => setVista("crypto")}>
            💰 Crypto
          </button>
          <button style={btnStyle("rickmorty")} onClick={() => setVista("rickmorty")}>
            🛸 Rick & Morty
          </button>
        </div>
      </div>

      {vista === "crypto" && <CryptoView />}
      {vista === "rickmorty" && <RickMortyView />}
    </div>
  );
}