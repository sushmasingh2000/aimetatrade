import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TrendDropdown } from "./TrendDropdown";
import { CandleChart } from "./CandleChart";
import { calculateProbabilities } from "./CalculateProbability";
import { useLiveMarket } from "../UseLivemarket";
const COIN_LIST = [
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
  "ZECUSDT",
  "ADAUSDT",
  "DOTUSDT",
  "TRXUSDT",
  "BNBUSDT",
];

const TIME_FRAMES = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "6h",
  "12h",
  "1d",
  "1w",
];
const LINE_OPTIONS = ["Line", "Bar"];
const INDICATOR_OPTIONS = [
  "VOL",
  "MACD",
  "KDJ",
  "RSI",
  "DMI",
  "OBV",
  "BOLL",
  "BRAR",
  "WR",
];

const pad = (n) => String(n).padStart(2, "0");

const fmtPrice = (price) => {
  const n = Number(price);
  if (!n) return "0.00";
  if (n < 0.000001) return n.toFixed(8);
  if (n < 0.001) return n.toFixed(7);
  if (n < 1) return n.toFixed(5);
  if (n > 10000)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (n > 100) return n.toFixed(3);
  return n.toFixed(5);
};

const fmtVol = (v) => {
  if (!v) return "0";
  if (v >= 1000000) return (v / 1000000).toFixed(2) + "M";
  if (v >= 1000) return (v / 1000).toFixed(2) + "K";
  return v.toFixed(2);
};

