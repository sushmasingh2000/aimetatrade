import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SYMBOL_TO_ID, useLiveMarket } from "./UseLivemarket";
import MarketsForexTab from "./MarketsForexTab";

const FUTURES_SYMBOLS = [
  "BTCUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "LINKUSDT",
  "SHIBUSDT",
  "ETHUSDT",
  "DASHUSDT",
  "BCHUSDT",
  "FILUSDT",
  "LTCUSDT",
  "YFIUSDT",
  "ADAUSDT",
  "DOTUSDT",
  "ZECUSDT",
  "TRXUSDT",
];

const PERPETUAL_SYMBOLS = [
  "ETHUSDT",
  "BTCUSDT",
  "DASHUSDT",
  "FILUSDT",
  "LINKUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "XRPUSDT",
  "ZECUSDT",
  "YFIUSDT",
  "BCHUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "SHIBUSDT",
  "DOTUSDT",
];

const formatPrice = (price) => {
  const n = Number(price);
  if (!n) return "0";
  if (n < 0.000001) return n.toFixed(8);
  if (n < 0.001) return n.toFixed(7);
  if (n < 1) return n.toFixed(5);
  if (n > 10000)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (n > 100) return n.toFixed(3);
  return n.toFixed(4);
};

const formatVolume = (vol) => {
  const n = Number(vol);
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
};

const COIN_LOGO = (baseSymbol) => {
  const symKey = `${String(baseSymbol || "BTC").toUpperCase()}USDT`;
  const id = SYMBOL_TO_ID[symKey];

  if (id) {
    return `https://assets.coincap.io/assets/icons/${id}@2x.png`;
  }

  return `https://cryptoicons.org/api/color/${String(baseSymbol || "btc").toLowerCase()}/64`;
};

function useIsNarrow(breakpoint = 350) {
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsNarrow(e.matches);
    setIsNarrow(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isNarrow;
}

function CoinAvatar({ symbol, isNarrow }) {
  const [failed, setFailed] = useState(false);

  const colors = [
    "#0e7490",
    "#065f46",
    "#7c3aed",
    "#b45309",
    "#be123c",
    "#1d4ed8",
    "#15803d",
    "#c2410c",
    "#6d28d9",
    "#0369a1",
  ];

  const safeSymbol = String(symbol || "BTC");
  const colorIndex = safeSymbol.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  const avatarSize = isNarrow ? 28 : 36;

  if (failed) {
    return (
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: "1px solid #9b21d4",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: isNarrow ? "12px" : "14px",
          backgroundColor: bgColor,
        }}
      >
        {safeSymbol[0]}
      </div>
    );
  }

  return (
    <img
      src={COIN_LOGO(safeSymbol)}
      alt={safeSymbol}
      onError={() => setFailed(true)}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: "50%",
        objectFit: "contain",
        backgroundColor: "#1a2030",
        border: "1px solid rgba(8,145,178,0.3)",
        flexShrink: 0,
      }}
    />
  );
}

