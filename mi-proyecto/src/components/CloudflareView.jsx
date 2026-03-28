import { useEffect, useState } from "react";

const TOKEN = import.meta.env.VITE_CF_TOKEN;
const ACCOUNT_ID = import.meta.env.VITE_CF_ACCOUNT_ID;



export default function CloudflareView() {
  const [account, setAccount] = useState(null);
  const [zones, setZones] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cfFetch = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }).then((r) => r.json());

  useEffect(() => {
    Promise.all([
      cfFetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}`),
      cfFetch(`https://api.cloudflare.com/client/v4/zones?account.id=${ACCOUNT_ID}`),
      cfFetch(`https://api.cloudflare.com/client/v4/user/tokens`),
      fetch("https://1.1.1.1/cdn-cgi/trace").then((r) => r.text()),
    ])
      .then(([acc, zon, tok, traceText]) => {
        setAccount(acc.result);
        setZones(zon.result || []);
        setTokens(tok.result || []);
        const data = {};
        traceText.trim().split("\n").forEach((line) => {
          const [key, value] = line.split("=");
          data[key] = value;
        });
        setTrace(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al conectar con Cloudflare");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#334155", fontSize: "12px" }}>
      CARGANDO...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#f87171" }}>{error}</div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 16px", fontFamily: "monospace" }}>

      {/* Cuenta */}
      {account && (
        <div style={{
          background: "#0d1117", border: "1px solid #f6821f44",
          borderRadius: "12px", overflow: "hidden", marginBottom: 20,
        }}>
          <div style={{ background: "#f6821f22", padding: "14px 20px", borderBottom: "1px solid #f6821f44" }}>
            <div style={{ color: "#f6821f", fontSize: "11px", letterSpacing: "0.2em" }}>MI CUENTA</div>
          </div>
          {[
            ["Nombre", account.name],
            ["ID", account.id],
            ["Plan", account.settings?.enforce_twofactor ? "2FA activo" : "Sin 2FA"],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 20px", borderBottom: "1px solid #0f1923", fontSize: "13px",
            }}>
              <span style={{ color: "#475569" }}>{label}</span>
              <span style={{ color: "#e2e8f0" }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Conexión */}
      {trace && (
        <div style={{
          background: "#0d1117", border: "1px solid #f6821f44",
          borderRadius: "12px", overflow: "hidden", marginBottom: 20,
        }}>
          <div style={{ background: "#f6821f22", padding: "14px 20px", borderBottom: "1px solid #f6821f44" }}>
            <div style={{ color: "#f6821f", fontSize: "11px", letterSpacing: "0.2em" }}>TU CONEXIÓN</div>
          </div>
          {[
            ["IP", trace.ip],
            ["País", trace.loc],
            ["Datacenter", trace.colo],
            ["HTTP", trace.http],
            ["TLS", trace.tls],
            ["WARP", trace.warp === "on" ? "✅ Activo" : "❌ Inactivo"],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 20px", borderBottom: "1px solid #0f1923", fontSize: "13px",
            }}>
              <span style={{ color: "#475569" }}>{label}</span>
              <span style={{ color: "#e2e8f0" }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zonas */}
      <div style={{
        background: "#0d1117", border: "1px solid #f6821f44",
        borderRadius: "12px", overflow: "hidden", marginBottom: 20,
      }}>
        <div style={{ background: "#f6821f22", padding: "14px 20px", borderBottom: "1px solid #f6821f44" }}>
          <div style={{ color: "#f6821f", fontSize: "11px", letterSpacing: "0.2em" }}>
            DOMINIOS — {zones.length}
          </div>
        </div>
        {zones.length === 0 ? (
          <div style={{ padding: "16px 20px", color: "#334155", fontSize: "13px" }}>
            No tienes dominios registrados
          </div>
        ) : (
          zones.map((z) => (
            <div key={z.id} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 20px", borderBottom: "1px solid #0f1923", fontSize: "13px",
            }}>
              <span style={{ color: "#e2e8f0" }}>{z.name}</span>
              <span style={{ color: z.status === "active" ? "#4ade80" : "#f7931a" }}>
                {z.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Tokens */}
      <div style={{
        background: "#0d1117", border: "1px solid #f6821f44",
        borderRadius: "12px", overflow: "hidden",
      }}>
        <div style={{ background: "#f6821f22", padding: "14px 20px", borderBottom: "1px solid #f6821f44" }}>
          <div style={{ color: "#f6821f", fontSize: "11px", letterSpacing: "0.2em" }}>
            API TOKENS — {tokens.length}
          </div>
        </div>
        {tokens.map((t) => (
          <div key={t.id} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 20px", borderBottom: "1px solid #0f1923", fontSize: "13px",
          }}>
            <span style={{ color: "#e2e8f0" }}>{t.name}</span>
            <span style={{ color: t.status === "active" ? "#4ade80" : "#f87171" }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}