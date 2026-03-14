import { useState, useEffect } from "react";

const ALL_SYMBOLS = [
  "BTCUSDT","ETHUSDT","TRXUSDT",
  "ZECUSDT","DOGEUSDT","DASHUSDT","XRPUSDT",
  "YFIUSDT","SHIBUSDT","LTCUSDT","ADAUSDT",
  "FILUSDT","DOTUSDT","LINKUSDT","BCHUSDT",
  "BNBUSDT",
];
export const SYMBOL_TO_ID = {
  BTCUSDT:  "btc2",
  ETHUSDT:  "eth2",
  TRXUSDT:  "trx",
  ZECUSDT:  "zec2",
  DOGEUSDT: "doge3",
  DASHUSDT: "dash",
  XRPUSDT:  "xrp",
  YFIUSDT:  "mtv",
  SHIBUSDT: "shib",
  LTCUSDT:  "ltc",
  ADAUSDT:  "ada4",
  FILUSDT:  "fil",
  DOTUSDT:  "dot2",
  LINKUSDT: "link",
  BCHUSDT:  "bch",
  BNBUSDT:  "bnb3"
};

const WS_URL =
  "wss://stream.binance.com:443/stream?streams=" +
  ALL_SYMBOLS.map((s) => `${s.toLowerCase()}@ticker`).join("/");

// Multiple CORS proxies — rotate on failure
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://cors-anywhere.herokuapp.com/${url}`,
];

const BINANCE_TICKER_URL =
  "https://api.binance.com/api/v3/ticker/24hr";

const MAX_HISTORY  = 50;
const POLL_MS      = 2000;

// ── Module-level singleton state ──────────────────────────────────────────────
const _subscribers = new Set();
const _coins       = {};
const _history     = {};
let _mode          = "connecting";
let _proxyIndex    = 0;

function pushHistory(sym, price) {
  if (!_history[sym]) _history[sym] = [];
  const h = _history[sym];
  if (h[h.length - 1] !== price) {
    h.push(price);
    if (h.length > MAX_HISTORY) h.shift();
  }
  return [...h];
}

function setCoin(
  sym,
  price,
  changePercent,
  volume,
  extra = {}      // ← optional 24h fields
) {
  const history = pushHistory(sym, Number(price));

  _coins[sym] = {
    symbol: sym,

    // existing fields (unchanged)
    lastPrice: String(price),
    priceChangePercent: String(changePercent),
    quoteVolume: String(volume ?? 0),
    history,

    // NEW — 24h stats (safe defaults)
    openPrice:  String(extra.openPrice  ?? _coins[sym]?.openPrice  ?? price),
    highPrice:  String(extra.highPrice  ?? _coins[sym]?.highPrice  ?? price),
    lowPrice:   String(extra.lowPrice   ?? _coins[sym]?.lowPrice   ?? price),
    volume:     String(extra.volume     ?? _coins[sym]?.volume     ?? 0),
  };
}

function notify() {
  const snap = { coins: { ..._coins }, mode: _mode };
  _subscribers.forEach((fn) => fn(snap));
}

// ── REST polling fallback ─────────────────────────────────────────────────────
let _pollTimer = null;

async function fetchViaProxy() {
  const make = CORS_PROXIES[_proxyIndex % CORS_PROXIES.length];
  const url  = make(BINANCE_TICKER_URL);

  try {
    const res  = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    // data may be wrapped by proxy
    const arr = Array.isArray(data) ? data : data?.contents ? JSON.parse(data.contents) : null;
    if (!arr) throw new Error("bad shape");

    arr.forEach((t) => {
      if (ALL_SYMBOLS.includes(t.symbol)) {
        setCoin(t.symbol, t.lastPrice, t.priceChangePercent, t.quoteVolume);
      }
    });

    _mode = "polling";
    notify();
  } catch (err) {
    console.warn(`Proxy[${_proxyIndex}] failed:`, err.message);
    _proxyIndex++;          // rotate to next proxy
    if (_proxyIndex >= CORS_PROXIES.length * 2) _proxyIndex = 0; // reset after cycling
  }
}

function startPolling() {
  if (_pollTimer) return;
  fetchViaProxy(); // immediate first call
  _pollTimer = setInterval(fetchViaProxy, POLL_MS);
}

function stopPolling() {
  if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
}

// ── WebSocket ─────────────────────────────────────────────────────────────────
let _ws          = null;
let _wsTimer     = null;
let _wsInitialized = false;

function connectWS() {
  if (_ws) { try { _ws.onclose = null; _ws.close(); } catch (_) {} }

  let ws;
  try { ws = new WebSocket(WS_URL); }
  catch (_) { startPolling(); return; }
  _ws = ws;

  let alive = false;

  // Give WS 4 seconds to produce data; else fall back to polling
  const deadline = setTimeout(() => {
    if (!alive) {
      console.warn("WS timeout → starting REST polling");
      ws.onclose = null;
      ws.close();
      startPolling();
    }
  }, 4000);

  ws.onmessage = (e) => {
    if (!alive) {
      alive = true;
      clearTimeout(deadline);
      stopPolling(); // WS works — stop polling
      _mode = "ws";
    }
    try {
      const d = JSON.parse(e.data)?.data;
      if (!d?.s) return;
      setCoin(d.s, d.c, d.P, d.q, {
        openPrice: d.o,
        highPrice: d.h,
        lowPrice:  d.l,
        volume:    d.v,
      });
      notify();
    } catch (_) {}
  };

  ws.onerror = () => { clearTimeout(deadline); };

  ws.onclose = () => {
    clearTimeout(deadline);
    _mode = "connecting";
    if (alive) {
      // Was working — reconnect
      _wsTimer = setTimeout(connectWS, 2000);
    } else {
      // Never worked — use polling
      startPolling();
    }
  };
}

function init() {
  if (_wsInitialized) return;
  _wsInitialized = true;
  connectWS();
}

// ── React hook ────────────────────────────────────────────────────────────────

export function useLiveMarket() {
  const [state, setState] = useState({ coins: { ..._coins }, mode: _mode });

  useEffect(() => {
    init();
    const handler = (snap) => setState(snap);
    _subscribers.add(handler);
    // Immediately hydrate with cached data
    if (Object.keys(_coins).length) {
      setState({ coins: { ..._coins }, mode: _mode });
    }
    return () => _subscribers.delete(handler);
  }, []);

  return state;
}