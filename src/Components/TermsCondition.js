import { Box, Container, Typography } from '@mui/material';
import { ArrowLeft } from '@react-vant/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsAndConditions() {
    const navigate = useNavigate();

    return (
        <Container
            maxWidth="sm"
            disableGutters
            sx={{
                minHeight: '100vh',   // ✅ yahan add karo
                px: 2,
                py: 2,
                color: '#cfd8ff',
                lineHeight: 1.7,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 3,
                    mb: 2,
                    background: 'linear-gradient(90deg, #ad49ff, #7d18d2)',
                    color: '#fff',
                    borderRadius: '0 0 16px 16px',

                }}
            >
                <ArrowLeft
                    style={{ fontSize: 22, cursor: 'pointer' }}
                    onClick={() => navigate(-1)}
                />
                <Typography
                    sx={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 17,
                        fontWeight: 500,
                    }}
                >
                    Terms & Conditions
                </Typography>
                <Box sx={{ width: 22 }} />
            </Box>

            {/* Content */}
            {/* Content */}
            <div style={{ padding: '15px' }}>
                <p style={titleStyle}>Staking Terms & Conditions</p>

                <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                    <li style={textStyle}>Minimum Deposit in Staking $50.</li>

                    <li style={textStyle}>
                        All Deposit & Withdrawal on BEP20 (USDT) only.
                    </li>

                    <li style={textStyle}>
                        You have to Claim Daily for Trade Profit, Dividend Bonus & Community Bonus.
                        If you unable to Claim Daily so that you will lost your Earning.
                    </li>

                    <li style={textStyle}>
                        Instant Withdrawal Minimum $1.
                    </li>

                    <li style={textStyle}>
                        Deduction 5% on Every Withdrawal.
                    </li>

                    <li style={textStyle}>
                        Minimum Re-invest/Compounding $1, Re-invest Multiple Times in a Day.
                    </li>

                    <li style={textStyle}>
                        First Withdrawal after 24 hours from your Deposit.
                    </li>

                    <li style={textStyle}>
                        User can Reinvest/Compounding directly from their Income.
                    </li>

                    <li style={textStyle}>
                        Earning Limit 3x (Including all Bonuses) as per your Capital
                        (Excluding Rank Reward & Direct  Bonus).
                    </li>

                    <li style={textStyle}>
                        Rank-Up Bonus Every Sunday.
                    </li>
                </ul>

                <p
                    style={{
                        marginTop: 24,
                        fontSize: 12,
                        textAlign: 'center',
                        color: '#92A8E3',
                    }}
                >
                    Last updated: January 2026
                </p>
            </div>

        </Container>
    );
}

export default TermsAndConditions;

/* styles */
const titleStyle = {
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '4px',
};

const textStyle = {
    fontSize: '13px',
    margin: 0,
};
