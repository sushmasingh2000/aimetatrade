

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Spot from "./Spot";
import Overview from "./Overview";
import SoonComming from "./SoonComming";
import Header2 from "./Layouts/Header2";
import Trade from "./Trade";
import Earning from "./Earning";
import { useLocation } from "react-router-dom";

export default function Assetstabs() {
 const location = useLocation();

  // ✅ Dynamic Tabs Array (Scalable)
  const tabs = useMemo(() => [
    { label: "Overview", component: <Overview /> },
    // { label: "Spot", component: <Spot /> }, // ❌ Commented safely
    { label: "Trade", component: <Trade /> },
    { label: "Earning", component: <Earning /> },
  ], []);

  // ✅ Safe localStorage value
  const getInitialValue = () => {
    const stored = Number(localStorage.getItem("lastlab") || 0);

    // Agar stored index available tabs se bada hai → reset to 0
    if (stored >= tabs.length) {
      return 0;
    }

    return stored;
  };

  const [value, setValue] = useState(getInitialValue);

  // ✅ Agar kisi page se tab pass ho raha ho (optional feature)
  useEffect(() => {
    if (
      location.state?.tab !== undefined &&
      location.state.tab < tabs.length
    ) {
      setValue(location.state.tab);
      localStorage.setItem("lastlab", location.state.tab);
    }
  }, [location.state, tabs.length]);

  // ✅ Handle Change
  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("lastlab", newValue);
  };

  return (
    <>
      <Header2 title="Assets" />
      <Box
        sx={{
          mb: 8,
          color: "#fff",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            minWidth: "auto",
            px: 0,
            py: 0,
          },
          "& .Mui-selected": {
            color: "#4feef9 !important",
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: 2,
          },
        }}
        className="main_tabs_vierview"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          className="neame_line"
          sx={{
            minHeight: "32px"
          }}
        >
          <Tab
            label="Overview"
            className="tade"
            sx={{ minHeight: "32px", padding: "6px 12px" }}
          />
          {/* <Tab
            label="Spot"
            sx={{ minHeight: "32px", padding: "6px 12px" }}
          /> */}
          <Tab
            label="Trade"
            sx={{ minHeight: "32px", padding: "6px 12px" }}
          />
          <Tab
            label="Earning"
            sx={{ minHeight: "32px", padding: "6px 12px" }}
          />
        </Tabs>


        {value === 0 && (
          <Box p={0}>
            <Overview />
          </Box>
        )}
        {/* {value === 1 && (
          <Box p={0}>
            <Spot />
          </Box>
        )} */}
        {value === 1 && (
          <Box p={0}>
            <Trade />
          </Box>
        )}
        {value === 2 && (
          <Box p={0}>
            <Earning />
          </Box>
        )}
      </Box>
    </>
  );
}
