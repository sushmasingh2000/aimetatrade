import React, { useEffect, useState } from "react";
import moment from "moment";
import { Typography } from "@mui/material";

// Timer component to show days remaining (75 days countdown from created date)
export function CountdownTimer({ startDate }) {
  const [daysLeft, setDaysLeft] = useState(75);

  useEffect(() => {
    function updateTimer() {
      const now = moment();
      const start = moment(startDate);
      const diff = now.diff(start, "days"); // days passed since startDate
      const remaining = 75 - diff;
      setDaysLeft(remaining > 0 ? remaining : 0);
    }

    updateTimer(); // initial call

    const timerId = setInterval(updateTimer, 1000 * 60 * 60 * 24); // update every day

    return () => clearInterval(timerId);
  }, [startDate]);

  return (
    <Typography
      sx={{ fontSize: "14px", fontWeight: "bold", color: "red", ml: 2, whiteSpace: "nowrap" }}
    >
      {daysLeft} days remaining
    </Typography>
  );
}