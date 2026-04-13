import React, { useEffect, useState } from "react";
import moment from "moment";
import { Typography } from "@mui/material";

export function CountdownTimer({ startDate }) {
  const [daysLeft, setDaysLeft] = useState(75);

  useEffect(() => {
    function updateTimer() {
      const now = moment();
      const end = moment(startDate).add(75, "days"); // end date fix karo

      const duration = moment.duration(end.diff(now));
      const remainingDays = Math.ceil(duration.asDays()); // important

      setDaysLeft(remainingDays > 0 ? remainingDays : 0);
    }

    updateTimer();

    const timerId = setInterval(updateTimer, 1000 * 60 * 60); // har 1 hour update

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