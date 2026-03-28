import { useState, useEffect } from "react";

export default function RickMortyView() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://rickandmortyapi.com/api/character")
            .then((r) => r.json())
            .then((data) => { setCharacters(data.results); setLoading(false); });
    }, []);

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>
            {loading && (
                <div style={{ textAlign: "center", color: "#334155", fontSize: "12px" }}>CARGANDO...</div>
            )}
            {!loading && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
                    {characters.map((c) => <CharacterCard key={c.id} character={c} />)}
                </div>
            )}
        </div>
    );
}

const STATUS_COLOR = {
    Alive: "#4ade80",
    Dead: "#f87171",
    unknown: "#94a3b8",
};

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