const fmtCandleTime = (ts) => {
  if (!ts) return "–";
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const calcMA = (candles, period) => {
  if (!candles || candles.length < period) return null;
  let sum = 0;
  for (let i = candles.length - period; i < candles.length; i++)
    sum += candles[i].close;
  return sum / period;
};

function CandleInfoBar({ candle, isLive }) {
  if (!candle) return null;

  const bull = candle.close >= candle.open;
  const col = bull ? "#089981" : "#ff5252";

  const items = [
    { label: "T", value: fmtCandleTime(candle.time), color: "#9ca3af" },
    { label: "O", value: fmtPrice(candle.open), color: col },
    { label: "H", value: fmtPrice(candle.high), color: "#d1d5db" },
    { label: "L", value: fmtPrice(candle.low), color: "#d1d5db" },
    { label: "C", value: fmtPrice(candle.close), color: col },
    {
      label: "V",
      value: fmtVol(candle.vol ?? candle.volume ?? 0),
      color: "#d1d5db",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "4px 8px",
        flexWrap: "wrap",
        fontSize: "11px",
        fontFamily: "monospace",
        border: "1px solid rgba(255,255,255,0.05)",
        minHeight: "26px",
      }}
    >
      {isLive && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#089981",
            flexShrink: 0,
            boxShadow: "0 0 4px #089981",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      {items.map(({ label, value, color }) => (
        <span
          key={label}
          style={{ display: "flex", gap: "3px", alignItems: "baseline" }}
        >
          <span style={{ color: "#4b5563" }}>{label}:</span>
          <span style={{ color, fontWeight: 500 }}>{value}</span>
        </span>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FuturesTrade({ initialSymbol = "BTCUSDT" }) {
  const [candles, setCandles] = useState([]);
  const { symbol: routeSym } = useParams();
  const navigate = useNavigate();
  const symbol = routeSym || initialSymbol;

  const [drawer, setDrawer] = useState(false);
  const [tfIdx, setTfIdx] = useState(0);
  const [tab, setTab] = useState(0);
  const [chartType, setChartType] = useState("Bar");
  const [indicator, setIndicator] = useState("VOL");
  const [lineOpen, setLineOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [volOpen, setVolOpen] = useState(false);

  const [selectedCandle, setSelectedCandle] = useState(null);
  const [isLiveCandle, setIsLiveCandle] = useState(true);
  const handleCandleSelect = (candle) => {
    setSelectedCandle(candle);
    setIsLiveCandle(!candle?.isSelected);
  };
  const handleCandleSelectFromChart = (candle) => {
    if (!candle) {
      setSelectedCandle(null);
      setIsLiveCandle(true);
      return;
    }
    setSelectedCandle(candle);
    setIsLiveCandle(candle._isLive === true);
  };

  const { coins } = useLiveMarket();
  const coin = coins[symbol];

  const candlesWithLivePrice = useMemo(() => {
    if (!candles.length || !coin?.lastPrice) return candles;
    const updated = [...candles];
    const lastIdx = updated.length - 1;
    updated[lastIdx] = { ...updated[lastIdx], close: Number(coin.lastPrice) };
    return updated;
  }, [candles, coin?.lastPrice]);

  const change = Number(coin?.priceChangePercent ?? 0);
  const positive = change >= 0;
  const base = symbol.replace("USDT", "");

  const ma7 = useMemo(
    () => calcMA(candlesWithLivePrice, 7),
    [candlesWithLivePrice],
  );
  const ma25 = useMemo(
    () => calcMA(candlesWithLivePrice, 25),
    [candlesWithLivePrice],
  );
  const ma99 = useMemo(
    () => calcMA(candlesWithLivePrice, 99),
    [candlesWithLivePrice],
  );

  const openLine = () => {
    setLineOpen(true);
    setTimeOpen(false);
    setVolOpen(false);
  };
  const openTime = () => {
    setTimeOpen(true);
    setLineOpen(false);
    setVolOpen(false);
  };
  const openVol = () => {
    setVolOpen(true);
    setLineOpen(false);
    setTimeOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1117",
        minHeight: "100dvh",
        overflowY: "auto",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
          }}
        >
          {/* Coin drawer */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDrawer(!drawer)}
              style={{
                background: "none",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h10M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {drawer && (
              <>
                <div
                  onClick={() => setDrawer(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "-16px",
                    top: "36px",
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    borderRadius: "12px",
                    background: "#131920",
                    border: "1px solid rgba(255,255,255,0.08)",
                    width: "180px",
                    maxHeight: "82vh",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      position: "sticky",
                      top: 0,
                      background: "#131920",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "13px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Trade
                    </span>
                  </div>
                  {COIN_LIST.map((sym) => {
                    const active = sym === symbol;
                    const b = sym.replace("USDT", "");
                    return (
                      <button
                        key={sym}
                        onClick={() => {
                          navigate(`/futures/${sym}`);
                          setDrawer(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          background: active
                            ? "rgba(255,255,255,0.1)"
                            : "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            color: active ? "#ffffff" : "#d1d5db",
                          }}
                        >
                          {b}
                        </span>
                        <span
                          style={{
                            color: "#6b7280",
                            fontWeight: "normal",
                            fontSize: "12px",
                            marginLeft: "4px",
                          }}
                        >
                          / USDT
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <span
            style={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
          >
            {base} / USDT
          </span>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: positive ? "#089981" : "#ff5252",
            }}
          >
            {positive ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                d="M12 16v-4M12 8h.01"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <TrendDropdown
            symbol={symbol}
            interval={TIME_FRAMES[tfIdx]}
            onData={setCandles}
          />
        </div>
      </div>

      {/* ── Time-frame quick tabs ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 16px",
          flexShrink: 0,
        }}
      >
        {TIME_FRAMES.slice(0, 5).map((tf, i) => (
          <button
            key={tf}
            onClick={() => setTfIdx(i)}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              backgroundColor: tfIdx === i ? "#ad49ff" : "#1a2030",
              color: tfIdx === i ? "#ffffff" : "#6b7280",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* ── Price header ──────────────────────────────────────────────────── */}
      <div style={{ padding: "0 8px 8px 8px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: positive ? "#089981" : "#ff5252",
                lineHeight: 1.1,
              }}
            >
              {coin?.lastPrice
                ? Number(coin.lastPrice).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 5,
                  })
                : "—"}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: positive ? "#089981" : "#ff5252",
                marginTop: "2px",
              }}
            >
              $
              {coin?.lastPrice
                ? Number(coin.lastPrice).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 5,
                  })
                : "—"}{" "}
              {positive ? "+" : ""}
              {change.toFixed(2)}%
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2px 16px",
              textAlign: "right",
            }}
          >
            {[
              {
                label: "24h High",
                value: coin?.highPrice
                  ? Number(coin.highPrice).toLocaleString()
                  : "—",
              },
              {
                label: "24h Low",
                value: coin?.lowPrice
                  ? Number(coin.lowPrice).toLocaleString()
                  : "—",
              },
              {
                label: `24h Vol(${base})`,
                value: coin?.volume ? Number(coin.volume).toFixed(2) : "—",
              },
              {
                label: "24h Vol(USDT)",
                value: coin?.quoteVolume
                  ? (Number(coin.quoteVolume) / 1e9).toFixed(4) + "B"
                  : "—",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: "10px", color: "#6b7280" }}>
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#d1d5db",
                    fontWeight: 500,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MA row */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            fontSize: "11px",
            color: "#6b7280",
            flexWrap: "wrap",
          }}
        >
          <span>
            MA(7){" "}
            <span style={{ color: "#e6b422" }}>
              {ma7 ? ma7.toFixed(2) : "—"}
            </span>
          </span>
          <span>
            MA(25){" "}
            <span style={{ color: "#e84d68" }}>
              {ma25 ? ma25.toFixed(2) : "—"}
            </span>
          </span>
          <span>
            MA(99){" "}
            <span style={{ color: "#a78bfa" }}>
              {ma99 ? ma99.toFixed(2) : "—"}
            </span>
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0 16px 4px 16px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Chart-type dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => (lineOpen ? setLineOpen(false) : openLine())}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "12px",
              color: "#d1d5db",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {chartType}
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
            </svg>
          </button>
          {lineOpen && (
            <>
              <div
                onClick={() => setLineOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "28px",
                  zIndex: 50,
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#131920",
                  border: "1px solid rgba(255,255,255,0.08)",
                  width: "140px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                  }}
                >
                  {LINE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setChartType(opt);
                        setLineOpen(false);
                      }}
                      style={{
                        padding: "10px 0",
                        fontSize: "13px",
                        fontWeight: chartType === opt ? "bold" : "500",
                        color: chartType === opt ? "#ffffff" : "#9ca3af",
                        background:
                          chartType === opt
                            ? "rgba(255,255,255,0.08)"
                            : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Time-frame dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => (timeOpen ? setTimeOpen(false) : openTime())}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "12px",
              color: "#d1d5db",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {TIME_FRAMES[tfIdx]}
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
            </svg>
          </button>
          {timeOpen && (
            <>
              <div
                onClick={() => setTimeOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "28px",
                  zIndex: 50,
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#131920",
                  border: "1px solid rgba(255,255,255,0.08)",
                  width: "180px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                  }}
                >
                  {TIME_FRAMES.map((tf, i) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setTfIdx(i);
                        setTimeOpen(false);
                      }}
                      style={{
                        padding: "10px 0",
                        fontSize: "13px",
                        fontWeight: tfIdx === i ? "bold" : "500",
                        color: tfIdx === i ? "#ffffff" : "#9ca3af",
                        background:
                          tfIdx === i ? "rgba(173,73,255,0.18)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Indicator dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => (volOpen ? setVolOpen(false) : openVol())}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "12px",
              color: "#d1d5db",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {indicator}
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
            </svg>
          </button>
          {volOpen && (
            <>
              <div
                onClick={() => setVolOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "28px",
                  zIndex: 50,
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#131920",
                  border: "1px solid rgba(255,255,255,0.08)",
                  width: "220px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                  }}
                >
                  {INDICATOR_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setIndicator(opt);
                        setVolOpen(false);
                      }}
                      style={{
                        padding: "10px 0",
                        fontSize: "13px",
                        fontWeight: indicator === opt ? "bold" : "500",
                        color: indicator === opt ? "#ffffff" : "#9ca3af",
                        background:
                          indicator === opt
                            ? "rgba(255,255,255,0.08)"
                            : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        borderRight: "1px solid rgba(255,255,255,0.05)",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CandleInfoBar candle={selectedCandle} isLive={isLiveCandle} />

      <div
        style={{
          flexShrink: 0,
          padding: "0 8px",
          height: "45vh",
          minHeight: "200px",
        }}
      >
        <CandleChart
          symbol={symbol}
          interval={TIME_FRAMES[tfIdx]}
          chartType={chartType}
          indicator={indicator}
          onData={setCandles}
          onCandleSelect={handleCandleSelectFromChart}
        />
      </div>

      {/* ── Bottom tabs ───────────────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          marginTop: "15px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "0 16px",
            gap: "4px",
            scrollbarWidth: "none",
          }}
        >
          {[
            "Position order",
            "Historical orders",
            "Invited me",
            "Follow-up",
          ].map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                whiteSpace: "nowrap",
                fontSize: "13px",
                fontWeight: 500,
                paddingBottom: "8px",
                paddingLeft: "4px",
                paddingRight: "4px",
                marginRight: "12px",
                flexShrink: 0,
                color: tab === i ? "#ffffff" : "#6b7280",
                borderBottom:
                  tab === i ? "2px solid #f5a623" : "2px solid transparent",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0",
            paddingBottom: "100px",
            color: "#9ca3af",
          }}
        >
          <svg
            width="40"
            height="40"
            fill="currentColor"
            style={{ opacity: 0.3, marginBottom: "4px" }}
            viewBox="0 0 24 24"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span style={{ fontSize: "11px" }}>No records</span>
        </div>
      </div>
    </div>
  );
}

