import { useEffect, useState } from "react";

const TOKEN = import.meta.env.VITE_CF_TOKEN?.trim();
const ACCOUNT_ID = import.meta.env.VITE_CF_ACCOUNT_ID?.trim();
const CF_BASE = "/cf-api/client/v4";

/* ─── Estilos globales inyectados una vez ─────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  .cf-card { transition: border-color .2s, box-shadow .2s; }
  .cf-card:hover { border-color: #f6821f88 !important; box-shadow: 0 0 0 1px #f6821f22; }
  .cf-row:hover { background: #ffffff06 !important; }
  .cf-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 32px #f6821f18; }
  .cf-stat { transition: transform .2s, box-shadow .2s; }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .cf-anim { animation: fadein .4s ease both; }
`;

/* ─── Helpers ─────────────────────────────────────────────────────── */
function Badge({ color, children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      background: color + "18", border: `1px solid ${color}55`,
      color, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, animation: "pulse-dot 2s infinite" }} />
      {children}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = "#f6821f" }) {
  return (
    <div className="cf-stat" style={{
      flex: "1 1 160px", minWidth: 140,
      background: "linear-gradient(135deg, #0d1117 60%, #111827)",
      border: "1px solid #1e2d3d", borderRadius: 14,
      padding: "20px 22px", cursor: "default",
    }}>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ color: color, fontSize: 28, fontWeight: 700, fontFamily: "Inter, sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 6, fontFamily: "Inter, sans-serif" }}>{label}</div>
      {sub && <div style={{ color: "#334155", fontSize: 11, marginTop: 4, fontFamily: "Inter, sans-serif" }}>{sub}</div>}
    </div>
  );
}

