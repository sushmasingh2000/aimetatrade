import { Box, Container, ListItem, Typography, List, ListItemButton, Tab, Tabs } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Livechart from './Livechart';
import { Link } from "react-router-dom";
import Banner1 from "../assets/images/hero-slider/12.jpg";
import Banner2 from "../assets/images/hero-slider/12.jpg";
// import Banner3 from "../assets/images/hero-slider/3.png";
// import Banner4 from "../assets/images/hero-slider/4.png";
import withdrawal from "../assets/images/icons/withdrawal.png";
import deposit from "../assets/images/icons/deposit.png";
import transfer from "../assets/images/icons/transfer.png";
import more from "../assets/images/icons/more.png";
import Sidebar from "../Components/Sidebar";

import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { apiConnectorGet } from '../services/apiconnector';
import { endpoint } from '../services/urls';
import MarketTable from './MarketTable';
import { SYMBOL_TO_ID, useLiveMarket } from './UseLivemarket';
import ForexTicker from './ForexTicker';
// import Forex from './Forex';

const TICKER_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];

const COIN_LOGO = (baseSymbol) => {
  const symKey = `${baseSymbol.toUpperCase()}USDT`;
  const id = SYMBOL_TO_ID[symKey];

  if (id) {
    return `https://assets.coincap.io/assets/icons/${id}@2x.png`;
  }
  return `https://cryptoicons.org/api/color/${baseSymbol.toLowerCase()}/64`;
};

function CoinAvatar({ symbol }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          width: 20,
          height: 20,
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
        {symbol[0]}
      </div>
    );
  }

  return (
    <img
      src={COIN_LOGO(symbol)}
      alt={symbol}
      onError={() => setFailed(true)}
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        objectFit: "contain",
        backgroundColor: "#1a2030",
      }}
    />
  );
}

// ── Mini sparkline ─────────────────────────────────────────────────────────────
function TickerSparkline({ history, positive }) {
    const ref = useRef(null);
    const W = 80,
        H = 36;

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas || history.length < 2) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const min = Math.min(...history),
            max = Math.max(...history);
        const range = max - min || 1;
        const pad = 2;
        const pts = history.map((v, i) => ({
            x: pad + (i / (history.length - 1)) * (W - pad * 2),
            y: pad + (1 - (v - min) / range) * (H - pad * 2),
        }));

        const color = positive ? "#16C784" : "#ff5252";
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(
            0,
            positive ? "rgba(0,229,255,0.3)" : "rgba(255,82,82,0.3)",
        );
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            const mx = (pts[i - 1].x + pts[i].x) / 2;
            ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
        }
        ctx.lineTo(pts[pts.length - 1].x, H);
        ctx.lineTo(pts[0].x, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            const mx = (pts[i - 1].x + pts[i].x) / 2;
            ctx.bezierCurveTo(mx, pts[i - 1].y, mx, pts[i].y, pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }, [history, positive]);

    return <canvas ref={ref} style={{ width: W, height: H, display: "block" }} />;
}