function MarketRow({ coin, isNarrow }) {
  const change = Number(coin.priceChangePercent ?? 0);
  const positive = change >= 0;
  const base = coin.symbol.replace("USDT", "");
  const baseSymbol = coin.symbol.replace("USDT", "");
  const [flash, setFlash] = useState(null);
  const prevRef = useRef(null);

  useEffect(() => {
    if (!coin.lastPrice) return;
    if (prevRef.current && coin.lastPrice !== prevRef.current) {
      setFlash(
        Number(coin.lastPrice) > Number(prevRef.current) ? "up" : "down",
      );
      const t = setTimeout(() => setFlash(null), 400);
      prevRef.current = coin.lastPrice;
      return () => clearTimeout(t);
    }
    prevRef.current = coin.lastPrice;
  }, [coin.lastPrice]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "14px",
        paddingBottom: "14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      <div>
        <CoinAvatar symbol={baseSymbol} isNarrow={isNarrow} />
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: isNarrow ? "13px" : "15px",
            lineHeight: "1.2",
            margin: 0,
            paddingLeft: "10px",
          }}
        >
          {base}
          <span
            style={{
              color: "#6b7280",
              fontWeight: "normal",
              fontSize: isNarrow ? "10px" : "13px",
              marginLeft: "4px",
            }}
          >
            / USDT
          </span>
        </p>

        <p
          style={{
            color: "#6b7280",
            fontSize: isNarrow ? "9px" : "11px",
            marginTop: "4px",
            marginBottom: 0,
            paddingLeft: "10px",
          }}
        >
          VOL:
          <span
            style={{
              color: "#9ca3af",
              marginLeft: "4px",
            }}
          >
            {formatVolume(coin.quoteVolume)}
          </span>
        </p>
      </div>

      {/* Center */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: isNarrow ? "13px" : "15px",
            lineHeight: "1.2",
            transition: "color 0.2s ease",
            fontVariantNumeric: "tabular-nums",
            color:
              flash === "up"
                ? "#16C784"
                : flash === "down"
                ? "#ff5252"
                : "#ffffff",
            display: "block",
          }}
        >
          {formatPrice(coin.lastPrice)}
        </span>

        <span
          style={{
            fontSize: isNarrow ? "9px" : "11px",
            marginTop: "4px",
            display: "block",
            fontVariantNumeric: "tabular-nums",
            color:
              flash === "up"
                ? "#16C784"
                : flash === "down"
                ? "#ff5252"
                : "#6b7280",
          }}
        >
          $ {formatPrice(coin.lastPrice)}
        </span>
      </div>

      {/* Right */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{
            display: "inline-block",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: isNarrow ? "11px" : "13px",
            fontVariantNumeric: "tabular-nums",
            borderRadius: "8px",
            padding: isNarrow ? "8px 6px" : "10px 10px",
            minWidth: isNarrow ? "64px" : "80px",
            textAlign: "center",
            backgroundColor: positive ? "#16C784" : "#ff5252",
          }}
        >
          {positive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function LiveBadge({ mode, isNarrow }) {
  const cfg =
    mode === "ws"
      ? {
          dotColor: "#16C784",
          textColor: "#16C784",
          label: "LIVE",
          glow: "0 0 6px #16C784",
        }
      : mode === "polling"
      ? {
          dotColor: "#16C784",
          textColor: "#16C784",
          label: "LIVE ~2s",
          glow: "0 0 5px #16C784",
        }
      : {
          dotColor: "#fbbf24",
          textColor: "#fbbf24",
          label: "Connecting…",
          glow: "none",
        };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: cfg.dotColor,
          boxShadow: cfg.glow,
          animation: "pulse 1.5s infinite",
        }}
      />

      <span
        style={{
          fontSize: isNarrow ? "8px" : "10px",
          fontWeight: "bold",
          letterSpacing: "2px",
          color: cfg.textColor,
        }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

function TableHeader({ sortBy, onSort, isNarrow }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "8px",
        paddingBottom: "8px",
        marginBottom: "4px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <span
        style={{
          flex: 1,
          color: "#6b7280",
          fontSize: isNarrow ? "10px" : "12px",
          fontWeight: 500,
        }}
      >
        Pair
      </span>

      <span
        style={{
          flex: 1,
          textAlign: "center",
          color: "#6b7280",
          fontSize: isNarrow ? "10px" : "12px",
          fontWeight: 500,
        }}
      >
        Price
      </span>

      <div
        onClick={() =>
          onSort(sortBy === "change_desc" ? "change_asc" : "change_desc")
        }
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          style={{
            color: "#6b7280",
            fontSize: isNarrow ? "10px" : "12px",
            fontWeight: 500,
          }}
        >
          Change
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            marginLeft: "2px",
          }}
        >
          <svg
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill={sortBy === "change_desc" ? "#089981" : "#4b5563"}
          >
            <path d="M4 0L8 5H0z" />
          </svg>

          <svg
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill={sortBy === "change_asc" ? "#089981" : "#4b5563"}
          >
            <path d="M4 5L0 0h8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ForexMore() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("change_desc");
  const { coins, mode } = useLiveMarket();
  const isNarrow = useIsNarrow(350);

  const symbols = tab === 0 ? FUTURES_SYMBOLS : PERPETUAL_SYMBOLS;

  const rows = symbols
    .map((s) => coins[s])
    .filter((c) => {
      if (!c?.lastPrice) return false;
      if (!search) return true;
      return c.symbol.toLowerCase().includes(search.toLowerCase());
    });

  const sorted =
    sortBy === "change_desc"
      ? [...rows].sort(
          (a, b) =>
            Number(b.priceChangePercent) - Number(a.priceChangePercent)
        )
      : [...rows].sort(
          (a, b) =>
            Number(a.priceChangePercent) - Number(b.priceChangePercent)
        );

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: "96px",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          marginBottom: "12px",
          paddingTop: "12px",
        }}
      >
        {["Forex"].map((label, i) => (
          <button
            key={label}
            onClick={() => {
              setTab(i);
              if (label === "Forex") {
                setTab(1);
                setSearch("");
              }
            }}
            style={{
              fontSize: isNarrow ? "15px" : "17px",
              fontWeight: "bold",
              paddingBottom: "2px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === i ? "#ffffff" : "#6b7280",
              borderBottom:
                tab === i ? "2px solid #ffffff" : "2px solid transparent",
              transition: "color 0.2s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 0 ? (
        <>
          {/* Search */}
          <div
            style={{
              position: "relative",
              margin: "0 16px 8px 16px",
            }}
          >
            <svg
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                color: "#6b7280",
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Search pair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "#1a2030",
                color: "#ffffff",
                fontSize: isNarrow ? "12px" : "14px",
                padding: "10px 16px 10px 36px",
                borderRadius: "12px",
                border: "1px solid rgba(6,182,212,0.2)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Live badge */}
          <div style={{ padding: "0 16px 8px 16px" }}>
            <LiveBadge mode={mode} isNarrow={isNarrow} />
          </div>

          {/* Header */}
          <div style={{ padding: "0 16px" }}>
            <TableHeader sortBy={sortBy} onSort={setSortBy} isNarrow={isNarrow} />
          </div>

          {/* Rows */}
          <div style={{ padding: "0 16px" }}>
            {sorted.length === 0 ? (
              <div
                style={{
                  padding: "48px 0",
                  textAlign: "center",
                  color: "#4b5563",
                  fontSize: isNarrow ? "12px" : "14px",
                }}
              >
                {Object.keys(coins).length === 0
                  ? "Loading market data…"
                  : "No pairs found"}
              </div>
            ) : (
              sorted.map((coin) => (
                <div
                  key={coin.symbol}
                  onClick={() => navigate(`/futures/${coin.symbol}`)}
                  style={{ cursor: "pointer" }}
                >
                  <MarketRow coin={coin} isNarrow={isNarrow} />
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <MarketsForexTab />
      )}
    </div>
  );
}