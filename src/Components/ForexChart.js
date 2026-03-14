import React, { useEffect, useRef, memo } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "./Layouts/Header2";

const normalizeTradingViewSymbol = (rawSymbol) => {
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

function ForexChart() {
    const container = useRef();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const symbol = normalizeTradingViewSymbol(query.get("symbol") || "FX_IDC:EURUSD");

    useEffect(() => {
        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": "${symbol}",
        "theme": "dark",
        "timezone": "US/Mountain",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "height": 700
      }`;

        if (container.current) {
            container.current.innerHTML = "";
            container.current.appendChild(script);
        }
    }, [symbol]);

    return (
        <>
            <Header2 title="Forex Chart" />
            <div className="tradingview-widget-container" ref={container}>
                <div className="tradingview-widget-container__widget"></div>
            </div>
        </>
    );
}

export default memo(ForexChart);
