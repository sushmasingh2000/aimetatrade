import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveMarket } from "../UseLivemarket";
import {
  RSI,
  MACD,
  BOLL,
  VolumeMA,
  SMA,
  getPriceRange,
  mapPriceToY,
} from "./CandleHelper";
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

const pad = (n) => String(n).padStart(2, "0");

const fmtCandleTime = (ts) => {
  if (!ts) return "–";
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmtVol = (v) => {
  if (!v) return "0";
  if (v >= 1000000) return (v / 1000000).toFixed(2) + "M";
  if (v >= 1000) return (v / 1000).toFixed(2) + "K";
  return v.toFixed(2);
};

const INTERVAL_SECONDS = {
  "1m": 60,
  "3m": 180,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
};

export const CandleChart = ({
  symbol,
  interval = "1m",
  chartType,
  indicator,
  onData,
  onCandleSelect, // fires candle|null to parent (for info bar)
}) => {
  const intervalSec = INTERVAL_SECONDS[interval] ?? 60;
  const mainRef = useRef(null);
  const volRef = useRef(null);
  const candlesRef = useRef([]);
  const currentRef = useRef(null);
  const offsetRef = useRef(0);
  const selCandleRef = useRef(null);
  const zoomRef = useRef(60);
  const loadingMoreRef = useRef(false);
  const lastVolRef = useRef(0);
  const candleStartVolRef = useRef(0);

  // Local popup state (shown on the chart itself)
  const [selectedCandle, setSelectedCandle] = useState(null);
  const [selVisIdx, setSelVisIdx] = useState(-1);
  const [popupX, setPopupX] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const { coins } = useLiveMarket();

  // const pinchRef = useRef({ active: false, startDist: 0, startZoom: 60 });
  const pointerRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startOffset: 0,
    movedX: 0,
    startTime: 0,
    pointerId: null,
  });

  // Stable refs so single-mount touch closure always calls latest fns
  const drawRef = useRef(null);
  const loadMoreRef = useRef(null);
  const onCandleSelectRef = useRef(onCandleSelect);
  useEffect(() => {
    onCandleSelectRef.current = onCandleSelect;
  }, [onCandleSelect]);

  // ── Build visible slice ───────────────────────────────────────────────────
  const getVis = useCallback(() => {
    const all = [
      ...candlesRef.current,
      ...(currentRef.current ? [currentRef.current] : []),
    ];
    const visCount = zoomRef.current;
    const maxOffset = Math.max(0, all.length - 10);
    const offset = Math.max(0, Math.min(offsetRef.current, maxOffset));
    offsetRef.current = offset;
    const end = offset > 0 ? all.length - offset : all.length;
    return { vis: all.slice(Math.max(0, end - visCount), end), all, offset };
  }, []);

  // ── Draw ──────────────────────────────────────────────────────────────────
  const drawCanvas = useCallback(
    (cType, ind) => {
      const canvas = mainRef.current;
      const volCvs = volRef.current;
      if (!canvas) return;
      const { vis } = getVis();
      if (vis.length < 2) return;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth,
        H = canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      ctx.font = "bold 8px monospace";
      const { max: _rawMax, min: _rawMin } = getPriceRange(vis);
      const _maxLabelW = Math.max(
        ...[_rawMax, _rawMin, (_rawMax + _rawMin) / 2].map(
          (p) => ctx.measureText(fmtPrice(p)).width,
        ),
      );
      const RIGHT = Math.ceil(_maxLabelW) + 12;
      const chartW = W - RIGHT;
      const barW = Math.max(4, Math.floor(chartW / vis.length) - 1);
      const maxP = _rawMax * 1.0004,
        minP = _rawMin * 0.9996;
      const range = maxP - minP || 1;
      const toY = (p) => mapPriceToY(p, minP, range, H);

      for (let i = 0; i <= 4; i++) {
        const y = (H / 4) * i;
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartW, y);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "9px monospace";
        ctx.fillText(fmtPrice(maxP - (range / 4) * i), chartW + 4, y + 4);
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, chartW, H);
      ctx.clip();

      if (cType === "Line") {
        ctx.beginPath();
        ctx.strokeStyle = "#089981";
        ctx.lineWidth = 1.5;
        vis.forEach((c, i) => {
          const x = Math.floor(i * (barW + 1)) + barW / 2;
          i === 0 ? ctx.moveTo(x, toY(c.close)) : ctx.lineTo(x, toY(c.close));
        });
        ctx.stroke();
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "rgba(0,229,255,0.18)");
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.beginPath();
        vis.forEach((c, i) => {
          const x = Math.floor(i * (barW + 1)) + barW / 2;
          i === 0 ? ctx.moveTo(x, toY(c.close)) : ctx.lineTo(x, toY(c.close));
        });
        const lx0 = Math.floor((vis.length - 1) * (barW + 1)) + barW / 2;
        ctx.lineTo(lx0, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        vis.forEach((c, i) => {
          const x = Math.floor(i * (barW + 1)),
            col = c.close >= c.open ? "#089981" : "#ff5252";
          const wx = x + Math.floor(barW / 2);
          ctx.strokeStyle = col;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(wx, toY(c.high));
          ctx.lineTo(wx, toY(c.low));
          ctx.stroke();
          ctx.fillStyle = col;
          ctx.fillRect(
            x,
            toY(Math.max(c.open, c.close)),
            barW,
            Math.max(
              1,
              toY(Math.min(c.open, c.close)) - toY(Math.max(c.open, c.close)),
            ),
          );
        });
      }

      if (ind === "BOLL" && vis.length >= 20) {
        const { upper, mid, lower } = BOLL(
          vis.map((c) => c.close),
          20,
          2,
        );
        [
          [upper, "rgba(255,165,0,0.8)", [3, 3]],
          [mid, "rgba(255,255,255,0.5)", []],
          [lower, "rgba(100,180,255,0.8)", [3, 3]],
        ].forEach(([arr, col, dash]) => {
          ctx.beginPath();
          ctx.strokeStyle = col;
          ctx.lineWidth = 1;
          ctx.setLineDash(dash);
          let s = false;
          arr.forEach((v, i) => {
            if (v == null) return;
            const x = Math.floor(i * (barW + 1)) + barW / 2;
            if (s) {
              ctx.lineTo(x, toY(v));
            } else {
              ctx.moveTo(x, toY(v));
              s = true;
            }
          });
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }
      ctx.restore();

      const selIdx = selCandleRef.current?.visIdx ?? -1;
      if (selIdx >= 0 && selIdx < vis.length) {
        const sx = Math.floor(selIdx * (barW + 1)) + barW / 2;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, H);
        ctx.stroke();
        ctx.setLineDash([]);
        const ts = fmtCandleTime(vis[selIdx]?.time);
        const tw = ctx.measureText(ts).width + 8;
        const lxT = Math.max(0, Math.min(sx - tw / 2, chartW - tw));
        ctx.fillStyle = "rgba(80,80,100,0.9)";
        ctx.fillRect(lxT, H - 16, tw, 16);
        ctx.fillStyle = "#fff";
        ctx.font = "9px monospace";
        ctx.fillText(ts, lxT + 4, H - 4);
      }

      if (currentRef.current) {
        const cp = currentRef.current.close,
          cy = toY(cp);
        const priceColor =
          currentRef.current.close >= currentRef.current.open
            ? "#089981"
            : "#ff5252";
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(chartW, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        const ly = Math.max(0, Math.min(H - 16, cy - 8));
        ctx.fillStyle = priceColor;
        ctx.fillRect(chartW + 1, ly, RIGHT - 2, 16);
        ctx.fillStyle = "#000";
        ctx.font = "bold 8px monospace";
        ctx.fillText(fmtPrice(cp), chartW + 3, ly + 11);
      }

      if (!volCvs) return;
      const vW = volCvs.clientWidth,
        vH = volCvs.clientHeight;
      if (!vW || !vH) return;
      volCvs.width = vW * dpr;
      volCvs.height = vH * dpr;
      const vCtx = volCvs.getContext("2d");
      vCtx.scale(dpr, dpr);
      vCtx.clearRect(0, 0, vW, vH);
      vCtx.save();
      vCtx.beginPath();
      vCtx.rect(0, 0, chartW, vH);
      vCtx.clip();

      const pH = vH - 13;
      const closes = vis.map((c) => c.close);
      const vols = vis.map((c) => c.vol);
      const maxVol = Math.max(...vols, 1);

      const drawSubLine = (arr, color, minV, maxV) => {
        const r = maxV - minV || 1;
        vCtx.beginPath();
        vCtx.strokeStyle = color;
        vCtx.lineWidth = 1;
        let s = false;
        arr.forEach((v, i) => {
          if (v == null) return;
          const x = Math.floor(i * (barW + 1)) + barW / 2,
            y = pH - ((v - minV) / r) * pH * 0.9 - pH * 0.05;
          if (s) {
            vCtx.lineTo(x, y);
          } else {
            vCtx.moveTo(x, y);
            s = true;
          }
        });
        vCtx.stroke();
      };
      const volBars = () => {
        vis.forEach((c, i) => {
          const x = Math.floor(i * (barW + 1)),
            bH = (c.vol / maxVol) * pH;
          vCtx.fillStyle =
            c.close >= c.open ? "rgba(8,153,129,0.7)" : "rgba(255,82,82,0.7)";
          vCtx.fillRect(x, pH - bH, barW, bH);
        });
      };
      const lbl = (t, x, y, col) => {
        vCtx.font = "9px monospace";
        vCtx.fillStyle = col;
        vCtx.fillText(t, x, y);
      };

      if (selIdx >= 0 && selIdx < vis.length) {
        const sx = Math.floor(selIdx * (barW + 1)) + barW / 2;
        vCtx.setLineDash([3, 3]);
        vCtx.strokeStyle = "rgba(255,255,255,0.25)";
        vCtx.lineWidth = 1;
        vCtx.beginPath();
        vCtx.moveTo(sx, 0);
        vCtx.lineTo(sx, pH);
        vCtx.stroke();
        vCtx.setLineDash([]);
      }

      if (ind === "VOL") {
        volBars();
        [
          [VolumeMA(vols, 5), "#f5a623"],
          [VolumeMA(vols, 10), "#089981"],
          [VolumeMA(vols, 20), "#2d9cdb"],
        ].forEach(([a, c]) => drawSubLine(a, c, 0, maxVol));
        lbl("VOL(5,10,20)", 2, vH - 2, "#999");
        lbl("MA5", 82, vH - 2, "#f5a623");
        lbl("MA10", 104, vH - 2, "#089981");
        lbl("MA20", 130, vH - 2, "#2d9cdb");
      } else if (ind === "MACD") {
        const { diff, dea, hist } = MACD(closes);
        const maxA = Math.max(
          ...[...hist, ...diff, ...dea].map(Math.abs),
          0.001,
        );
        const midY = pH / 2,
          toVY = (v) => midY - (v / maxA) * midY * 0.88;
        hist.forEach((h, i) => {
          const x = Math.floor(i * (barW + 1));
          vCtx.fillStyle =
            h >= 0 ? "rgba(0,181,120,0.7)" : "rgba(255,82,82,0.7)";
          vCtx.fillRect(
            x,
            Math.min(midY, toVY(h)),
            barW,
            Math.max(1, Math.abs(midY - toVY(h))),
          );
        });
        [
          [diff, "#f5a623"],
          [dea, "#089981"],
        ].forEach(([arr, col]) => {
          vCtx.beginPath();
          vCtx.strokeStyle = col;
          vCtx.lineWidth = 1;
          let s = false;
          arr.forEach((v, i) => {
            const x = Math.floor(i * (barW + 1)) + barW / 2,
              y = toVY(v);
            if (s) {
              vCtx.lineTo(x, y);
            } else {
              vCtx.moveTo(x, y);
              s = true;
            }
          });
          vCtx.stroke();
        });
        vCtx.strokeStyle = "rgba(255,255,255,0.1)";
        vCtx.lineWidth = 1;
        vCtx.beginPath();
        vCtx.moveTo(0, midY);
        vCtx.lineTo(chartW, midY);
        vCtx.stroke();
        lbl("MACD(12,26,9)", 2, vH - 2, "#999");
        lbl("DIFF", 90, vH - 2, "#f5a623");
        lbl("DEA", 118, vH - 2, "#089981");
      } else if (ind === "KDJ") {
        let k = 50,
          d = 50;
        const Ks = [],
          Ds = [],
          Js = [];
        closes.forEach((_, i) => {
          if (i < 8) {
            Ks.push(50);
            Ds.push(50);
            Js.push(50);
            return;
          }
          const sl = vis.slice(i - 8, i + 1),
            hi = Math.max(...sl.map((c) => c.high)),
            lo = Math.min(...sl.map((c) => c.low)),
            rsv = hi === lo ? 50 : ((closes[i] - lo) / (hi - lo)) * 100;
          k = (k * 2) / 3 + rsv / 3;
          d = (d * 2) / 3 + k / 3;
          Ks.push(k);
          Ds.push(d);
          Js.push(3 * k - 2 * d);
        });
        [Ks, Ds, Js].forEach((arr, ci) =>
          drawSubLine(arr, ["#f5a623", "#089981", "#2d9cdb"][ci], 0, 100),
        );
        lbl("KDJ(9,3,3)", 2, vH - 2, "#999");
        lbl(`K:${Ks.at(-1).toFixed(1)}`, 68, vH - 2, "#f5a623");
        lbl(`D:${Ds.at(-1).toFixed(1)}`, 98, vH - 2, "#089981");
        lbl(`J:${Js.at(-1).toFixed(1)}`, 128, vH - 2, "#2d9cdb");
      } else if (ind === "RSI") {
        const rsi = RSI(closes, 14);
        [30, 70].forEach((lvl) => {
          const y = pH - (lvl / 100) * pH;
          vCtx.strokeStyle = "rgba(255,255,255,0.12)";
          vCtx.lineWidth = 1;
          vCtx.setLineDash([3, 3]);
          vCtx.beginPath();
          vCtx.moveTo(0, y);
          vCtx.lineTo(chartW, y);
          vCtx.stroke();
          vCtx.setLineDash([]);
        });
        drawSubLine(rsi, "#f5a623", 0, 100);
        lbl("RSI(14):", 2, vH - 2, "#999");
        lbl(rsi.at(-1).toFixed(2), 52, vH - 2, "#f5a623");
      } else if (ind === "BOLL") {
        volBars();
        lbl("BOLL(20,2)", 2, vH - 2, "#999");
        lbl("UB", 72, vH - 2, "rgba(255,165,0,0.9)");
        lbl("MB", 90, vH - 2, "rgba(255,255,255,0.6)");
        lbl("LB", 108, vH - 2, "rgba(100,180,255,0.9)");
      } else if (ind === "OBV") {
        let obv = 0;
        const obvArr = closes.map((v, i) => {
          if (i === 0) return 0;
          obv += v > closes[i - 1] ? vols[i] : v < closes[i - 1] ? -vols[i] : 0;
          return obv;
        });
        drawSubLine(
          obvArr,
          "#089981",
          Math.min(...obvArr),
          Math.max(...obvArr),
        );
        lbl("OBV:", 2, vH - 2, "#999");
        lbl(obvArr.at(-1).toFixed(0), 30, vH - 2, "#089981");
      } else if (ind === "DMI") {
        const dmi = closes.map((_, i) => {
          if (i < 1) return { pdi: 25, mdi: 25 };
          const tr = Math.max(
            vis[i].high - vis[i].low,
            Math.abs(vis[i].high - (vis[i - 1]?.close || 0)),
            Math.abs(vis[i].low - (vis[i - 1]?.close || 0)),
          );
          return {
            pdi:
              tr > 0
                ? (Math.max(vis[i].high - (vis[i - 1]?.high || 0), 0) / tr) *
                  100
                : 0,
            mdi:
              tr > 0
                ? (Math.max((vis[i - 1]?.low || 0) - vis[i].low, 0) / tr) * 100
                : 0,
          };
        });
        const pdi = dmi.map((d) => d.pdi),
          mdi = dmi.map((d) => d.mdi),
          dmMax = Math.max(...[...pdi, ...mdi], 1);
        drawSubLine(pdi, "#089981", 0, dmMax);
        drawSubLine(mdi, "#ff5252", 0, dmMax);
        lbl("DMI(14)", 2, vH - 2, "#999");
        lbl("+DI", 58, vH - 2, "#089981");
        lbl("-DI", 78, vH - 2, "#ff5252");
      } else if (ind === "WR") {
        const wr = closes.map((_, i) => {
          if (i < 13) return -50;
          const sl = vis.slice(i - 13, i + 1),
            hi = Math.max(...sl.map((c) => c.high)),
            lo = Math.min(...sl.map((c) => c.low));
          return hi === lo ? -50 : ((hi - closes[i]) / (hi - lo)) * -100;
        });
        drawSubLine(wr, "#f5a623", -100, 0);
        [-20, -80].forEach((lvl) => {
          const y = pH - ((lvl + 100) / 100) * pH * 0.9 - pH * 0.05;
          vCtx.strokeStyle = "rgba(255,255,255,0.12)";
          vCtx.lineWidth = 1;
          vCtx.setLineDash([3, 3]);
          vCtx.beginPath();
          vCtx.moveTo(0, y);
          vCtx.lineTo(chartW, y);
          vCtx.stroke();
          vCtx.setLineDash([]);
        });
        lbl("WR(14):", 2, vH - 2, "#999");
        lbl(wr.at(-1).toFixed(2), 48, vH - 2, "#f5a623");
      } else {
        volBars();
        const m5 = SMA(closes, 5),
          m10 = SMA(closes, 10),
          allM = [...m5, ...m10].filter(Boolean);
        if (allM.length > 1) {
          const mn = Math.min(...allM) * 0.999,
            mx = Math.max(...allM) * 1.001;
          drawSubLine(m5, "#f5a623", mn, mx);
          drawSubLine(m10, "#089981", mn, mx);
        }
        lbl(`${ind}(5,10)`, 2, vH - 2, "#999");
        lbl("—", 72, vH - 2, "#f5a623");
        lbl("—", 86, vH - 2, "#089981");
      }
      vCtx.restore();
    },
    [getVis],
  );

  const draw = useCallback(() => {
    drawCanvas(chartType, indicator);
  }, [drawCanvas, chartType, indicator]);
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  // ── Fetch candles ─────────────────────────────────────────────────────────
  useEffect(() => {
    candlesRef.current = [];
    currentRef.current = null;
    offsetRef.current = 0;
    selCandleRef.current = null;
    setSelectedCandle(null);
    setSelVisIdx(-1);
    onCandleSelectRef.current?.(null);
    setLoading(true);
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`,
    )
      .then((r) => r.json())
      .then((raw) => {
        if (!Array.isArray(raw)) return;
        onData?.(
          raw.map((c) => ({
            time: c[0],
            open: Number(c[1]),
            high: Number(c[2]),
            low: Number(c[3]),
            close: Number(c[4]),
            volume: Number(c[5]),
          })),
        );
      })
      .catch(() => {});
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=250`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        candlesRef.current = data
          .slice(0, -1)
          .map((k) => ({
            time: k[0],
            open: Number(k[1]),
            high: Number(k[2]),
            low: Number(k[3]),
            close: Number(k[4]),
            vol: Number(k[5]),
          }));
        draw();
      })
      .catch((err) => console.warn("Binance fetch failed:", err))
      .finally(() => setLoading(false));
  }, [symbol, interval]);

  // ── Live tick ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const coin = coins[symbol];
    if (!coin?.lastPrice) return;
    const price = Number(coin.lastPrice);
    const barT =
      Math.floor(Date.now() / (intervalSec * 1000)) * (intervalSec * 1000);
    const totalVol = Number(coin.volume || 0);
    lastVolRef.current = totalVol;
    if (!currentRef.current || currentRef.current.time !== barT) {
      if (currentRef.current) {
        candlesRef.current.push({ ...currentRef.current });
        if (candlesRef.current.length > 200) candlesRef.current.shift();
      }
      candleStartVolRef.current = totalVol;
      currentRef.current = {
        time: barT,
        open: price,
        high: price,
        low: price,
        close: price,
        vol: 0,
      };
    } else {
      const c = currentRef.current;
      c.high = Math.max(c.high, price);
      c.low = Math.min(c.low, price);
      c.close = price;
      c.vol = Math.abs(totalVol - candleStartVolRef.current);
    }
    if (!selCandleRef.current)
      onCandleSelectRef.current?.(
        currentRef.current ? { ...currentRef.current, _isLive: true } : null,
      );
    draw();
  }, [coins, symbol, intervalSec, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    let rafId = null;
    const obs = new ResizeObserver(() => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        draw();
      });
    });
    if (mainRef.current) obs.observe(mainRef.current);
    if (volRef.current) obs.observe(volRef.current);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      obs.disconnect();
    };
  }, [draw]);

  const loadMoreHistory = useCallback(() => {
    if (loadingMoreRef.current || !candlesRef.current.length) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=250&endTime=${candlesRef.current[0].time - 1}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data) || !data.length) return;
        const nc = data.map((k) => ({
          time: k[0],
          open: Number(k[1]),
          high: Number(k[2]),
          low: Number(k[3]),
          close: Number(k[4]),
          vol: Number(k[5]),
        }));
        candlesRef.current = [...nc, ...candlesRef.current];
        offsetRef.current += nc.length;
        draw();
      })
      .catch((e) => console.warn("Load more failed:", e))
      .finally(() => {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      });
  }, [symbol, interval, draw]);
  useEffect(() => {
    loadMoreRef.current = loadMoreHistory;
  }, [loadMoreHistory]);

  useEffect(() => {
    const canvas = mainRef.current;
    if (!canvas) return;
    const onWheel = (e) => {
      e.preventDefault();
      zoomRef.current = Math.max(
        10,
        Math.min(250, zoomRef.current + (e.deltaY > 0 ? 5 : -5)),
      );
      draw();
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [draw]);

  // ── Candle select helper (shared by mouse + touch) ────────────────────────
  const selectAtX = useCallback((tapX) => {
    const canvas = mainRef.current;
    if (!canvas) return;
    const all = [
      ...candlesRef.current,
      ...(currentRef.current ? [currentRef.current] : []),
    ];
    const maxOffset = Math.max(0, all.length - 10);
    const offset = Math.max(0, Math.min(offsetRef.current, maxOffset));
    const end = offset > 0 ? all.length - offset : all.length;
    const vis = all.slice(Math.max(0, end - zoomRef.current), end);
    if (!vis.length) return;
    const barW = Math.max(
      4,
      Math.floor((canvas.clientWidth - 60) / vis.length) - 1,
    );
    let nearestIdx = -1,
      minDist = Infinity;
    for (let i = 0; i < vis.length; i++) {
      const dist = Math.abs(tapX - (Math.floor(i * (barW + 1)) + barW / 2));
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    if (nearestIdx < 0) return;
    if (selCandleRef.current?.visIdx === nearestIdx) {
      selCandleRef.current = null;
      setSelectedCandle(null);
      setSelVisIdx(-1);
      onCandleSelectRef.current?.(
        currentRef.current ? { ...currentRef.current, _isLive: true } : null,
      );
    } else {
      selCandleRef.current = { visIdx: nearestIdx };
      setSelectedCandle({ ...vis[nearestIdx] });
      setSelVisIdx(nearestIdx);
      setPopupX(tapX);
      onCandleSelectRef.current?.({ ...vis[nearestIdx] });
    }
    drawRef.current?.();
  }, []);

  // ── Pointer Events handler (mouse + touch unified) ────────────────────────
  const handlePointerDown = useCallback((e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: offsetRef.current,
      movedX: 0,
      startTime: Date.now(),
      pointerId: e.pointerId,
    };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (
      !pointerRef.current.active ||
      e.pointerId !== pointerRef.current.pointerId
    )
      return;
    const dx = pointerRef.current.startX - e.clientX;
    pointerRef.current.movedX = Math.abs(dx);
    const canvas = mainRef.current;
    if (!canvas) return;
    const barW = Math.max(
      2,
      Math.floor((canvas.clientWidth - 60) / zoomRef.current) - 1,
    );
    offsetRef.current = Math.max(
      0,
      pointerRef.current.startOffset + Math.round(dx / (barW + 1)),
    );
    if (offsetRef.current > candlesRef.current.length - 25)
      loadMoreRef.current?.();
    drawRef.current?.();
  }, []);

  const handlePointerUp = useCallback(
    (e) => {
      if (
        !pointerRef.current.active ||
        e.pointerId !== pointerRef.current.pointerId
      )
        return;
      pointerRef.current.active = false;
      const elapsed = Date.now() - pointerRef.current.startTime;
      if (pointerRef.current.movedX < 8 && elapsed < 400) {
        const canvas = mainRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        selectAtX(e.clientX - rect.left);
      }
    },
    [selectAtX],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(13,17,23,0.75)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                border: "2px solid #f5a623",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <span style={{ color: "#f5a623", fontSize: "11px" }}>
              Loading chart…
            </span>
          </div>
        </div>
      )}

      {/* {selectedCandle && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 50,
            borderRadius: "0 0.5rem 1rem 0.5rem",
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: 500,
            // background: "rgba(10,14,22,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: 145,
            padding: "8px 8px",
            lineHeight: 1.7,
            backdropFilter: "blur(4px)",
          }}
        >
          <button
            onClick={() => {
              selCandleRef.current = null;
              setSelectedCandle(null);
              setSelVisIdx(-1);
              onCandleSelectRef.current?.(
                currentRef.current
                  ? { ...currentRef.current, _isLive: true }
                  : null,
              );
              draw();
            }}
            style={{
              position: "absolute",
              top: 4,
              right: 8,
              color: "#666",
              fontSize: 14,
              lineHeight: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <div>
            <span style={{ color: "#666", marginRight: 4 }}>T:</span>
            <span style={{ color: "#ddd" }}>
              {fmtCandleTime(selectedCandle.time)}
            </span>
          </div>
          {[
            ["O", selectedCandle.open],
            ["C", selectedCandle.close],
          ].map(([l, v]) => (
            <div key={l}>
              <span style={{ color: "#666", marginRight: 4 }}>{l}:</span>
              <span
                style={{
                  color:
                    selectedCandle.close >= selectedCandle.open
                      ? "#089981"
                      : "#ff5252",
                }}
              >
                {fmtPrice(v)}
              </span>
            </div>
          ))}
          {[
            ["H", selectedCandle.high],
            ["L", selectedCandle.low],
          ].map(([l, v]) => (
            <div key={l}>
              <span style={{ color: "#666", marginRight: 4 }}>{l}:</span>
              <span style={{ color: "#ddd" }}>{fmtPrice(v)}</span>
            </div>
          ))}
          <div>
            <span style={{ color: "#666", marginRight: 4 }}>V:</span>
            <span style={{ color: "#ddd" }}>{fmtVol(selectedCandle.vol)}</span>
          </div>
        </div>
      )} */}

      {/* Loading history indicator */}
      {loadingMore && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 8,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 8px",
            borderRadius: "9999px",
            background: "rgba(13,17,23,0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              border: "1px solid #f5a623",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <span style={{ color: "#f5a623", fontSize: "10px" }}>
            Loading history…
          </span>
        </div>
      )}

      {/* Zoom buttons */}
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "40px",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            zoomRef.current = Math.max(10, zoomRef.current - 10);
            draw();
          }}
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            userSelect: "none",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
          }}
        >
          +
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            zoomRef.current = Math.min(250, zoomRef.current + 10);
            draw();
          }}
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            userSelect: "none",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
          }}
        >
          −
        </button>
      </div>

      {/* Scroll offset badge */}
      {offsetRef.current > 0 && (
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: "4px",
            zIndex: 10,
            fontSize: "10px",
            padding: "2px 4px",
            borderRadius: "9999px",
            background: "rgba(255,255,255,0.08)",
            color: "#888",
            pointerEvents: "none",
          }}
        >
          ← {offsetRef.current} candles back
        </div>
      )}

      {/* Overlay div: captures Pointer Events for both mouse and touch */}
      <div
        style={{
          flex: "1 1 0",
          width: "100%",
          position: "relative",
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerRef.current.active = false;
        }}
      >
        <canvas
          ref={mainRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            cursor: "crosshair",
            touchAction: "none",
          }}
        />
      </div>

      <canvas
        ref={volRef}
        style={{ width: "100%", flexShrink: 0, height: "70px" }}
      />
    </div>
  );
};
