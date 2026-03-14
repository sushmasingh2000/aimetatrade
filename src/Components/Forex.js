import { Box, Container, Typography, Tabs, Tab, List, ListItem, Button } from '@mui/material';
import coin1 from "../assets/images/chart-icon/1.png";
import coin2 from "../assets/images/chart-icon/2.png";
import coin3 from "../assets/images/chart-icon/3.png";
import coin4 from "../assets/images/chart-icon/4.png";
import coin5 from "../assets/images/chart-icon/5.png";
import coin6 from "../assets/images/chart-icon/6.png";
import coin7 from "../assets/images/chart-icon/7.png";
import coin8 from "../assets/images/chart-icon/8.png";
import coin9 from "../assets/images/chart-icon/9.png";
import coin10 from "../assets/images/chart-icon/10.png";
import coin11 from "../assets/images/chart-icon/11.png";
import coin12 from "../assets/images/chart-icon/12.png";
import coin13 from "../assets/images/chart-icon/13.png";
import coin14 from "../assets/images/chart-icon/14.png";
import coin15 from "../assets/images/chart-icon/15.png";
import React from "react";
import { endpoint } from '../services/urls';
import axios from 'axios';
import { Skeleton } from "@mui/material";
import { useQuery } from 'react-query';

// ✅ TabPanel (MUI does NOT provide this)
function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function Forex() {
    const [value, setValue] = React.useState(0);
    // const [loading, setLoading] = React.useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // const [coins, setCoins] = React.useState([]);

    const fetchCoins = async () => {
        const res = await axios.get(endpoint.get_live_pair_data);
        return res?.data?.result || [];
    };

    const {
        data: coins = [],
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ["liveCoins"],
        queryFn: fetchCoins,
        refetchInterval: 30000, // 30 sec auto refresh
        staleTime: 25000,
        retry: 1,
    });

    // const getFilteredCoins = () => {
    //     if (value === 1) {
    //         return [...coins]
    //             .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    //             .slice(0, 15);
    //     }

    //     if (value === 2) {
    //         return [...coins]
    //             .sort((a, b) => b.total_volume - a.total_volume)
    //             .slice(0, 15);
    //     }

    //     return coins;
    // };

    return (
        <Container sx={{ px: '0px !important', paddingBottom: '60px' }}>
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" className='chart_lsit'>
                    <Tab label="CRYPTO" />
                    <Tab label="FOREX" />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Box className="main_chart">
                        <Box className='List_name_main' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>Pair </Typography>
                                                     <Typography sx={{ marginLeft: '90px' }}>Price </Typography>
                                                     <Typography>24h Charge </Typography>
                        </Box>
                        <List>
                            {
                                loading ?
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <ListItem key={i}>
                                            <Box sx={{ width: "30%" }}>
                                                <Skeleton variant="circular" width={30} height={30} sx={{ backgroundColor: "gray" }} />
                                                <Skeleton width={80} sx={{ backgroundColor: "gray" }} />
                                            </Box>

                                            <Skeleton width={60} sx={{ backgroundColor: "gray" }} />

                                            <Skeleton width={50} height={30} sx={{ backgroundColor: "gray" }} />
                                        </ListItem>
                                    ))
                                    :
                                    coins?.map((coin, i) => (
                                        <ListItem
                                            key={coin.id}
                                            className={
                                                coin.price_change_percentage_24h > 0
                                                    ? "green_list"
                                                    : "red_list"
                                            }
                                        >
                                            <Box sx={{ width: "30%" }}>
                                                <Box component="img" src={coin.image} alt={coin.name}></Box>
                                                <Typography variant="h6">
                                                    {coin.symbol.toUpperCase()} <span>/USD</span>
                                                </Typography>
                                            </Box>

                                            <Typography>
                                                {coin.current_price}
                                            </Typography>

                                            <Button
                                                variant="text"
                                                sx={{ width: "30px" }}
                                                className={
                                                    coin.price_change_percentage_24h > 0
                                                        ? "green_chart"
                                                        : "red_chart"
                                                }
                                            >
                                                {coin.price_change_percentage_24h?.toFixed(2)}%
                                            </Button>
                                        </ListItem>
                                    ))}
                        </List>



                    </Box>
                </TabPanel>
          
                <TabPanel value={value} index={1}>
                    <Box className="main_chart">
                        <Box className='List_name_main' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography>Pair </Typography>
                                                      <Typography sx={{ marginLeft: '90px' }}>Price </Typography>
                                                      <Typography>24h Charge </Typography>
                        </Box>
                        <List>
                            {
                                loading ?
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <ListItem key={i}>
                                            <Box sx={{ width: "30%" }}>
                                                <Skeleton variant="circular" width={30} height={30} sx={{ backgroundColor: "gray" }} />
                                                <Skeleton width={80} sx={{ backgroundColor: "gray" }} />
                                            </Box>

                                            <Skeleton width={60} sx={{ backgroundColor: "gray" }} />

                                            <Skeleton width={50} height={30} sx={{ backgroundColor: "gray" }} />
                                        </ListItem>
                                    ))
                                    :
                                    coins?.map((coin, i) => (
                                        <ListItem
                                            key={coin.id}
                                            className={
                                                coin.price_change_percentage_24h > 0
                                                    ? "green_list"
                                                    : "red_list"
                                            }
                                        >
                                            <Box sx={{ width: "30%" }}>
                                                <Box component="img" src={coin.image} alt={coin.name}></Box>
                                                <Typography variant="h6">
                                                    {coin.symbol.toUpperCase()} <span>/USD</span>
                                                </Typography>
                                            </Box>

                                            <Typography>
                                                {coin.current_price}
                                            </Typography>

                                            <Button
                                                variant="text"
                                                sx={{ width: "30px" }}
                                                className={
                                                    coin.price_change_percentage_24h > 0
                                                        ? "green_chart"
                                                        : "red_chart"
                                                }
                                            >
                                                {coin.price_change_percentage_24h?.toFixed(2)}%
                                            </Button>
                                        </ListItem>
                                    ))}
                        </List>

                    </Box>
                </TabPanel>
            </Box>
        </Container>


    )
}