function SectionCard({ title, badge, children }) {
  return (
    <div className="cf-card" style={{
      background: "#0d1117", border: "1px solid #1e2d3d",
      borderRadius: 14, overflow: "hidden", marginBottom: 20,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(90deg, #f6821f12, transparent)",
        padding: "14px 20px", borderBottom: "1px solid #1e2d3d",
      }}>
        <span style={{ color: "#f6821f", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", fontFamily: "Inter, sans-serif" }}>
          {title}
        </span>
        {badge}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="cf-row" style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 20px", borderBottom: "1px solid #0f1923",
    }}>
      <span style={{ color: "#475569", fontSize: 13, fontFamily: "Inter, sans-serif" }}>{label}</span>
      <span style={{
        color: "#e2e8f0", fontSize: 13,
        fontFamily: mono ? "monospace" : "Inter, sans-serif",
        maxWidth: "55%", wordBreak: "break-all", textAlign: "right",
      }}>{value ?? "—"}</span>
    </div>
  );
}

/* ─── Loading skeleton ─────────────────────────────────────────────── */
function Skeleton() {
  const bar = (w, h = 14, mt = 0) => (
    <div style={{
      width: w, height: h, borderRadius: 6, marginTop: mt,
      background: "linear-gradient(90deg, #1e2d3d 25%, #263445 50%, #1e2d3d 75%)",
      backgroundSize: "200% 100%",
      animation: "gradientShift 1.5s infinite",
    }} />
  );
  return (
    <>
      <style>{`@keyframes gradientShift{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ padding: "40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1e2d3d" }} />
          {bar("60%", 18)}
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ flex: 1, background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: 14, padding: 20 }}>
              {bar(40, 40, 0)}{bar("70%", 12, 12)}{bar("50%", 10, 8)}
            </div>
          ))}
        </div>
        {[1, 2].map(i => (
          <div key={i} style={{ background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            {bar("40%", 14)}{bar("100%", 1, 16)}
            {[1, 2, 3].map(j => <div key={j} style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>{bar("30%")}{bar("40%")}</div>)}
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Componente principal ─────────────────────────────────────────── */
export default function CloudflareView() {
  const [account, setAccount] = useState(null);
  const [zones, setZones] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);

  const cfFetch = (url, signal) =>
    fetch(url, {
      signal,
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    }).then((r) => r.json());

  useEffect(() => {
    if (!TOKEN || !ACCOUNT_ID) {
      setError("Faltan las variables VITE_CF_TOKEN o VITE_CF_ACCOUNT_ID en el archivo .env");
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;

    Promise.allSettled([
      cfFetch(`${CF_BASE}/accounts/${ACCOUNT_ID}`, signal),
      cfFetch(`${CF_BASE}/zones?account.id=${ACCOUNT_ID}`, signal),
      cfFetch(`${CF_BASE}/user/tokens`, signal),
      fetch("https://1.1.1.1/cdn-cgi/trace", { signal }).then((r) => r.text()),
    ]).then(([accRes, zonRes, tokRes, traceRes]) => {
      if (signal.aborted) return;
      const newWarnings = [];

      if (accRes.status === "fulfilled" && accRes.value?.success) {
        setAccount(accRes.value.result);
      } else {
        const msg = accRes.value?.errors?.[0]?.message || "Sin acceso a la cuenta";
        setError(`Token inválido o sin permiso de cuenta: ${msg}`);
        setLoading(false);
        return;
      }

      if (zonRes.status === "fulfilled" && zonRes.value?.success) {
        setZones(zonRes.value.result || []);
      } else {
        newWarnings.push("Zonas/Dominios: permiso 'Zone: Read' requerido");
      }

      if (tokRes.status === "fulfilled" && tokRes.value?.success) {
        setTokens(tokRes.value.result || []);
      } else {
        newWarnings.push("API Tokens: permiso 'User: API Tokens: Read' requerido");
      }

      if (traceRes.status === "fulfilled") {
        const data = {};
        traceRes.value.trim().split("\n").forEach((line) => {
          const [key, value] = line.split("=");
          data[key] = value;
        });
        setTrace(data);
      }

      setWarnings(newWarnings);
      setLoading(false);
    });

    return () => controller.abort();
  }, []);

  /* ── Estados de carga / error ── */
  if (loading) return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <style>{STYLE}</style>
      <Skeleton />
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", fontFamily: "Inter, sans-serif" }}>
      <style>{STYLE}</style>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: "#f871711a", border: "1px solid #f8717144",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, marginBottom: 20,
      }}>⚠️</div>
      <div style={{ color: "#f87171", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Error de conexión</div>
      <div style={{ color: "#475569", fontSize: 13, maxWidth: 420, textAlign: "center", lineHeight: 1.6 }}>{error}</div>
    </div>
  );

  const activeZones = zones.filter(z => z.status === "active").length;

  /* ── Dashboard ── */
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", fontFamily: "Inter, sans-serif" }}>
      <style>{STYLE}</style>

      {/* ── Header ───────────────────────────────────────── */}
      <div className="cf-anim" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #f6821f, #f7a040)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 16px #f6821f44",
          }}>☁️</div>
          <div>
            <div style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>
              {account?.name ?? "Cloudflare"}
            </div>
            <div style={{ color: "#475569", fontSize: 12, marginTop: 2, fontFamily: "monospace" }}>
              {ACCOUNT_ID?.slice(0, 8)}…{ACCOUNT_ID?.slice(-4)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Badge color="#4ade80">Conectado</Badge>
          {account?.settings?.enforce_twofactor && <Badge color="#60a5fa">2FA activo</Badge>}
        </div>
      </div>

      {/* ── Warnings ──────────────────────────────────────── */}
      {warnings.length > 0 && (
        <div className="cf-anim" style={{
          background: "#1c1200", border: "1px solid #f59e0b44",
          borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", gap: 12,
        }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              Permisos faltantes en el token
            </div>
            {warnings.map(w => (
              <div key={w} style={{ color: "#78716c", fontSize: 12, marginTop: 3 }}>• {w}</div>
            ))}
            <div style={{ color: "#44403c", fontSize: 11, marginTop: 8 }}>
              dashboard.cloudflare.com → My Profile → API Tokens → editar
            </div>
          </div>
        </div>
      )}

      {/* ── Stat cards ────────────────────────────────────── */}
      <div className="cf-anim" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon="🌐" label="Dominios totales" value={zones.length} sub={`${activeZones} activos`} />
        <StatCard icon="🔑" label="API Tokens" value={tokens.length}
          sub={tokens.filter(t => t.status === "active").length + " activos"} color="#60a5fa" />
        <StatCard icon="📡" label="Datacenter" value={trace?.colo ?? "—"} sub={trace?.loc ?? ""} color="#a78bfa" />
        <StatCard icon="🔒" label="TLS / HTTP" value={trace?.tls ?? "—"} sub={trace?.http ?? ""} color="#34d399" />
      </div>

      {/* ── Fila: Cuenta + Conexión ───────────────────────── */}
      <div className="cf-anim" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
        {/* Cuenta */}
        {account && (
          <SectionCard title="MI CUENTA" badge={<Badge color="#f6821f">Account</Badge>}>
            <Row label="Nombre" value={account.name} />
            <Row label="Account ID" value={account.id} mono />
            <Row label="2FA" value={account.settings?.enforce_twofactor ? "✅ Activo" : "❌ Inactivo"} />
          </SectionCard>
        )}

        {/* Conexión */}
        {trace && (
          <SectionCard title="MI CONEXIÓN" badge={<Badge color="#34d399">Online</Badge>}>
            <Row label="IP pública" value={trace.ip} mono />
            <Row label="País" value={trace.loc} />
            <Row label="Datacenter CF" value={trace.colo} />
            <Row label="WARP" value={trace.warp === "on" ? "✅ Activo" : "❌ Inactivo"} />
          </SectionCard>
        )}
      </div>

      {/* ── Dominios ─────────────────────────────────────── */}
      <div className="cf-anim">
        <SectionCard
          title="DOMINIOS"
          badge={<span style={{ color: "#475569", fontSize: 12 }}>{zones.length} zona{zones.length !== 1 ? "s" : ""}</span>}
        >
          {/* Cabecera tabla */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 100px 100px 120px",
            padding: "8px 20px", borderBottom: "1px solid #0f1923",
            color: "#334155", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
          }}>
            <span>DOMINIO</span><span>TIPO</span><span style={{ textAlign: "center" }}>PLAN</span><span style={{ textAlign: "right" }}>ESTADO</span>
          </div>
          {zones.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#334155", fontSize: 13 }}>
              Sin dominios registrados
            </div>
          ) : (
            zones.map((z) => (
              <div key={z.id} className="cf-row" style={{
                display: "grid", gridTemplateColumns: "1fr 100px 100px 120px",
                padding: "12px 20px", borderBottom: "1px solid #0a131e", alignItems: "center",
              }}>
                <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>🌐 {z.name}</span>
                <span style={{ color: "#475569", fontSize: 12 }}>{z.type ?? "full"}</span>
                <span style={{ color: "#475569", fontSize: 12, textAlign: "center" }}>{z.plan?.name?.replace(" Plan", "") ?? "—"}</span>
                <span style={{ textAlign: "right" }}>
                  <Badge color={z.status === "active" ? "#4ade80" : "#f59e0b"}>
                    {z.status}
                  </Badge>
                </span>
              </div>
            ))
          )}
        </SectionCard>
      </div>

      {/* ── API Tokens ───────────────────────────────────── */}
      {tokens.length > 0 && (
        <div className="cf-anim">
          <SectionCard title="API TOKENS" badge={<Badge color="#60a5fa">{tokens.length} tokens</Badge>}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 80px 160px",
              padding: "8px 20px", borderBottom: "1px solid #0f1923",
              color: "#334155", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            }}>
              <span>NOMBRE</span><span style={{ textAlign: "center" }}>ESTADO</span><span style={{ textAlign: "right" }}>EXPIRA</span>
            </div>
            {tokens.map((t) => (
              <div key={t.id} className="cf-row" style={{
                display: "grid", gridTemplateColumns: "1fr 80px 160px",
                padding: "12px 20px", borderBottom: "1px solid #0a131e", alignItems: "center",
              }}>
                <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>🔑 {t.name}</span>
                <span style={{ textAlign: "center" }}>
                  <Badge color={t.status === "active" ? "#4ade80" : "#f87171"}>{t.status}</Badge>
                </span>
                <span style={{ color: "#334155", fontSize: 12, textAlign: "right", fontFamily: "monospace" }}>
                  {t.expires_on ? new Date(t.expires_on).toLocaleDateString("es") : "Sin expiración"}
                </span>
              </div>
            ))}
          </SectionCard>
        </div>
      )}
    </div>
  );
}