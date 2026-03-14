// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
import Header2 from './Layouts/Header2';

function TradingViewWidget() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
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
          "symbol": "CRYPTOCAP:SHIB",
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
      container.current.appendChild(script);
    },
    []
  );


  return (
   
    <>
    <Header2></Header2>
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      
    </div>
    </>
  );
}

export default memo(TradingViewWidget);
