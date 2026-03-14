import React from 'react';
const TokenCard = ({ symbol, info }) => {
    if (!info) return null;

    const isPositive = info.change >= 0;

    return (
        <div style={cardStyle}>
            <h3 style={{ margin: 0 }}>{symbol}</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
                ${info.price}
            </div>
            <span style={{ color: isPositive ? '#27ae60' : '#e74c3c' }}>
                {isPositive ? '▲' : '▼'} {info.change}%
            </span>
        </div>
    );
}; const cardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    minWidth: '150px',
    textAlign: 'center'
};

export default TokenCard;
