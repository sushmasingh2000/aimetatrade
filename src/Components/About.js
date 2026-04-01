import Header2 from "./Layouts/Header2";
import { Box, Container, Typography } from "@mui/material";
import logo from "../assets/images/logo/logo.png";
import certificate1 from "../assets/images/certificate1.png";
import certificate2 from "../assets/images/certificate2.png";
import { Padding } from "@mui/icons-material";

export default function About() {
  return (
    <>
      <Box sx={styles.container}>
        <Header2 title="About" />
        <Container sx={styles.mainContainer}>
          <Box sx={styles.newsBox}>
            <Box component="img" src={logo} alt="logo" sx={styles.logo} />

            {/* <Box sx={styles.certificatesContainer}>
              <Box
                component="img"
                src={certificate1}
                alt="certificate 1"
                sx={styles.certificate}
              />
              <Box
                component="img"
                src={certificate2}
                alt="certificate 2"
                sx={styles.certificate}
              />
            </Box> */}

            <Box sx={styles.aboutSection}>
            <Typography sx={styles.aboutTitle}>About Us:</Typography>
            <Typography sx={styles.aboutDescription}>
              AI Meta Trade - Advance Your Wealth with Confidence Through Trading.
              Our Expansion plan includes gradual entry into the world's most promising financial markets.
               AI Meta Trade aims to build a global presence by opening regional offices and integrating local financial ecosystems.
              <br /><br />
               AI Meta Trade successfully applied for Sec license from the Vietnam Securities and Exchange Commission.
            </Typography>
          </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#05012B",
    paddingBottom: "20px",
  },

  mainContainer: {
    padding: "0px 0px !important",
    maxWidth: "600px !important",
  },

  newsBox: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "1px",
    padding: "2px 2px",
    marginBottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },

  logo: {
    width: "160px",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
    display: "block",
    paddingTop: "4px"
  },

  certificatesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    alignItems: "center",
  },

  certificate: {
    width: "100%",
    maxWidth: "450px",
    height: "auto",
    objectFit: "contain",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "block",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 24px rgba(125, 24, 210, 0.3)",
      borderColor: "rgba(125, 24, 210, 0.4)",
    },
  },

  aboutSection: {
    width: "100%",
    textAlign: "center",
    marginTop: "8px",
    marginBottom: "18px",
  },

  aboutTitle: {
    color: "#e3efff",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "12px",
    letterSpacing: "0.5px",
  },

  aboutDescription: {
    color: "#b8b8b8",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "1.7",
    maxWidth: "500px",
    margin: "0 auto",
    paddingRight: "5px",
    paddingLeft: "5px"
  },
};
