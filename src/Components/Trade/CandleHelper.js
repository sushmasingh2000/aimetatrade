// ─────────────────────────────────────────────
// Basic utilities
// ─────────────────────────────────────────────
export const SMA = (arr, n) =>
  arr.map((_, i) =>
    i < n - 1 ? null : arr.slice(i - n + 1, i + 1).reduce((s, v) => s + v, 0) / n
  );

export const EMA = (arr, n) => {
  const k = 2 / (n + 1);
  let ema = arr[0];
  return arr.map((v, i) => {
    if (i === 0) return v;
    ema = v * k + ema * (1 - k);
    return ema;
  });
};

// ─────────────────────────────────────────────
// Indicators
// ─────────────────────────────────────────────
export const RSI = (closes, n = 14) =>
  closes.map((_, i) => {
    if (i < n) return 50;
    let g = 0, l = 0;
    for (let j = i - n + 1; j <= i; j++) {
      const d = closes[j] - closes[j - 1];
      d > 0 ? (g += d) : (l -= d);
    }
    return 100 - 100 / (1 + g / (l || 1e-6));
  });

export const MACD = (closes) => {
  const ema12 = EMA(closes, 12);
  const ema26 = EMA(closes, 26);
  const diff = closes.map((_, i) => ema12[i] - ema26[i]);
  const dea = EMA(diff, 9);
  const hist = diff.map((d, i) => d - dea[i]);
  return { diff, dea, hist };
};

export const BOLL = (closes, n = 20, mult = 2) => {
  const mid = SMA(closes, n);
  const upper = [];
  const lower = [];

  closes.forEach((_, i) => {
    if (i < n - 1) {
      upper.push(null);
      lower.push(null);
      return;
    }
    const slice = closes.slice(i - n + 1, i + 1);
    const mean = mid[i];
    const std = Math.sqrt(
      slice.reduce((s, v) => s + (v - mean) ** 2, 0) / n
    );
    upper.push(mean + mult * std);
    lower.push(mean - mult * std);
  });

  return { upper, mid, lower };
};

// ─────────────────────────────────────────────
// Volume
// ─────────────────────────────────────────────
export const VolumeMA = (vols, n) => SMA(vols, n);

// ─────────────────────────────────────────────
// Chart transforms
// ─────────────────────────────────────────────
export const getPriceRange = (candles) => {
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  return { max, min, range: max - min || 1 };
};

export const mapPriceToY = (price, min, range, height) =>
  ((min + range - price) / range) * height;