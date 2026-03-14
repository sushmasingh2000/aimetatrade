import React, { useState } from 'react';
import TokenCard from '../hooks/TokenCard';
import { useBinanceSocket } from '../hooks/useBinanceSocket';
import Header2 from './Layouts/Header2';

function MArketdata() {
  const [tokens] = useState([
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'SOLUSDT',
    'XRPUSDT',
    'ADAUSDT',
    'DOGEUSDT',
    'AVAXUSDT',
    'MATICUSDT',
    'DOTUSDT'
  ]);

  const liveData = useBinanceSocket(tokens);

  return (
    <div>
      <Header2 title={"Market"} />
      <div style={listStyle}>
        {tokens.map(token => (
          <TokenCard
            key={token}
            info={liveData[token]}
          />
        ))}
      </div>
    </div>
  );
}

const listStyle = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "20px"
};

export default MArketdata;
