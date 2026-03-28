import { useState, useEffect, useCallback } from "react";

export default function RickMortyView() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [notFound, setNotFound] = useState(false);

    const fetchCharacters = useCallback((query = "") => {
        setLoading(true);
        setNotFound(false);
        const url = query
            ? `https://rickandmortyapi.com/api/character?name=${encodeURIComponent(query)}`
            : "https://rickandmortyapi.com/api/character";

        fetch(url)
            .then((r) => {
                if (!r.ok) throw new Error("not found");
                return r.json();
            })
            .then((data) => {
                setCharacters(data.results);
                setNotFound(false);
            })
            .catch(() => {
                setCharacters([]);
                setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, []);

    // Carga inicial
    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    // Debounce: espera 500ms tras dejar de escribir antes de consultar la API
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCharacters(search.trim());
        }, 500);
        return () => clearTimeout(timer);
    }, [search, fetchCharacters]);

    return (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>
            {/* Buscador */}
            <div style={{ marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ position: "relative", flexGrow: 1 }}>
                    <span style={{
                        position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                        fontSize: "16px", pointerEvents: "none"
                    }}>🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar personaje por nombre..."
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "12px 40px 12px 42px",
                            background: "#0d1117",
                            border: "1px solid #1e2d3d",
                            borderRadius: "10px",
                            color: "#e2e8f0",
                            fontSize: "14px",
                            fontFamily: "monospace",
                            outline: "none",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#4ade80")}
                        onBlur={(e) => (e.target.style.borderColor = "#1e2d3d")}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            style={{
                                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", color: "#64748b",
                                fontSize: "18px", cursor: "pointer", lineHeight: 1,
                            }}
                            title="Limpiar búsqueda"
                        >×</button>
                    )}
                </div>
            </div>

            {/* Estado de carga */}
            {loading && (
                <div style={{ textAlign: "center", color: "#4ade80", fontSize: "12px", fontFamily: "monospace", padding: "40px 0" }}>
                    ⏳ CARGANDO...
                </div>
            )}

            {/* Sin resultados */}
            {!loading && notFound && (
                <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "monospace" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>👽</div>
                    <div style={{ color: "#f87171", fontSize: "14px", fontWeight: "700" }}>
                        Personaje no encontrado
                    </div>
                    <div style={{ color: "#334155", fontSize: "11px", marginTop: "6px" }}>
                        Prueba con otro nombre
                    </div>
                </div>
            )}

            {/* Grilla de personajes */}
            {!loading && !notFound && (
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