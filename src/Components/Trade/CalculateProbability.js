const SMA = (arr, period) =>
  arr.slice(-period).reduce((a, b) => a + b, 0) / period;

const EMA = (arr, period) => {
  const k = 2 / (period + 1);
  return arr.reduce((ema, price) => price * k + ema * (1 - k));
};

const RSI = (closes, period = 14) => {
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    diff >= 0 ? (gains += diff) : (losses -= diff);
  }
  const rs = gains / (losses || 1);
  return 100 - 100 / (1 + rs);
};

export const calculateProbabilities = (candles = []) => {
  if (candles.length < 30) return { call: 50, put: 50 };

  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  let callScore = 0;
  let putScore = 0;

  // EMA trend
  EMA(closes.slice(-9), 9) > EMA(closes.slice(-21), 21)
    ? (callScore += 2)
    : (putScore += 2);

  // RSI
  const rsi = RSI(closes);
  if (rsi < 30) callScore += 2;
  else if (rsi > 70) putScore += 2;

  // Volume confirmation
  if (volumes.at(-1) > SMA(volumes, 20)) {
    closes.at(-1) > closes.at(-2) ? callScore++ : putScore++;
  }

  // Bollinger
  const sma = SMA(closes, 20);
  const std = Math.sqrt(
    closes.slice(-20).reduce((s, c) => s + (c - sma) ** 2, 0) / 20
  );
  if (closes.at(-1) <= sma - 2 * std) callScore++;
  if (closes.at(-1) >= sma + 2 * std) putScore++;

  // Last candle
  closes.at(-1) > closes.at(-2) ? callScore++ : putScore++;

  const total = callScore + putScore;
  return {
    call: Math.round((callScore / total) * 100),
    put: Math.round((putScore / total) * 100),
  };
};