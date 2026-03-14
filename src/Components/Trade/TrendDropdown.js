import { useEffect, useState } from "react";
import { useLiveMarket } from "../UseLivemarket";

// Make sure this is imported or defined
const pad = (n) => String(n).padStart(2, "0");
const fmtPeriod = (s, e) =>
  `${pad(s.getHours())}:${pad(s.getMinutes())}~${pad(e.getHours())}:${pad(e.getMinutes())}`;

export const TrendDropdown = ({ symbol, interval,label,onData }) => {
  const [open, setOpen] = useState(false);
  const { coins } = useLiveMarket();
 const [candles, setCandles] = useState([]);

    useEffect(() => {
      async function fetchCandles() {
        try {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${
              interval
            }&limit=100`,
          );
          const raw = await res.json();
          const normalized = raw.map((c) => ({
            time: c[0],
            open: Number(c[1]),
            high: Number(c[2]),
            low: Number(c[3]),
            close: Number(c[4]),
            volume: Number(c[5]),
          }));
          setCandles(normalized);
          onData?.(normalized);
        } catch (err) {
          console.error("Candle fetch failed:", err);
        }
      }
      fetchCandles();
    }, [symbol, interval, onData]);

  const windowSize = 3; // candles per slot (3× interval)

const slots = Array.from({ length: 3 }, (_, i) => {
  if (candles.length < i + 2) {
    return { label: "–", up: null };
  }

  const endIdx = candles.length - 1 - i;
  const startIdx = endIdx - 1;

  const start = candles[startIdx];
  const end = candles[endIdx];

  return {
    label: fmtPeriod(
      new Date(start.time),
      new Date(end.time)
    ),
    up: end.close >= start.close,
  };
});

  return (
  <div style={{ position: "relative" }}>
  {/* Trigger Button */}
  <button
    onClick={() => setOpen((v) => !v)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      color: "#ffffff",
      fontWeight: 600,
      fontSize: "14px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
  >
    Trend
    <svg
      width="14"
      height="14"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
    </svg>
  </button>

  {/* Dropdown */}
  {open && (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: "32px",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          padding: "8px",
          borderRadius: "12px",
          minWidth: "160px",
          background: "#131920",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {slots.map((s, i) => (
          <button
            key={i}
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#ffffff",
              backgroundColor: s.up ? "#00b578" : "rgba(255,82,82,0.2)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              {s.up ? (
                <path
                  d="M5 17l5-5 4 4 5-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M5 7l5 5 4-4 5 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            {s.label}
          </button>
        ))}
      </div>
    </>
  )}
</div>
  );
};