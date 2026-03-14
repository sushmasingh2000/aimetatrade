import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../services/urls";

const TABS = ["Change", "Top Losers", "24h turnover"];
const HISTORY_LIMIT = 20;

const formatPrice = (price) => {
    const n = Number(price);
    if (!Number.isFinite(n)) return "0";
    if (n < 0.00001) return n.toFixed(8);
    if (n < 1) return n.toFixed(5);
    if (n > 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
    return n.toFixed(4);
};

const formatVolume = (vol) => {
    const n = Number(vol);
    if (!Number.isFinite(n)) return "0.00";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return n.toFixed(2);
};

const formatPair = (rawSymbol) => {
    const symbol = String(rawSymbol || "").toUpperCase().replace(/[^A-Z]/g, "");
    if (symbol.length === 6) {
        return {
            base: symbol.slice(0, 3),
            quote: symbol.slice(3),
        };
    }
    if (symbol.length > 6) {
        return {
            base: symbol.slice(0, symbol.length - 3),
            quote: symbol.slice(-3),
        };
    }
    return { base: String(rawSymbol || "?"), quote: "USD" };
};

const CURRENCY_TO_FLAG = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    NZD: "nz",
    INR: "in",
    AED: "ae",
    SGD: "sg",
};

const getForexImage = (rawSymbol) => {
    const { quote } = formatPair(rawSymbol);
    const code = CURRENCY_TO_FLAG[String(quote || "").toUpperCase()];
    if (code) return `https://flagcdn.com/w40/${code}.png`;
    return "https://assets.coincap.io/assets/icons/usdt@2x.png";
};

const toTradingViewSymbol = (rawSymbol) => {
    const clean = String(rawSymbol || "")
        .toUpperCase()
        .replace(/^(FX:|FX_IDC:|OANDA:)/, "")
        .replace(/[^A-Z]/g, "");

    if (clean.length !== 6) return "FX_IDC:EURUSD";

    const base = clean.slice(0, 3);
    const quote = clean.slice(3);
    const invertUsdPairs = new Set(["EUR", "GBP", "AUD", "NZD"]);

    const pair = base === "USD" && invertUsdPairs.has(quote)
        ? `${quote}${base}`
        : `${base}${quote}`;

    return `FX_IDC:${pair}`;
};

function Sparkline({ history = [], positive }) {
    const canvasRef = useRef(null);
    const W = 56;
    const H = 24;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || history.length < 2) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = W * dpr;
        canvas.height = H * dpr;

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const data = history.slice(-HISTORY_LIMIT);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const points = data.map((value, i) => ({
            x: (i / (data.length - 1)) * W,
            y: H - ((value - min) / range) * H,
        }));

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = positive ? "#089981" : "#ff5252";
        ctx.lineWidth = 1;
        ctx.stroke();
    }, [history, positive]);

    return (
        <canvas ref={canvasRef} style={{ width: W, height: H, display: "block" }} />
    );
}

function PairAvatar({ image, label }) {
    const [failed, setFailed] = useState(false);
    const letter = String(label || "?")[0] || "?";

    if (!image || failed) {
        return (
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "#1d4ed8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 14,
                }}
            >
                {letter}
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={label}
            onError={() => setFailed(true)}
            style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "contain",
                backgroundColor: "#1a2030",
            }}
        />
    );
}

function ForexRow({ row, tab, onClick }) {
    const change = Number(row.price_change_percentage_24h ?? 0);
    const positive = change >= 0;
    const pair = formatPair(row.symbol);

    return (
        <div
            onClick={onClick}
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 64px 90px",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                columnGap: 12,
                cursor: "pointer",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PairAvatar image={row.image} label={pair.base} />
                <div>
                    <div style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>
                        {pair.base}
                        <span style={{ color: "#6b7280", fontSize: 10 }}> / {pair.quote}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {formatPrice(row.current_price || "0")}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                {tab !== 2 ? (
                    <Sparkline history={row.history || []} positive={positive} />
                ) : (
                    <span style={{ color: "#6b7280", fontSize: 11 }}>
                        {formatVolume(row.total_volume || "0")}
                    </span>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {tab !== 2 ? (
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid",
                            backgroundColor: positive
                                ? "rgba(67, 71, 71, 0.1)"
                                : "rgba(255,82,82,0.1)",
                            color: positive ? "#089981" : "#ff5252",
                            borderColor: positive ? "#089981" : "#ff5252",
                        }}
                    >
                        {positive ? "+" : ""}
                        {change.toFixed(2)}%
                    </span>
                ) : (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
                        {formatVolume(row.total_volume || "0")}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function ForexMarketTable() {
    const [tab, setTab] = useState(0);
    const historyRef = useRef({});
    const navigate = useNavigate();

    const fetchForex = async () => {
        const res = await axios.get(endpoint.get_live_forex_data);
        return res?.data || {};
    };

    const { data = {} } = useQuery({
        queryKey: ["forex-market-table"],
        queryFn: fetchForex,
        refetchInterval: 30000,
        staleTime: 25000,
        retry: 1,
    });

    const rows = useMemo(() => {
        const quotes =
            data?.quotes && typeof data.quotes === "object"
                ? data.quotes
                : data?.result?.quotes && typeof data.result.quotes === "object"
                    ? data.result.quotes
                    : {};

        return Object.entries(quotes)
            .map(([symbol, value]) => {
                const normalizedSymbol = String(symbol || "").toUpperCase();
                const pair = formatPair(normalizedSymbol);
                const price = Number(value ?? 0);

                const prevHistory = historyRef.current[normalizedSymbol] || [];
                const previousPrice = prevHistory.length
                    ? prevHistory[prevHistory.length - 1]
                    : null;

                const nextHistory = Number.isFinite(price)
                    ? [...prevHistory, price].slice(-HISTORY_LIMIT)
                    : prevHistory;

                historyRef.current[normalizedSymbol] = nextHistory;

                const changePercent =
                    previousPrice && Number(previousPrice) !== 0
                        ? ((price - Number(previousPrice)) / Number(previousPrice)) * 100
                        : 0;
                return {
                    symbol: normalizedSymbol,
                    image: getForexImage(normalizedSymbol),
                    current_price: Number.isFinite(price) ? price : 0,
                    price_change_percentage_24h: Number.isFinite(changePercent)
                        ? changePercent
                        : 0,
                    total_volume: Number.isFinite(price) ? price : 0,
                    history: nextHistory,
                };
            })
            .filter((row) => row.symbol && Number(row.current_price) > 0);
    }, [data]);

    const displayData =
        tab === 0
            ? [...rows].sort(
                (a, b) =>
                    Number(b.price_change_percentage_24h) -
                    Number(a.price_change_percentage_24h),
            )
            : tab === 1
                ? [...rows].sort(
                    (a, b) =>
                        Number(a.price_change_percentage_24h) -
                        Number(b.price_change_percentage_24h),
                )
                : [...rows].sort(
                    (a, b) => Number(b.total_volume) - Number(a.total_volume),
                );

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    marginBottom: 12,
                }}
            >
                {TABS.map((label, i) => (
                    <button
                        key={label}
                        onClick={() => setTab(i)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                            color: tab === i ? "#ad49ff" : "#6b7280",
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {displayData.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#6b7280" }}>
                    Loading forex data…
                </div>
            )}

            {displayData.map((row, index) => (
                <ForexRow
                    key={`${row.symbol}-${index}`}
                    row={row}
                    tab={tab}
                    onClick={() => navigate(`/forex-chart?symbol=${encodeURIComponent(toTradingViewSymbol(row.symbol))}`)}
                />
            ))}
        </div>
    );
}