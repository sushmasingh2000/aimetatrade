import { useState, useEffect, useRef } from "react";
import { useLiveMarket, SYMBOL_TO_ID } from "./UseLivemarket";
import { useNavigate } from "react-router-dom";

// ── Constants ─────────────────────────────────────────────────────────────────
const MARKET_SYMBOLS = [
  "ZECUSDT","DOGEUSDT","TRXUSDT","DASHUSDT","XRPUSDT",
  "YFIUSDT","SHIBUSDT","LTCUSDT","BTCUSDT","ADAUSDT",
  "FILUSDT","DOTUSDT","ETHUSDT","LINKUSDT","BCHUSDT",
  "BNBUSDT",
];

const COIN_LOGO = (baseSymbol) => {
  const symKey = `${baseSymbol.toUpperCase()}USDT`;
  const id = SYMBOL_TO_ID[symKey];
  if (id) return `https://assets.coincap.io/assets/icons/${id}@2x.png`;
  return `https://cryptoicons.org/api/color/${baseSymbol.toLowerCase()}/64`;
};

// ── Formatters ────────────────────────────────────────────────────────────────
const formatPrice = (price) => {
  const n = Number(price);
  if (!n)          return "0";
  if (n < 0.00001) return n.toFixed(8);
  if (n < 1)       return n.toFixed(5);
  if (n > 1000)    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toFixed(4);
};

const formatVolume = (vol) => {
  const n = Number(vol);
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  // Layout
  wrapper: {
    width: "100%",
  },

  // Tabs
  tabsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    marginBottom: "12px",
  },
  tabBtn: (active) => ({
    position: "relative",
    fontSize: "13px",
    fontWeight: "500",
    paddingBottom: "4px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: active ? "#ad49ff" : "#6b7280",
    transition: "color 0.15s",
  }),
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    borderRadius: "9999px",
    backgroundColor: "#ad49ff",
  },

  // Status badge
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  statusDot: (color, glow) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: color,
    boxShadow: glow,
    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
  }),
  statusLabel: (color) => ({
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.1em",
    color,
  }),

  // Empty state
  emptyState: {
    padding: "24px 0",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },

  // Coin row
  coinRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },

  // Col 1 — avatar + name
  col1: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  coinName: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "13px",
    lineHeight: 1.2,
  },
  coinPair: {
    color: "#4b5563",
    fontSize: "10px",
    fontWeight: "400",
    marginLeft: "2px",
  },
  coinPrice: (flash) => ({
    fontSize: "11px",
    marginTop: "2px",
    fontVariantNumeric: "tabular-nums",
    transition: "color 0.2s",
    color:
      flash === "up"   ? "#4ade80" :
      flash === "down" ? "#ff5252" : "#9ca3af",
  }),

  // Col 2 — price (hidden on very small screens via JS)
  col2: (flash) => ({
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: 1.1,
    justifyContent: "center",
    color:
      flash === "up"   ? "#16C784" :
      flash === "down" ? "#ff5252" : "#6b7280",
  }),

  // Col 3 — sparkline or volume label
  col3: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  volLabel: {
    color: "#6b7280",
    fontSize: "11px",
    fontVariantNumeric: "tabular-nums",
  },

  // Col 4 — badge
  col4: {
    display: "flex",
    justifyContent: "flex-end",
  },
  changeBadge: (positive) => ({
    fontSize: "12px",
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
    padding: "6px 10px",
    borderRadius: "8px",
    whiteSpace: "nowrap",
    border: positive ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,82,82,0.3)",
    backgroundColor: positive ? "rgba(74,222,128,0.1)" : "rgba(255,82,82,0.1)",
    color: positive ? "#4ade80" : "#f87171",
  }),
  volBadge: {
    color: "#e5e7eb",
    fontWeight: "600",
    fontSize: "12px",
    fontVariantNumeric: "tabular-nums",
  },

  // Avatar
  avatarImg: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#1a2030",
    border: "1px solid rgba(8,145,178,0.3)",
    objectFit: "contain",
    flexShrink: 0,
  },
  avatarFallback: (bg) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid rgba(8,145,178,0.3)",
    backgroundColor: bg,
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
  }),
};

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ history = [], positive }) {
  const canvasRef = useRef(null);
  const W = 56, H = 24;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const data = history.slice(-20);
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || min * 0.001 || 1;
    const padX = 1, padY = 3;

    const pts = data.map((v, i) => ({
      x: padX + (i / (data.length - 1)) * (W - padX * 2),
      y: padY + (1 - (v - min) / range) * (H - padY * 2),
    }));

    const color = positive ? "#18d05c" : "#ff5252";

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, positive ? "rgba(0,229,255,0.2)" : "rgba(255,82,82,0.2)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.lineTo(pts[0].x, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    ctx.stroke();
  }, [history, positive]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: W, height: H, display: "block" }}
    />
  );
}

