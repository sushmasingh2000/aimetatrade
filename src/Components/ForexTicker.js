import { useEffect, useRef } from "react";

export default function CryptoTicker() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BINANCE:BTCUSDT", title: "BTC / USDT" },
        { proName: "BINANCE:ETHUSDT", title: "ETH / USDT" },
        { proName: "BINANCE:BNBUSDT", title: "BNB / USDT" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}