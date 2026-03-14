import { useState, useEffect } from 'react';
export const useBinanceSocket = (symbols) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (symbols.length === 0) return;

    // Binance streams are lowercase: btcusdt@ticker/ethusdt@ticker
    const  streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const ticker = message.data;
            setData((prev) => ({
        ...prev,        [ticker.s]: {          price: parseFloat(ticker.c).toFixed(2),
          change: parseFloat(ticker.P).toFixed(2),
          high: parseFloat(ticker.h).toFixed(2),
        }
      }));
    };

    return () => ws.close();
  }, [symbols]);

  return data;
};
 