// ── Coin avatar with fallback ─────────────────────────────────────────────────
function CoinAvatar({ symbol }) {
  const [failed, setFailed] = useState(false);

  const colors = [
    "#0e7490","#065f46","#7c3aed","#b45309","#be123c",
    "#1d4ed8","#15803d","#c2410c","#6d28d9","#0369a1",
  ];
  const bgColor = colors[symbol.charCodeAt(0) % colors.length];

  if (failed) {
    return (
      <div style={styles.avatarFallback(bgColor)}>
        {symbol[0]}
      </div>
    );
  }

  return (
    <img
      src={COIN_LOGO(symbol)}
      alt={symbol}
      style={styles.avatarImg}
      onError={() => setFailed(true)}
    />
  );
}

// ── Coin row ──────────────────────────────────────────────────────────────────
function CoinRow({ coin, tab }) {
  const change   = Number(coin.priceChangePercent ?? 0);
  const positive = change >= 0;
  const baseSymbol = coin.symbol?.includes("/")
    ? coin.symbol.split("/")[0]
    : coin.symbol?.replace("USDT", "") ?? "?";

  const [flash, setFlash] = useState(null);
  const prevRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!coin.lastPrice) return;
    if (prevRef.current && coin.lastPrice !== prevRef.current) {
      setFlash(Number(coin.lastPrice) > Number(prevRef.current) ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 500);
      prevRef.current = coin.lastPrice;
      return () => clearTimeout(t);
    }
    prevRef.current = coin.lastPrice;
  }, [coin.lastPrice]);

  return (
    <div style={styles.coinRow}>
      {/* Col 1 — avatar + symbol + price */}
      <div style={styles.col1} onClick={() => navigate(`/futures/${coin.symbol}`)}>
        <CoinAvatar symbol={baseSymbol} />
        <div>
          <p style={styles.coinName}>
            {baseSymbol}
            <span style={styles.coinPair}>/ USDT</span>
          </p>
          <span style={styles.coinPrice(flash)}>
            {formatPrice(coin.lastPrice || "0")}
          </span>
        </div>
      </div>

      {/* Col 2 — full price (hidden on very narrow screens) */}
      <MaybeVisible minWidth={350}>
        <div style={styles.col2(flash)}>
          {coin.lastPrice
            ? Number(coin.lastPrice).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 5,
              })
            : "—"}
        </div>
      </MaybeVisible>

      {/* Col 3 — sparkline or volume label */}
      <div style={styles.col3}>
        {tab !== 2 ? (
          <Sparkline history={coin.history || []} positive={positive} />
        ) : (
          <span style={styles.volLabel}>
            {formatVolume(coin.quoteVolume || "0")}
          </span>
        )}
      </div>

      {/* Col 4 — change badge or volume */}
      <div style={styles.col4}>
        {tab !== 2 ? (
          <span style={styles.changeBadge(positive)}>
            {positive ? "+" : ""}{change.toFixed(2)}%
          </span>
        ) : (
          <span style={styles.volBadge}>
            {formatVolume(coin.quoteVolume || "0")}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Responsive helper (replaces Tailwind's min-[350px]:flex) ─────────────────
function MaybeVisible({ minWidth, children }) {
  const [visible, setVisible] = useState(window.innerWidth >= minWidth);

  useEffect(() => {
    const handler = () => setVisible(window.innerWidth >= minWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [minWidth]);

  if (!visible) return null;
  return children;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ mode }) {
  const cfg = {
    ws:         { color: "#ad49ff", label: "LIVE",        glow: "0 0 6px #ad49ff" },
    polling:    { color: "#4ade80", label: "LIVE ~2s",    glow: "0 0 6px #4ade80" },
    connecting: { color: "#fbbf24", label: "Connecting…", glow: "none"            },
  }[mode] ?? { color: "#fbbf24", label: "…", glow: "none" };

  return (
    <div style={styles.statusRow}>
      <span style={styles.statusDot(cfg.color, cfg.glow)} />
      <span style={styles.statusLabel(cfg.color)}>{cfg.label}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const TABS = ["Change", "Top Losers", "24h turnover"];

export default function MarketTable() {
  const [tab, setTab] = useState(0);
  const { coins, mode } = useLiveMarket();

  const coinArray = MARKET_SYMBOLS
    .map((s) => coins[s])
    .filter((c) => c && c.lastPrice);

  const displayData =
    tab === 0
      ? [...coinArray].sort((a, b) => Number(b.priceChangePercent) - Number(a.priceChangePercent))
      : tab === 1
      ? [...coinArray].sort((a, b) => Number(a.priceChangePercent) - Number(b.priceChangePercent))
      : [...coinArray].sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume));

  return (
    <>
      {/* Keyframe for pulsing dot — injected once */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Tabs */}
        <div style={styles.tabsRow}>
          {TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              style={styles.tabBtn(tab === i)}
            >
              {label}
              {tab === i && <span style={styles.tabUnderline} />}
            </button>
          ))}
        </div>

        {/* Status */}
        <StatusBadge mode={mode} />

        {/* Empty state */}
        {displayData.length === 0 && (
          <div style={styles.emptyState}>Loading market data…</div>
        )}

        {/* Rows */}
        {displayData.map((coin) => (
          <CoinRow key={coin.symbol} coin={coin} tab={tab} />
        ))}
      </div>
    </>
  );
}