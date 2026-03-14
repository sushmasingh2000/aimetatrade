import React, { useState } from "react";
import { SYMBOL_TO_ID } from "./UseLivemarket";
import { apiConnectorGet } from "../services/apiconnector";
import { endpoint } from "../services/urls";
import { useQuery } from "react-query";

const coinAccent = {
    BTCUSDT: "linear-gradient(90deg,#f7931a,#ffb347)",
    ETHUSDT: "linear-gradient(90deg,#627eea,#a0b4f8)",
    SOLUSDT: "linear-gradient(90deg,#9945ff,#14f195)",
    BNBUSDT: "linear-gradient(90deg,#f3ba2f,#f0d060)",
    ADAUSDT: "linear-gradient(90deg,#0033ad,#3b82f6)",
    AVAXUSDT: "linear-gradient(90deg,#e84142,#ff7b7c)",
    LINKUSDT: "linear-gradient(90deg,#2a5ada,#4d88ff)",
    DOTUSDT: "linear-gradient(90deg,#e6007a,#ff6bbd)",
    SYSTEM: "linear-gradient(90deg,#00e5ff,#0088aa)",
};

function normalizeRow(row, index) {
    const pnl = Number(row.pnl ?? 0);
    const base = row.coin.split("/")[0];
    const symbol = base + "USDT";
    const coin = row.coin;

    return {
        id: row.transaction ?? index + 1,
        coin,
        symbol,
        pair: row.pair ?? "–",
        profit: pnl,
        profitPct: null,
        side: pnl >= 0 ? "LONG" : "SHORT",
        closedAt: row.closedAt
            ? new Date(row.closedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            : "–",
    };
}

// ── Coin logo helper ──────────────────────────────────────────────────────────
const COIN_LOGO = (symbol) => {
    const id = SYMBOL_TO_ID[symbol];
    return id
        ? `https://assets.coincap.io/assets/icons/${id}@2x.png`
        : `https://cryptoicons.org/api/color/${symbol.toLowerCase()}/64`;
};

function CoinAvatar({ symbol }) {
    const [failed, setFailed] = useState(false);
    const fallbackBgs = [
        "bg-cyan-800",
        "bg-emerald-800",
        "bg-violet-800",
        "bg-amber-800",
        "bg-rose-800",
        "bg-blue-800",
        "bg-green-800",
        "bg-orange-800",
    ];
    const bg = fallbackBgs[symbol.charCodeAt(0) % fallbackBgs.length];

    if (failed || symbol === "SYSTEM") {
        return (
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-cyan-900/30 text-white font-bold text-sm font-mono ${bg}`}
            >
                {symbol[0]}
            </div>
        );
    }
    return (
        <img
            src={COIN_LOGO(symbol)}
            alt={symbol}
            className="w-9 h-9 rounded-full bg-[#1a2030] border border-cyan-900/30 object-contain flex-shrink-0"
            onError={() => setFailed(true)}
        />
    );
}

const fmtPrice = (n) =>
    n >= 1000
        ? n.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        : n < 0.01
            ? n.toFixed(4)
            : n.toFixed(2);

// ── Main component ────────────────────────────────────────────────────────────
export default function TradeGraph() {
    const [filter, setFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("date");

    // Fetch logged-in user
    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => apiConnectorGet(endpoint.member_details),
        enabled: !!endpoint?.member_details,
        refetchOnMount: false,
        refetchOnWindowFocus: true,
    });
    const user = userData?.data?.result?.[0] || {};

    // Fetch trades — normalized immediately after fetch
    const {
        data: trades = [],
        isLoading: tradesLoading,
        isFetching: tradesFetching,
    } = useQuery({
        queryKey: ["myTrades", user?.lgn_cust_id],
        queryFn: async () => {
            const res = await apiConnectorGet(endpoint.my_trades);
            const rows = res?.data?.result ?? [];
            return rows.map(normalizeRow);
        },
        enabled: !!user?.lgn_cust_id,
        staleTime: 5 * 60 * 1000,
    });

    const pageLoading = userLoading || tradesLoading || tradesFetching;

    const totalProfit = trades.reduce((s, t) => s + t.profit, 0);
    const wins = trades.filter((t) => t.profit > 0).length;
    const winRate =
        trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) : "0";

    // Filter + sort
    const filtered = trades
        .filter(
            (t) =>
                filter === "ALL" || (filter === "WIN" ? t.profit > 0 : t.profit < 0),
        )
        .sort((a, b) =>
            sortBy === "date"
                ? b.id - a.id
                : sortBy === "profit"
                    ? b.profit - a.profit
                    : Math.abs(b.profit) - Math.abs(a.profit),
        );

    return (
        <div>
            <div
                style={{
                    minHeight: "100vh",
                   
                    color: "#e0f7fa",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    paddingBottom: "110px",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {/* Ambient glows */}
                <div
                    style={{
                        position: "fixed",
                        top: "-112px",     // -28 * 4 (Tailwind rem)
                        left: "-64px",     // -16 * 4
                        width: "384px",    // w-96 = 24rem * 16px = 384px
                        height: "384px",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        background:
                            "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)",
                    }}
                />
                <div
                    style={{
                        position: "fixed",
                        bottom: "-96px",  // -24 * 4
                        right: "-48px",   // -12 * 4
                        width: "320px",   // w-80 = 20rem * 16px
                        height: "320px",
                        borderRadius: "50%",
                        pointerEvents: "none",
                        background:
                            "radial-gradient(circle, rgba(0,180,200,0.05) 0%, transparent 70%)",
                    }}
                />

                {/* ── Header ── */}
                <header
                    style={{
                        maxWidth: "960px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        paddingTop: "24px",     // pt-6 = 1.5rem * 16px
                        marginBottom: "28px",   // mb-7 = 1.75rem * 16px
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "16px",
                    }}
                >
                    <div>
                        <p
                            style={{
                                fontSize: "10px",
                                letterSpacing: "0.2em",
                                color: "rgba(6, 182, 212, 0.6)", // cyan-400/60
                                marginBottom: "6px",             // mb-1.5
                                fontFamily: "monospace",
                            }}
                        >
                            TRADE HISTORY
                        </p>
                        <h1
                            style={{
                                fontSize: "1.5rem",   // text-2xl
                                fontWeight: "bold",
                                color: "#e0f7fa",     // text-cyan-50
                                letterSpacing: "-0.025em",
                                fontFamily: "monospace",
                                margin: 0,
                            }}
                        >
                            My Closed Trades
                        </h1>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",   // gap-2.5
                        }}
                    >
                        <StatPill
                            label="Total P&L"
                            value={`${totalProfit >= 0 ? "+" : "–"}$${fmtPrice(Math.abs(totalProfit))}`}
                            color={totalProfit >= 0 ? "emerald" : "red"}
                        />
                        <StatPill
                            label="Win Rate"
                            value={`${winRate}%`}
                            color={Number(winRate) >= 50 ? "emerald" : "red"}
                        />
                        <StatPill
                            label="Trades"
                            value={String(trades.length)}
                            color="cyan"
                        />
                    </div>
                </header>

                {/* ── Controls ── */}
                <div
                    style={{
                        maxWidth: "960px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: "24px", // mb-6 = 1.5rem * 16
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "12px", // gap-3
                    }}
                >
                    <div style={{ display: "flex", gap: "6px" }}> {/* gap-1.5 */}
                        {["ALL", "WIN", "LOSS"].map((f) => (
                            <FilterBtn
                                key={f}
                                active={filter === f}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </FilterBtn>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                            style={{
                                fontSize: "11px",
                                color: "#94a3b8", // slate-500
                                letterSpacing: "0.05em", // tracking-wide
                                fontFamily: "monospace",
                                marginRight: "4px", // mr-1
                            }}
                        >
                            Sort:
                        </span>
                        {[
                            ["date", "Date"],
                            ["profit", "P&L"],
                            ["pct", "Abs P&L"],
                        ].map(([v, l]) => (
                            <FilterBtn
                                key={v}
                                active={sortBy === v}
                                onClick={() => setSortBy(v)}
                            >
                                {l}
                            </FilterBtn>
                        ))}
                    </div>
                </div>

                {/* Loader */}
                {pageLoading && (
                    <div
                        className="max-w-[960px] mx-auto grid gap-4"
                        style={{
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-36 rounded-2xl bg-cyan-400/5 border border-cyan-400/10 animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!pageLoading && filtered.length === 0 && (
                    <div
                        style={{
                            maxWidth: "960px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: "80px",   // py-20 = 5rem * 16
                            paddingBottom: "80px",
                            gap: "12px",          // gap-3
                        }}
                    >
                        <div
                            style={{
                                width: "56px",       // w-14 = 3.5rem * 16
                                height: "56px",      // h-14
                                borderRadius: "9999px", // rounded-full
                                backgroundColor: "rgba(6, 182, 212, 0.05)", // bg-cyan-400/5
                                border: "1px solid rgba(6, 182, 212, 0.1)", // border-cyan-400/10
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "32px",           // text-2xl
                                    color: "rgba(6, 182, 212, 0.3)", // text-cyan-400/30
                                }}
                            >
                                ∅
                            </span>
                        </div>

                        <p
                            style={{
                                fontFamily: "monospace",
                                fontSize: "11px",
                                letterSpacing: "0.15em",         // tracking-[0.15em]
                                color: "rgba(6, 182, 212, 0.3)", // text-cyan-400/30
                                textTransform: "uppercase",
                            }}
                        >
                            No trades found
                        </p>
                    </div>
                )}

                {/* ── Cards grid ── */}
                {!pageLoading && filtered.length > 0 && (
                    <div
                        style={{
                            maxWidth: "960px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            display: "grid",
                            gap: "16px", // gap-4
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        }}
                    >
                        {filtered.map((t, i) => (
                            <TradeCard key={t.id} trade={t} index={i} />
                        ))}
                    </div>
                )}

                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
          .trade-card {
            opacity: 0;
            transform: translateY(16px);
            animation: tradeIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
          }
          .trade-card:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 12px 40px rgba(0,229,255,0.12), 0 0 0 1px rgba(0,229,255,0.18) !important;
            transition: all 0.2s ease !important;
          }
          @keyframes tradeIn { to { opacity:1; transform:translateY(0); } }
        `}</style>
            </div>
        </div>
    );
}

/* ── Trade Card ──────────────────────────────────────────────────────────── */
function TradeCard({ trade: t, index }) {
    const pos = t.profit >= 0;

    return (
        <div
            style={{
                borderRadius: "1rem", // rounded-2xl
                overflow: "hidden",
                border: "1px solid rgba(6, 182, 212, 0.1)", // border-cyan-400/10
                background: "rgba(6,18,26,0.85)", // bg-[rgba(6,18,26,0.85)]
                backdropFilter: "blur(12px)", // backdrop-blur-md
                position: "relative",
                animationDelay: `${index * 60}ms`,
            }}
        >
            {/* Accent bar */}
            <div
                style={{
                    height: "3px",
                    width: "100%",
                    background: coinAccent[t.symbol] ?? "linear-gradient(90deg,#00e5ff,#0088aa)",
                }}
            />

            {/* Top row */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "14px 16px 10px 16px", // pt-3.5 pb-2.5 px-4
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <CoinAvatar symbol={t.symbol} />
                    <div>
                        <p
                            style={{
                                fontSize: "14px", // text-sm
                                fontWeight: 600,   // font-semibold
                                color: "rgba(203,213,225,1)", // text-slate-300
                                marginBottom: "2px",
                            }}
                        >
                            {t.coin}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(107,114,128,1)" }}>
                            <span>{t.pair}</span>
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "9px",
                                    padding: "1px 6px", // py-px px-1.5
                                    borderRadius: "4px",
                                    border: pos ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(239,68,68,0.15)",
                                    backgroundColor: pos ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                    color: pos ? "rgba(16,185,129,1)" : "rgba(239,68,68,1)",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {pos ? "WIN" : "LOSS"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* P&L */}
                <div style={{ textAlign: "right" }}>
                    <p
                        style={{
                            fontFamily: "monospace",
                            fontSize: "17px",
                            fontWeight: "bold",
                            color: pos ? "rgba(16,185,129,1)" : "rgba(239,68,68,1)",
                        }}
                    >
                        {pos ? "+" : "–"}${fmtPrice(Math.abs(t.profit))}
                    </p>
                    <p
                        style={{
                            fontFamily: "monospace",
                            fontSize: "12px", // text-xs
                            marginTop: "2px",
                            color: pos ? "rgba(16,185,129,1)" : "rgba(239,68,68,1)",
                        }}
                    >
                        {pos ? "▲ PROFIT" : "▼ LOSS"}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", margin: "0 16px", backgroundColor: "rgba(6,182,212,0.07)" }} />

            {/* Detail grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px", // gap-2.5
                    padding: "12px 16px", // py-3 px-4
                }}
            >
                <DetailCell
                    label="Transaction Id"
                    value={String(t.id).padStart(2, "0")}
                    accent
                />
                <DetailCell label="Pair" value={t.pair} />
                <DetailCell
                    label="P&L"
                    value={`${pos ? "+" : "–"}$${fmtPrice(Math.abs(t.profit))}`}
                />
                <DetailCell label="Date" value={t.closedAt} />
            </div>
        </div>
    );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function DetailCell({ label, value, accent }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
                style={{
                    fontSize: "9px",
                    color: "rgba(107,114,128,1)", // text-slate-600
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: "12px", // text-xs
                    fontWeight: 500, // font-medium
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: accent ? "rgba(16,185,129,1)" : "rgba(148,163,184,1)", // cyan-400 or slate-400
                    fontFamily: accent ? "monospace" : "inherit", // font-mono if accent
                }}
            >
                {value}
            </span>
        </div>
    );
}

function StatPill({ label, value, color }) {
    const scheme = {
        cyan: {
            color: "rgba(6,182,212,1)", // text-cyan-400
            borderColor: "rgba(6,182,212,0.125)", // border-cyan-400/20
            backgroundColor: "rgba(6,182,212,0.06)", // bg-cyan-400/[0.06]
        },
        emerald: {
            color: "rgba(16,185,129,1)", // text-emerald-400
            borderColor: "rgba(16,185,129,0.125)", // border-emerald-400/20
            backgroundColor: "rgba(16,185,129,0.06)", // bg-emerald-400/[0.06]
        },
        red: {
            color: "rgba(239,68,68,1)", // text-red-400
            borderColor: "rgba(239,68,68,0.125)", // border-red-400/20
            backgroundColor: "rgba(239,68,68,0.06)", // bg-red-400/[0.06]
        },
    };

    const style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: "12px",
        borderWidth: "1px",
        borderStyle: "solid",
        ...scheme[color],
    };

    const labelStyle = {
        fontSize: "9px",
        letterSpacing: "0.12em",
        color: "rgba(148,163,184,1)", // slate-500
        marginBottom: "2px",
    };

    const valueStyle = {
        fontFamily: "monospace",
        fontSize: "15px",
        fontWeight: "bold",
    };

    return (
        <div style={style}>
            <span style={labelStyle}>{label}</span>
            <span style={valueStyle}>{value}</span>
        </div>
    );
}

function FilterBtn({ children, active, onClick }) {
    const activeStyle = {
        backgroundColor: "rgba(6,182,212,0.1)", // bg-cyan-400/10
        borderColor: "rgba(6,182,212,0.4)",     // border-cyan-400/40
        color: "rgba(6,182,212,1)",             // text-cyan-400
    };

    const inactiveStyle = {
        backgroundColor: "transparent",
        borderColor: "rgba(6,182,212,0.15)",   // border-cyan-400/15
        color: "rgba(148,163,184,1)",          // text-slate-500
    };

    const hoverStyle = {
        color: "rgba(203,213,225,1)",          // text-slate-300
        borderColor: "rgba(6,182,212,0.25)",   // border-cyan-400/25
    };

    const baseStyle = {
        fontFamily: "monospace",
        fontSize: "11px",
        letterSpacing: "0.05em",
        padding: "4px 14px",   // px-3.5 py-1
        borderRadius: "9999px", // rounded-full
        borderWidth: "1px",
        borderStyle: "solid",
        cursor: "pointer",
        transition: "all 150ms",
        outline: "none",
    };

    const [hover, setHover] = React.useState(false);

    return (
        <button
            onClick={onClick}
            style={{
                ...baseStyle,
                ...(active ? activeStyle : inactiveStyle),
                ...(!active && hover ? hoverStyle : {}),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
        </button>
    );
}