function useIsNarrow(breakpoint = 350) {
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsNarrow(e.matches);
    setIsNarrow(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isNarrow;
}

function TickerCard({ coin }) {
    const isNarrow = useIsNarrow(350);

    if (!coin) {
        return null;
    }

    const change = Number(coin.priceChangePercent);
    const positive = change >= 0;
    const label = coin.symbol.replace("USDT", "");
    const baseSymbol = coin.symbol?.replace("USDT", "") ?? "?";

    const formatP = (p) => {
        const n = Number(p);
        if (n > 10000)
            return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
        if (n > 1) return n.toFixed(2);
        return n.toFixed(5);
    };

    return (
        <div
            style={{
                flex: 1,
                minWidth: 0,
                border: "1px solid rgba(235, 84, 222, 0.3)",
                borderRadius: "12px",
                padding: "2px 10px",
                display: "flex",
                flexDirection: "column",
                gap: "1px",
                boxShadow: "0 0 12px ",
                ml: 1,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                }}
            >
                <CoinAvatar symbol={baseSymbol} />
                <span
                    style={{
                        color: "white",
                        fontWeight: "700",
                        fontSize: isNarrow ? "11px" : "12px",
                    }}
                >
                    {label}
                    <span
                        style={{
                            color: "#4b5563",
                            fontSize: isNarrow ? "9px" : "10px",
                            marginLeft: isNarrow ? "1px" : "2px",
                        }}
                    >
                        USDT
                    </span>
                </span>
            </div>

            <div
                style={{
                    paddingTop: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        fontSize: "8px",
                        fontWeight: "700",
                        padding: "2px 0px",
                        borderRadius: "4px",
                        border: positive
                            ? "1px solid rgba(34,211,238,0.3)"
                            : "1px solid rgba(239,68,68,0.3)",
                        backgroundColor: positive
                            ? "rgba(34,211,238,0.1)"
                            : "rgba(239,68,68,0.1)",
                        color: positive ? "#16C784" : "#f87171",
                    }}
                >
                    {positive ? "+" : ""}
                    {change.toFixed(2)}%
                </span>
                <span
                    style={{
                        fontSize: isNarrow ? "9px" : "11px",
                        fontWeight: "800",
                        letterSpacing: "-0.5px",
                        lineHeight: "1",
                        paddingLeft: "2px",
                        fontVariantNumeric: "tabular-nums",
                        color: positive ? "#16C784" : "#f87171",
                    }}
                >
                    {formatP(coin.lastPrice)}
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TickerSparkline
                    history={coin.history || []}
                    positive={positive}
                />
            </div>
        </div>
    );
}


export default function Dashboard() {
    const { coins } = useLiveMarket();

    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const { data: dashboard_data } = useQuery(
        ["home_page_news"],
        () => apiConnectorGet(endpoint?.home_page_news
        ),
        {
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        }
    );
    const member_dashboard = dashboard_data?.data?.result?.[0] || []

    return (
        <>
            <Box
                sx={{ minHeight: "100vh", bgcolor: "#1d1b1b", pb: 10 }}
            >
                <Sidebar />
                <Container sx={{ px: '10px !important' }}>
                    <Box sx={{ paddingTop: "10px" }} className="hero_slider">
                        <Swiper modules={[Autoplay, Pagination]}
                            slidesPerView={1}
                            spaceBetween={0}
                            loop
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            pagination={{ clickable: true }}>

                            <SwiperSlide>
                                <Box component="img" src={Banner1} alt="Banner1" sx={{ width: "100% ", borderRadius: 2 }}></Box>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Box component="img" src={Banner2} alt="Banner2" sx={{ width: "100%", borderRadius: 2 }}></Box>
                            </SwiperSlide>
                            {/* <SwiperSlide>
                                <Box component="img" src={Banner3} alt="Banner3" sx={{ width: "100%", borderRadius: 2 }}></Box>
                            </SwiperSlide>
                            <SwiperSlide>
                                <Box component="img" src={Banner4} alt="Banner4" sx={{ width: "100%", borderRadius: 2 }}></Box>
                            </SwiperSlide> */}

                        </Swiper>
                    </Box>
                    
                
                    <Box className="news_box">
                        <List>
                            <ListItem className="news_text">
                                <ListItemButton component={Link} to="/News">
                                    <i className="ri-megaphone-line"></i>
                                    <marquee><Typography sx={{ fontSize: "12px !important" }}><span>{member_dashboard?.m00_comment}</span></Typography></marquee>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/News">
                                    <i className="ri-arrow-right-line"></i>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>

                    <div style={{ display: "flex", gap: "2px", mt: 3 }} >
                        {TICKER_SYMBOLS.map((sym) => (
                            <TickerCard key={sym} coin={coins[sym]} />
                        ))}
                    </div>
                          {/* <ForexTicker /> */}
                    <Box className="main_btne">
                        <List>
                            <ListItem>
                                <ListItemButton component={Link} to="/Deposit">
                                    <Box component='img' src={deposit} alt="deposit"></Box>
                                    <Typography>Deposit</Typography>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/Withdrawal">
                                    <Box component='img' src={withdrawal} alt="withdrawal"></Box>
                                    <Typography>Withdrawal</Typography>
                                </ListItemButton>
                            </ListItem>

                            <ListItem>
                                <ListItemButton component={Link} to="/Transfer">
                                    <Box component='img' src={transfer} alt="transfer"></Box>
                                    <Typography>Transfer</Typography>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton component={Link} to="/More">
                                    <Box component='img' src={more} alt="more"></Box>
                                    <Typography>More</Typography>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Container>

                {/* <Box className="coins_box">
                    <Box>
                        <Typography variant='h4'>Quick buy coins</Typography>
                        <Typography>Safe and convenient</Typography>
                    </Box>
                    <Box className="next_bgn">
                        <ListItemButton component={Link} to="/dashboard">
                            <i class="ri-arrow-right-line"></i>
                        </ListItemButton>
                    </Box>
                </Box> */}
                <Box sx={{ mt: 1, px: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        TabIndicatorProps={{ style: { display: "none" } }}
                        sx={{
                            // background: "#1a1a2e",
                            borderRadius: "12px",
                            p: "4px",
                            minHeight: "auto",
                        }}
                    >
                        <Tab
                            label="Crypto"
                            sx={{
                                flex: 1,   // ✅ equal width
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px",
                                minHeight: "40px",
                                minWidth: 0,   // ✅ important for mobile
                                color: "#cfd8ff",
                                transition: "0.3s",
                                "&.Mui-selected": {
                                    background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                                    color: "#fff",
                                },
                            }}
                        />
                        <Tab
                            label="Forex"
                            sx={{
                                flex: 1,   // ✅ equal width
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "8px",
                                minHeight: "40px",
                                minWidth: 0,   // ✅ important
                                color: "#cfd8ff",
                                transition: "0.3s",
                                "&.Mui-selected": {
                                    background: "linear-gradient(90deg,#9f41ec,#7873f5)",
                                    color: "#fff",
                                },
                            }}
                        />
                    </Tabs>

                    <Box sx={{ mt: 3 }}>
                        {tabValue === 0 && <MarketTable type="crypto" />}
                        {tabValue === 1 && <Livechart />}
                    </Box>
                </Box>

            </Box>

        </>
    )
}